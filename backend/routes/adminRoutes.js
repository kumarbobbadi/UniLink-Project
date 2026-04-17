const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers, deleteUser, approveEvent, getPendingEvents } = require('../controllers/adminController');

router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/user/:id', protect, adminOnly, deleteUser);
router.post('/approve-event', protect, adminOnly, approveEvent);
router.get('/pending-events', protect, adminOnly, getPendingEvents);

module.exports = router;
