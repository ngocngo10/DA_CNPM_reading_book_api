const express = require('express');
const router = express.Router();
const {
  createNewChapter,
  getDetailChapter,
  getAllChapters
} = require('../controllers/chapter.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.verifyToken, createNewChapter)
.get('/', getDetailChapter)
.get('/all_chapters/:bookId', getAllChapters);

module.exports = router;
