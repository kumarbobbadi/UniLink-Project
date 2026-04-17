const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPost, getPosts, likePost, commentPost, deletePost } = require('../controllers/postController');

router.post('/create', protect, createPost);
router.get('/', protect, getPosts);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
