const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const { resetPasswordToken } = require('../utils/resetPasswordToken');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');
const nodemailer = require('nodemailer');
const path = require('path');
const User = require('../models/user.model');
const fs = require('fs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

async function registerUser (req, res, next) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const { fullName, email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400).json({ message: 'Email already exists' });
    }
    const avatar = process.env.DEFAULT_AVATAR;
    const user = await User.create({
      email,
      fullName,
      avatar,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles,
      avatar: user.avatar,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

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
      avatar: user.avatar,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword (req, res, next) {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Email is invalid.' });
    }
    const resetPasswordCode = Math.random().toString().substring(2, 8);
    user.resetPasswordCode = resetPasswordCode;
    await user.save();
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MASTER_EMAIL,
        pass: process.env.MASTER_PASSWORD
      }
    });

    var mailOptions = {
      from: process.env.MASTER_EMAIL,
      to: user.email,
      subject: 'Password Reset Confirm',
      html: fs.readFileSync(path.join(__dirname,'../views/mailers/reset_password_code.html'), 'utf-8')
        .replace('{user.fullName}', user.fullName)
        .replace('{user.resetPasswordCode}', user.resetPasswordCode)

    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      message: "Please check your email to receive password reset code."
    });
  } catch (error) {
    next(error);
  }
}

async function verifyResetPasswordCode (req, res, next) {
  try {
    const { email, resetPasswordCode } = req.body
    const user = await User.findOne({ email, resetPasswordCode })
    if (!user) {
      return res.status(404).json({ message: 'Code is invalid.' });
    }
    
    user.resetPasswordCode = '';
    await user.save();

    return res.status(200).json({
      message: "Verifing reset password code is successful.",
      token: resetPasswordToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword (req, res, next) {
  try {
    const { email, password} = req.body;
    // if (password !== confirmPassword) {
    //   return res.status(400).json({
    //     message: 'Confirm password is not the same as password'
    //   })
    // }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email is invalid.' });
    }
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);
    await user.save();

    return res.status(200).json({
      message: "Reseting password is successful."
    });
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  const token = req.body.refreshToken.replace('Bearer ', '');
  if (!token) {
    res.status(400).json({ message: 'no refresh token' });
  }
  let user;
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(400).json({ message: 'Invalid refresh token' });
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        message: 'Refresh token is expired.'
      });
    } else {
      return res.status(400).json({
        message: 'Refresh token is invalid.'
      });
    }
  }
  const newToken = generateToken(user._id);
  return res.status(200).json({
    token: newToken,
  });
}

module.exports = {
  registerUser,
  signIn,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
  refreshToken
}
