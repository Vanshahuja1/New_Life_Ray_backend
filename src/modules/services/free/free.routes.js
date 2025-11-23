const express = require('express');
const controller = require('./free.controller');
const freeRateLimit = require('../../../middlewares/freeRateLimit');

const router = express.Router();

router.use(freeRateLimit);

router.post('/kundli', controller.kundliMake);
router.post('/match', controller.kundliMatch);
router.post('/numerology', controller.numerology);
router.post('/tarot-daily', controller.tarotDaily);

module.exports = router;
