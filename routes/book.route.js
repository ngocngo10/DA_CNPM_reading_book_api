const express = require('express');
const router = express.Router();
const { 
  createBook
} = require('../controllers/book.controller');

router.post('/', createBook)

module.exports = router;
