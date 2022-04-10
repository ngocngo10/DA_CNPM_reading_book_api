const express = require('express');
const router = express.Router();
const {
  createBook,
} = require('../controllers/book.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', createBook)
module.exports = router;
