const express = require('express');
const router = express.Router();
const { 
  createBook
} = require('../controllers/book.controller');
const  authMiddleware = require('../middlewares/auth.middleware');

router.post('/',authMiddleware.verifyToken, createBook)

module.exports = router;
