const express = require('express');
const controller = require('./admin.controller');

const router = express.Router();

// Upsert admin profile for a user
router.put('/:userId', controller.upsert);

// Get admin profile by user id
router.get('/:userId', controller.getByUser);

module.exports = router;
