const express = require('express');
// const req = require('express/lib/request');
const router = express.Router();
const { 
  registerUser,
  signIn,
  forgotPassword
} = require('../controllers/auth.controller');

router.post('/sign_up', registerUser)
  .post('/sign_in', signIn)
  .post('/forgot_password', forgotPassword);

module.exports = router;
