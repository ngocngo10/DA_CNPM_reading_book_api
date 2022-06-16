const express = require('express');
// const req = require('express/lib/request');
const router = express.Router();
const { 
  registerUser,
  signIn,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
  // refreshToken
} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/sign_up', registerUser)
  .post('/sign_in', signIn)
  .post('/forgot_password', forgotPassword)
  .post('/verify_reset_password_code', verifyResetPasswordCode )
  .patch('/reset_password', authMiddleware.verifyToken, resetPassword)
  .post('/refreshToken', refreshToken);

module.exports = router;
