const express = require('express');
const router = express.Router();
const {
  createBook,
  getBookById,
  updateBook,
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
  .put('/book/:bookId', authMiddleware.verifyToken, updateBook)
  .get('/author', authMiddleware.verifyToken, getBookByAuthor)
  .get('/search', searchBook);

module.exports = router;
