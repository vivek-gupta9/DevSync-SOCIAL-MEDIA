import express from 'express';
import { createPost, getAllPosts, likePost, commentPost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, createPost).get(getAllPosts);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);

export default router;
