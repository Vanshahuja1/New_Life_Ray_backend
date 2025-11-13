const express = require('express');
const controller = require('./auth.controller');

const router = express.Router();

// Email/password login
router.post('/login-email', controller.loginEmail);

// Phone OTP: request and verify
router.post('/request-otp', controller.requestOtp);
router.post('/verify-otp', controller.verifyOtp);

module.exports = router;
