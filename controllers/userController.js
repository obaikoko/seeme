import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendMail from '../utils/sendMail.js';

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

// @desc Update user Profile
// @route PUT api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, image, email, password } = req.body;

  // checks if user already exist
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    res.status(400);
    throw new Error(`${emailExist.email} already exist`);
  }

  const user = await User.findById(req.user._id);
  const sixDigitNumber = generateSixDigitNumber();
  const expirationTime = new Date(Date.now() + 60 * 10 * 1000);
  const currentTime = new Date();
  const timeDifferenceInMilliseconds = expirationTime - currentTime;
  const timeDifferenceInMinutes = Math.ceil(
    timeDifferenceInMilliseconds / (1000 * 60)
  );

  user.resetNumber = sixDigitNumber;
  user.resetNumberExpires = expirationTime;
  await user.save();

  if (!user) {
    res.status(404);
    throw new Error('User Not Found');
  }

  if (username && !email && !password) {
    user.username = username || user.username;
    user.image = image || user.image;
    const updatedUser = await user.save();
    res.status(200);
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      image: updatedUser.image.url,
      email: updatedUser.email,
    });
  }

  if (email && !password) {
    const subject = 'REQUEST FOR CHANGE OF EMAIL';
    const text = `A request has been made to change email address from ${user.email} to ${email} if you did not request for the change ignore else here is your on time password ${sixDigitNumber} which expires in ${timeDifferenceInMinutes} minutes `;

    try {
      await sendMail(user.email, subject, text);
      res.status(200);
      res.json({ message: `Email sent successfully! to ${user.email}` });
    } catch (error) {
      res.status(500);
      throw new Error('Email could not be sent.');
    }
  }

  if (!email && password) {
    const subject = 'REQUEST FOR CHANGE OF PASSWORD';
    const text = `A request for change of password has been made, if you did not request for the change ignore else here is your on time password ${sixDigitNumber} which expires in ${timeDifferenceInMinutes} minutes `;

    try {
      await sendMail(user.email, subject, text);
      res.status(200);
      res.json({ message: `Email sent successfully! to ${user.email}` });
    } catch (error) {
      res.status(500);
      throw new Error('Email could not be sent.');
    }
  }

  if (email && password) {
    const subject = 'REQUEST FOR CHANGE OF EMAIL AND PASSWORD';
    const text = `A request for change of email from ${user.email} to ${email}  and change of password has been made,  if you did not request for the change ignore else here is your on time password ${sixDigitNumber} which expires in ${timeDifferenceInMinutes} minutes `;

    try {
      await sendMail(user.email, subject, text);
      res.status(200);
      res.json({ message: `Email sent successfully! to ${user.email}` });
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
      res.status(200).json({ message: `Email sent successfully! to ${email}` });
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
  const user = await User.findById({ email });
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
  updateUserProfile,
  resetPassword,
  verifyOTP,
};
