const Admin = require('./admin.model');
const User = require('../user/user.model');

module.exports = {
  async upsert(req, res, next) {
    try {
      const { userId } = req.params;
      const payload = req.body || {};
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.role !== 'admin') return res.status(400).json({ message: 'User is not an admin' });

      const doc = await Admin.findOneAndUpdate(
        { user: user._id },
        { ...payload, user: user._id },
        { new: true, upsert: true }
      );
      res.json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  },

  async getByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const doc = await Admin.findOne({ user: userId }).populate('user');
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  },
};
