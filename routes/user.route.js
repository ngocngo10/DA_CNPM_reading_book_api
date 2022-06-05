const express = require('express');
const router = express.Router();
const { updateUserProfile, getUserProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router
  .get('/profile', authMiddleware.verifyToken, getUserProfile)
  .put('/profile', authMiddleware.verifyToken, updateUserProfile);

module.exports = router;
