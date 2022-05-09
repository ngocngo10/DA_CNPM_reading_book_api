const express = require('express');
// const req = require('express/lib/request');
const router = express.Router();
const { 
  registerUser,
  signIn,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword
} = require('../controllers/auth.controller');

router.post('/sign_up', registerUser)
  .post('/sign_in', signIn)
  .post('/forgot_password', forgotPassword)
  .post('/verify_reset_password_code', verifyResetPasswordCode )
  .post('/reset_password', resetPassword);

module.exports = router;
