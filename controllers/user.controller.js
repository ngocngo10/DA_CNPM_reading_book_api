const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

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

module.exports = {
  getUserProfile,
  updateUserProfile,
  updatePassword
}