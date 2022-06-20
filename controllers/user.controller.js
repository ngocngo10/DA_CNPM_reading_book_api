const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const createHttpError = require('http-errors');
const { Book } = require('../models/book.model');
const Follow = require('../models/follow.model');
const constants = require('../utils/constants')

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
async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().select('-password -resetPasswordCode -refreshToken -phoneNumber').exec();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    next(error)
  }
}

async function getUserById(req, res, next) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select('-password -resetPasswordCode -phoneNumber').exec();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error)
  }
}

async function createStaffAccount(req, res, next) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const { fullName, email, password, roles } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Email already exists' });
    }
    for (let item of roles) {
      if (!((constants.ADMIN == item) || (item == constants.USER) || (item == constants.MOD))) {
       return res.status(400).json({ message: 'Roles of user is wrong' });
      }
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

// async function updateUserById(req, res, next) {
//   try {
//     const { fullName, roles, password, isLock} = req.body;
//     const { userId } = req.params;
//     const user = await User.findById(userId)
//     if (!user) {
//       return next(createHttpError(404))
//     }
//     if (fullName) {
//       user.fullName = fullName;
//     }
//     if (roles) {
//       user.roles = roles;
//     }
//     if (password) {
//       const salt = bcrypt.genSaltSync(10);
//       user.password = bcrypt.hashSync(password, salt);
//     } 
    
//     user.isLock = isLock;
//     await user.save();
    
//     res.status(200).json({ message: 'Updated User.' });
//   } catch (error) {
//     next(error);
//   }
// }

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updatePassword,
  // updateUserById,
  createStaffAccount,
}