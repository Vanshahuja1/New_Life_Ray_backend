const express = require('express');
const controller = require('./payment.controller');

const router = express.Router();

// Create Razorpay order for an item (ebook or course)
router.post('/order', controller.createOrder);

// Verify payment from client after checkout
router.post('/verify', controller.verifyPayment);

// Razorpay webhook needs raw body for signature verification
router.post('/webhook', express.raw({ type: '*/*' }), controller.webhook);

module.exports = router;
