const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const createHttpError = require('http-errors');
const { Book } = require('../models/book.model');
const Follow = require('../models/follow.model');

async function getUserProfile(req, res, next) {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select('-password -resetPasswordCode -roles -phoneNumber').exec();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error)
  }
}

async function updateUserProfile(req, res, next) {
  const userId = req.user._id;
  const { fullName, avatar } = req.body;
  try {
    const user = await User.findById(userId).select('-password -resetPasswordCode -phoneNumber').exec();
    user.fullName = fullName;
    user.avatar = avatar;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error)
  }
}

async function updatePassword(req, res, next) {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(404).json({ message: 'Old password is wrong.' });
    }
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    await user.save();
    res.status(200).json({message: "Password has been updated."});
  } catch (error) {
    console.error(error);
    next(error)
  }
}

// Admin controller
async function createStaffAccount(req, res, next) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const { fullName, email, password, roles } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400).json({ message: 'Email already exists' });
    }
    const avatar = process.env.DEFAULT_AVATAR;
    const user = await User.create({
      email,
      fullName,
      avatar,
      roles,
      password: bcrypt.hashSync(password, salt),
    });
    
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
}

async function updateRoles(req, res, next) {
  try {
    const { roles } = req.body;
    const { userId } = req.params;
    const user = await User.findById(userId)
    if (!user) {
      return next(createHttpError(404))
    }
    user.roles = roles;
    await user.save();
    
    res.status(200).json({ message: 'Updated roles.' });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404));
    }
    const defaultPassword = process.env.DEFAULT_PASSWORD;
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(defaultPassword, salt);
    await user.save();
    res.status(200).json({message: "Password has been reseted."});
  } catch (error) {
    console.error(error);
    next(error)
  }
}

async function deleteAccount(req, res, next) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404));
    }
    await Book.remove({ author: userId });
    await Follow.remove({ user: userId });
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(defaultPassword, salt);
    await user.save();
    res.status(200).json({message: "Password has been reseted."});
  } catch (error) {
    console.error(error);
    next(error)
  }
}
module.exports = {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  updateRoles,
  createStaffAccount,
  resetPassword,
  deleteAccount,
}