import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
  resetPassword,
  verifyOTP,
} from '../controllers/userController.js';

const router = express.Router();
router.post('/auth', authUser);
router.route('/').post(registerUser).get(getUsers);
// router.post('/', registerUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/resetPassword').post(resetPassword).put(verifyOTP);

export default router;
