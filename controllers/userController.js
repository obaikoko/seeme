import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendMail from '../utils/sendMail.js';
import cloudinary from '../config/cloudinary.js';

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
      image: user.image.url,
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
      image: user.image.url,
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
  const user = await User.findById(req.user._id).populate(
    'friends',
    'username'
  );

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      image: user.image.url,
      email: user.email,
      friends: user.friends.map((friend) => friend.username),
    });
  }
});

// @description This is to get all users
// @Route GET /api/users
// privacy Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc Update user Profile
// @route PUT api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, image, password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User Not Found');
  }

  if (!image) {
    user.username = username || user.username;
    user.password = password || user.password;
    const updatedUser = await user.save();
    res.status(200);
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    const existingImageId = user?.image?.publicId || '';

    const newImageId = existingImageId.substring(
      existingImageId.indexOf('seeMe') + 'seeMe/'.length
    );

    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: 'seeMe',
      public_id: newImageId,
      transformation: [{ width: 640, height: 510, crop: 'scale' }],
    });

    user.username = username || user.username;
    user.image =
      {
        url: uploadedResponse.url,
        publicId: uploadedResponse.public_id,
      } ||
      user.image ||
      user.image;
    const updatedUser = await user.save();
    res.status(200);
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      image: {
        url: uploadedResponse.url,
        publicId: uploadedResponse.public_id,
      },
      email: updatedUser.email,
    });
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
    const expirationTime = new Date(Date.now() + 60 * 3 * 1000);
    const currentTime = new Date();
    const timeDifferenceInMilliseconds = expirationTime - currentTime;
    const timeDifferenceInMinutes = Math.ceil(
      timeDifferenceInMilliseconds / (1000 * 60)
    );

    user.resetNumber = sixDigitNumber;
    user.resetNumberExpires = expirationTime;
    await user.save();

    const subject = 'PASSWORD RESET';
    const text = `Here is your OTP which expires in ${timeDifferenceInMinutes} minutes: ${sixDigitNumber}`;

    try {
      await sendMail(email, subject, text);
      res
        .status(200)
        .json({ email: user.email, username: user.username, _id: user._id });
    } catch (error) {
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
// @route PUT /api/users/verifyOTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, newEmail, otp, newPassword } = req.body;
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
    newPassword &&
    (newPassword.length < minLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasDigit ||
      !hasSpecialChar)
  ) {
    res.status(400);
    throw new Error(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    );
  }

  user.password = newPassword || user.password;
  user.email = newEmail || user.email;

  user.resetNumber = '';
  user.resetNumberExpires = '';

  await user.save();
  generateToken(res, user._id);
  res.status(200);
  res.json({ message: 'Profile updated successfully' });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
  resetPassword,
  verifyOTP,
};
