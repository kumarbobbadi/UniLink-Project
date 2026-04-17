const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendConnection, acceptConnection, getConnections } = require('../controllers/connectionController');

router.post('/send', protect, sendConnection);
router.put('/accept', protect, acceptConnection);
router.get('/', protect, getConnections);

module.exports = router;
