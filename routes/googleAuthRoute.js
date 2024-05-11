import express from 'express';
import passport from 'passport';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// @desc Authenticates  user
// @route POST api/users/logout
// @access public
router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Successful authentication, redirect home.

    generateToken(res, req.user._id);
    res.redirect('/');
  }
);

export default router;
