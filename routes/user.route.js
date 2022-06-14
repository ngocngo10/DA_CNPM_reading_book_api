const express = require('express');
const router = express.Router();
const { updateUserProfile, getUserProfile, updatePassword } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { getFollowedBooks } = require('../controllers/book.controller')

router
  .get('/profile', authMiddleware.verifyToken, getUserProfile)
  .put('/profile', authMiddleware.verifyToken, updateUserProfile)
  .put('/change-password', authMiddleware.verifyToken, updatePassword)
  .get('/followed-books', authMiddleware.verifyToken, getFollowedBooks)

module.exports = router;
