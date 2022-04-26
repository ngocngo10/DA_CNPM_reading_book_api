const express = require('express');
const router = express.Router();
const {
  createBook,
  getBookById,
  searchBook,
  getAllBooks,
  getBooksInCategory,
  getBookByAuthor,
} = require('../controllers/book.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.verifyToken, createBook)
  .get('/', getAllBooks)
  .get('/category/:categoryId', getBooksInCategory)
  .get('/book/:bookId', getBookById)
  .get('/author', authMiddleware.verifyToken, getBookByAuthor)
  .get('/search', searchBook);

module.exports = router;
