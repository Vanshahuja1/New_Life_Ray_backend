const service = require('./free.service');

module.exports = {
  async kundliMake(req, res, next) {
    try {
      const { name, birthDate, birthTime, birthPlace } = req.body || {};
      const data = await service.kundliMake({ name, birthDate, birthTime, birthPlace });
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async kundliMatch(req, res, next) {
    try {
      const { personA, personB } = req.body || {};
      const data = await service.kundliMatch({ personA, personB });
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async numerology(req, res, next) {
    try {
      const { name, birthDate } = req.body || {};
      const data = await service.numerologyPredict({ name, birthDate });
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async tarotDaily(req, res, next) {
    try {
      const { question, name } = req.body || {};
      const data = await service.tarotDaily({ question, name });
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },
};
