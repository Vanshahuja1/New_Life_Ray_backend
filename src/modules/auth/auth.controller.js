const { loginWithEmail, requestOtp, verifyOtp } = require('./auth.service');

module.exports = {
  async loginEmail(req, res, next) {
    try {
      const { email, password } = req.body || {};
      const user = await loginWithEmail({ email, password });
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  async requestOtp(req, res, next) {
    try {
      const { phone } = req.body || {};
      const result = await requestOtp({ phone });
      res.json({ success: true, phone: result.phone, code: result.code, expiresAt: result.expiresAt });
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req, res, next) {
    try {
      const { phone, code, name } = req.body || {};
      const user = await verifyOtp({ phone, code, name });
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },
};
