const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyProfile, updateProfile, getUserProfile } = require('../controllers/profileController');

router.get('/me', protect, getMyProfile);
router.put('/update', protect, updateProfile);
router.get('/user/:userId', protect, getUserProfile);

module.exports = router;
