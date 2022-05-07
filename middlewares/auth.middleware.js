const jwt = require('jsonwebtoken');
const constants = require('../utils/constants')
const createError = require('http-errors');
const User = require('../models/user.model');

async function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    console.log("decoded.id" + decoded.id);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}

async function isAdmin(req, res, next) {
  if (req.user.roles.includes(constants.ADMIN)) {
    next();
  } else {
    next(createError(403));
  }
}

async function isStaff(req, res, next) {
  if (req.user.roles.includes(constants.STAFF)) {
    next();
  } else {
    next(createError(403));
  }
}
module.exports = { verifyToken, isAdmin, isStaff };
