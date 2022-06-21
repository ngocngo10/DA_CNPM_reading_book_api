const express = require('express');
const router = express.Router();
const {
  followBook,
  unfollowBook
} = require('../controllers/follow.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/follow', authMiddleware.verifyToken, followBook)
  .delete('/unfollow/book/:bookId', authMiddleware.verifyToken, unfollowBook);

module.exports = router;
