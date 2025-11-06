const express = require('express');
const router = express.Router();

const userRoutes = require('../modules/user/user.routes');

router.use('/users', userRoutes);
router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;
