const express = require('express');
// const req = require('express/lib/request');
const router = express.Router();
const { registerUser } = require('../controllers/user.controller');

router.route('/sign_up').post(registerUser);
// router.post('/login', authUser);

module.exports = router;
