const express = require('express');
const router = express.Router();
const {
  createReviewBook,
  getAllReviewsInBook,
  deleteReviewInBookByAdmin,
  deleteReviewInBookByUser
} = require('../controllers/review.controller');
const { validateCreateReview } = require('../middlewares/validate.middleware');
const {verifyToken, isAdmin} = require('../middlewares/auth.middleware');

router.post('/', verifyToken, validateCreateReview, createReviewBook)
.get('/:bookId', getAllReviewsInBook)
.delete('/:reviewId/:bookId', verifyToken, isAdmin, deleteReviewInBookByAdmin)
.delete('/:reviewId/book/:bookId', verifyToken, deleteReviewInBookByUser);

module.exports = router;