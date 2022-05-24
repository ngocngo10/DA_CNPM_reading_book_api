const express = require('express');
const router = express.Router();
const {
  createReviewBook,
  getAllReviewsInBook,
  deleteReviewInBookByAdmin
} = require('../controllers/review.controller');
const { validateCreateReview } = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.verifyToken, validateCreateReview, createReviewBook)
.get('/:bookId', getAllReviewsInBook)
.delete('/:bookId/:reviewId', deleteReviewInBookByAdmin);

module.exports = router;