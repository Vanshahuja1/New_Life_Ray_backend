const Ebook = require('./ebook.model');

module.exports = {
  async create(req, res, next) {
    try {
      const { astrologer_id, title, description, file_url, price, isactive } = req.body || {};
      const doc = await Ebook.create({ astrologer_id, title, description, file_url, price, isactive });
      res.json({ success: true, ebook: doc });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const update = req.body || {};
      const doc = await Ebook.findByIdAndUpdate(id, update, { new: true });
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, ebook: doc });
    } catch (err) {
      next(err);
    }
  },
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const doc = await Ebook.findByIdAndDelete(id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
  async get(req, res, next) {
    try {
      const { id } = req.params;
      const doc = await Ebook.findById(id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, ebook: doc });
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
      const items = await Ebook.find(filter).sort({ createdat: -1 });
      res.json({ success: true, ebooks: items });
    } catch (err) {
      next(err);
    }
  },
};
