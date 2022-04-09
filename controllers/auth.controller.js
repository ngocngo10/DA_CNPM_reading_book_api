const { generateToken } = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');
const User = require('../models/user.model');
require('dotenv').config();

// @desc    Register a new user
// @route   POST /api/auth/sign_up
// @access  Public
async function registerUser (req, res, next) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const { fullName, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400).json({ message: 'Email already exists' });
    }
    const user = await User.create({
      email,
      fullName,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Sign in function 
// @route   POST /api/auth/sign_in
// @access  Public
async function signIn (req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Email or password is invalid.' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(404).json({ message: 'Email or password is invalid.' });
    }
    return res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Forgot password function 
// @route   POST /api/auth/sign_in
// @access  Public
async function forgotPassword (req, res, next) {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Email is invalid.' });
    }
    //
    // handle send mail
    return res.status(200).json({
      message: "Please check your email to receive reset password url."
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser,
  signIn,
  forgotPassword
}
