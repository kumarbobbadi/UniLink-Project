const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { createEvent, getEvents, registerForEvent } = require('../controllers/eventController');

router.post('/create', protect, createEvent);
router.get('/', protect, getEvents);
router.post('/register', protect, registerForEvent);

module.exports = router;
