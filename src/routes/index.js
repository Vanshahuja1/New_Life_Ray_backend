const express = require('express');
const router = express.Router();

const userRoutes = require('../modules/user/user.routes');
const authRoutes = require('../modules/auth/auth.routes');
const astrologerRoutes = require('../modules/astrologer/astrologer.routes');
const adminRoutes = require('../modules/admin/admin.routes');
const freeServiceRoutes = require('../modules/services/free/free.routes');
const ebookRoutes = require('../modules/commerce/ebook.routes');
const courseRoutes = require('../modules/commerce/course.routes');
const paymentRoutes = require('../modules/commerce/payment.routes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/astrologers', astrologerRoutes);
router.use('/admins', adminRoutes);
router.use('/services/free', freeServiceRoutes);
router.use('/commerce/ebooks', ebookRoutes);
router.use('/commerce/courses', courseRoutes);
router.use('/payments', paymentRoutes);
router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;
