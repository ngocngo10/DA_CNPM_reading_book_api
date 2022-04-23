const express = require('express');
const router = express.Router();
const {
  createBook,
  getBookDetail,
  searchBook
} = require('../controllers/book.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', createBook);
router.get('/book/:bookId', getBookDetail);
router.get('/search', searchBook);

module.exports = router;
