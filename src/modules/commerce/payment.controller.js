const crypto = require('crypto');
const Razorpay = require('razorpay');
const Ebook = require('./ebook.model');
const Course = require('./course.model');
const Purchase = require('./purchase.model');

function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new Error('Razorpay keys are missing');
  return new Razorpay({ key_id, key_secret });
}

async function resolveItem(item_type, item_id) {
  if (item_type === 'ebook') return Ebook.findById(item_id);
  if (item_type === 'course') return Course.findById(item_id);
  throw new Error('Invalid item_type');
}

module.exports = {
  async createOrder(req, res, next) {
    try {
      const { buyer_id, item_type, item_id, currency } = req.body || {};
      const item = await resolveItem(item_type, item_id);
      if (!item || item.isactive === false) return res.status(404).json({ success: false, message: 'Item not found' });

      const amountPaise = Math.round((item.price || 0) * 100);
      const rzp = getRazorpayInstance();
      const order = await rzp.orders.create({ amount: amountPaise, currency: currency || 'INR', receipt: `rcpt_${item_type}_${item_id}_${Date.now()}` });

      const purchase = await Purchase.findOneAndUpdate(
        { buyer_id, item_type, item_id },
        { astrologer_id: item.astrologer_id, amount: item.price, currency: currency || 'INR', status: 'created', razorpay_order_id: order.id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.json({ success: true, order, purchase_id: purchase._id, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
      next(err);
    }
  },

  async verifyPayment(req, res, next) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchase_id } = req.body || {};
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) throw new Error('Razorpay secret missing');

      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const expectedSignature = hmac.digest('hex');
      const valid = expectedSignature === razorpay_signature;
      if (!valid) return res.status(400).json({ success: false, message: 'Invalid signature' });

      const purchase = await Purchase.findByIdAndUpdate(
        purchase_id,
        { status: 'paid', razorpay_payment_id, razorpay_signature },
        { new: true }
      );
      if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });

      res.json({ success: true, purchase });
    } catch (err) {
      next(err);
    }
  },

  async webhook(req, res, next) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!secret) return res.status(400).json({ success: false, message: 'Webhook secret not configured' });

      const body = JSON.stringify(req.body);
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      if (expected !== signature) return res.status(400).json({ success: false, message: 'Invalid webhook signature' });

      const event = req.body?.event;
      const payload = req.body?.payload || {};

      if (event === 'payment.captured') {
        const orderId = payload?.payment?.entity?.order_id;
        const paymentId = payload?.payment?.entity?.id;
        if (orderId && paymentId) {
          await Purchase.findOneAndUpdate(
            { razorpay_order_id: orderId },
            { status: 'paid', razorpay_payment_id: paymentId },
            { new: true }
          );
        }
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
