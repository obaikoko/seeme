import express from 'express';
import { updateFriendStatus, addFriend } from '../controllers/friendController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/', protect, updateFriendStatus);
router.post('/add', protect, addFriend);

export default router;
