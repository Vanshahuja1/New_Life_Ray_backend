const Course = require('./course.model');

module.exports = {
  async create(req, res, next) {
    try {
      const { astrologer_id, title, description, modules, price, isactive } = req.body || {};
      const doc = await Course.create({ astrologer_id, title, description, modules: modules || [], price, isactive });
      res.json({ success: true, course: doc });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const update = req.body || {};
      const doc = await Course.findByIdAndUpdate(id, update, { new: true });
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, course: doc });
    } catch (err) {
      next(err);
    }
  },
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const doc = await Course.findByIdAndDelete(id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
  async get(req, res, next) {
    try {
      const { id } = req.params;
      const doc = await Course.findById(id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, course: doc });
    } catch (err) {
      next(err);
    }
  },
  async list(req, res, next) {
    try {
      const { astrologer_id, q, active } = req.query || {};
      const filter = {};
      if (astrologer_id) filter.astrologer_id = astrologer_id;
      if (active !== undefined) filter.isactive = active === 'true';
      if (q) filter.$text = { $search: q };
      const items = await Course.find(filter).sort({ createdat: -1 });
      res.json({ success: true, courses: items });
    } catch (err) {
      next(err);
    }
  },
};
