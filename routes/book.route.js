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
  deleteBook,
  updateViewNumberBook,
  updateBookStatus,
  acceptBook,
  getAllAcceptedBook,
  getAllUnAcceptedBook
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
const { verifyToken, isAdmin, ignoreVerifyToken, isMod } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, createBook)
  .get('/', ignoreVerifyToken, getAllBooks)
  .get('/category/:categoryId', ignoreVerifyToken, getBooksInCategory)
  .get('/book/:bookId', ignoreVerifyToken, getBookById)
  .put('/book/:bookId', verifyToken, updateBook)
  .patch('/book/:bookId/status', verifyToken, updateBookStatus)
  .get('/author', verifyToken, getBookByAuthor)
  .get('/search', searchBook)
  .delete('/book/:bookId', verifyToken, deleteBook)
  .put('/book/:bookId/viewNumber', updateViewNumberBook)
  .patch('/book/:bookId/accept-book', verifyToken, isMod, acceptBook)
  .get('/accepted-books', verifyToken, isMod, getAllAcceptedBook)
  .get('/unaccepted-books', verifyToken, isMod, getAllUnAcceptedBook)

router.post('/:bookId/chapters', verifyToken, createNewChapter) 
  .get('/:bookId/chapters/:chapterNumber', getDetailChapter)
  .put('/:bookId/chapters/:chapterId', verifyToken, updateChapter)
  .get('/:bookId/chapters', getAllChapters)
  .delete('/:bookId/chapters/:chapterId', verifyToken, deleteChapterInBook);

router.post('/:bookId/reviews', verifyToken, validateCreateReview, createReviewBook)
  .get('/:bookId/reviews', getAllReviewsInBook)
  .delete('/:bookId/reviews/:reviewId', verifyToken, deleteReviewInBook);

module.exports = router;
