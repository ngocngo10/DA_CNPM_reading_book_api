const express = require('express');
const router = express.Router();
const {
  createNewChapter,
  getDetailChapter,
  getAllChapters,
  updateChapter
} = require('../controllers/chapter.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.verifyToken, createNewChapter)
.get('/', getDetailChapter)
.put('/:chapterId/book/:bookId', authMiddleware.verifyToken, updateChapter)
.get('/all_chapters/:bookId', getAllChapters);

module.exports = router;
