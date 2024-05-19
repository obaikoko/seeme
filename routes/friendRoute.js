import express from 'express';
import {
  updateFriendStatus,
  addFriend,
  getUserFriends,
} from '../controllers/friendController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, getUserFriends).put(protect, updateFriendStatus);

router.post('/add', protect, addFriend);

export default router;
