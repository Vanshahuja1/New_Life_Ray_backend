const express = require('express');
const controller = require('./astrologer.controller');

const router = express.Router();

// Upsert astrologer profile for a user
router.put('/:userId', controller.upsert);

// Get astrologer profile by user id
router.get('/:userId', controller.getByUser);

module.exports = router;
