import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
// @desc Auth user/set token
// @route POST api/users/auth
// @access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please add all field');
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid email or password');
  }
});

// @desc Register new user
// @route POST api/users/
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error('User already exist');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new error('Invalid User Data');
  }
});

// @desc Logout  user
// @route POST api/users/logout
// @access public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User Logged out ' });
});
// @desc Get user Profile
// @route GET api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  }
});

// @desc Update user Profile
// @route PUT api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = username || user.username;
    user.email = email || user.email;

    if (req.body.password) {
      user.password = req.body.password || user.password;
    }

    const updatedUser = await user.save();

    res.status(200);
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

// @desc POST update Password
// @privacy public
// @route POST /api/users/resetPassword

const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error(`No account found for ${email} `);
  } else {
    const sixDigitNumber = generateSixDigitNumber();
    const expirationTime = new Date(Date.now() + 120000);

    user.resetNumber = sixDigitNumber;
    user.resetNumberExpires = expirationTime;
    await user.save();

    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAILEMAIL,
          pass: process.env.GMAILPASSWORD,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });

      const mailOptions = {
        from: 'SeeMe',
        to: email,
        subject: 'PASSWORD RESET',
        text: `Here is your OTP which expires on ${expirationTime}: ${sixDigitNumber}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: `Email sent successfully! to ${email}` });
    } catch (error) {
      console.error(error);
      res.status(500);
      throw new Error('Email could not be sent.');
    }
  }

  function generateSixDigitNumber() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});

// @desc PUT update Password
// @privacy public
// @route POST /api/users/resetPassword
const verifyResetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(newPassword);

  if (!user) {
    res.status(404);
    throw new Error(`No account found for ${email}`);
  }

  if (user.resetNumber !== otp) {
    res.status(400);
    throw new Error('Invalid OTP');
  }

  if (user.resetNumberExpires < new Date()) {
    res.status(400);
    throw new Error('OTP has expired');
  }

  if (
    newPassword.length < minLength ||
    !hasUppercase ||
    !hasLowercase ||
    !hasDigit ||
    !hasSpecialChar
  ) {
    res.status(400);
    throw new Error(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    );
  }

  user.password = newPassword;

  user.resetNumber = '';
  user.resetNumberExpires = '';

  await user.save();
  generateToken(res, user._id);
  res.status(200);
  res.json({ message: 'Password reset successful' });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  verifyResetPassword,
};