const User = require('../models/user.model');

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

module.exports = {
  getUserProfile,
  updateUserProfile
}