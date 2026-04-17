const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createGroup, getGroups, joinGroup } = require('../controllers/groupController');

router.post('/create', protect, createGroup);
router.get('/', protect, getGroups);
router.post('/join', protect, joinGroup);

module.exports = router;
