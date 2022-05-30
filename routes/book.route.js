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
  deleteBook
} = require('../controllers/book.controller');

const {
  createNewChapter,
  getDetailChapter,
  getAllChapters,
  updateChapter,
  deleteChapterInBook,
} = require('../controllers/chapter.controller');

const {
  createReviewBook,
  getAllReviewsInBook,
  deleteReviewInBook
} = require('../controllers/review.controller');

const { validateCreateReview } = require('../middlewares/validate.middleware');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, createBook)
  .get('/', getAllBooks)
  .get('/category/:categoryId', getBooksInCategory)
  .get('/book/:bookId', getBookById)
  .put('/book/:bookId', verifyToken, updateBook)
  .get('/author', verifyToken, getBookByAuthor)
  .get('/search', searchBook)
  .delete('/book/:bookId', verifyToken, deleteBook);

router.post('/:bookId/chapters', verifyToken, createNewChapter) 
  .get('/:bookId/chapters/:chapterNumber', getDetailChapter)
  .put('/:bookId/chapters/:chapterId', verifyToken, updateChapter)
  .get('/:bookId/chapters', getAllChapters)
  .delete('/:bookId/chapters/:chapterId', verifyToken, deleteChapterInBook);

router.post('/:bookId/reviews', verifyToken, validateCreateReview, createReviewBook)
  .get('/:bookId/reviews', getAllReviewsInBook)
  .delete('/:bookId/reviews/:reviewId', verifyToken, deleteReviewInBook);

module.exports = router;
