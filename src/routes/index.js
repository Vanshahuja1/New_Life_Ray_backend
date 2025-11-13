const express = require('express');
const router = express.Router();

const userRoutes = require('../modules/user/user.routes');
const authRoutes = require('../modules/auth/auth.routes');
const astrologerRoutes = require('../modules/astrologer/astrologer.routes');
const adminRoutes = require('../modules/admin/admin.routes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/astrologers', astrologerRoutes);
router.use('/admins', adminRoutes);
router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;
