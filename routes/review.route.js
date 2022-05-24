const express = require('express');
const router = express.Router();
const {
  createReviewBook,
  getAllReviewsInBook,
  deleteReviewInBook
} = require('../controllers/review.controller');
const { validateCreateReview } = require('../middlewares/validate.middleware');
const {verifyToken, isAdmin} = require('../middlewares/auth.middleware');

router.post('/', verifyToken, validateCreateReview, createReviewBook)
.get('/:bookId', getAllReviewsInBook)
.delete('/:reviewId/book/:bookId', verifyToken, deleteReviewInBook);

module.exports = router;
