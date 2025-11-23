const { Schema, model, Types } = require('mongoose');

const PurchaseSchema = new Schema(
  {
    buyer_id: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    item_type: { type: String, enum: ['ebook', 'course'], required: true, index: true },
    item_id: { type: Types.ObjectId, required: true, index: true },
    astrologer_id: { type: Types.ObjectId, ref: 'User', required: true, index: true },

    currency: { type: String, default: 'INR' },
    amount: { type: Number, required: true },

    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created', index: true },

    razorpay_order_id: { type: String, index: true },
    razorpay_payment_id: { type: String, index: true },
    razorpay_signature: { type: String },
    meta: { type: Object },
  },
  { timestamps: true }
);

PurchaseSchema.index({ buyer_id: 1, item_type: 1, item_id: 1 }, { unique: true });

module.exports = model('Purchase', PurchaseSchema);
