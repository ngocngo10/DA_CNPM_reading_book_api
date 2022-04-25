const express = require('express');
const router = express.Router();
const {
  createNewChapter,
  getDetailChapter,
  getAllChapter
} = require('../controllers/chapter.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.verifyToken, createNewChapter)
.get('/', authMiddleware.verifyToken, getDetailChapter)
.get('/all_chapters', authMiddleware.verifyToken);

module.exports = router;
