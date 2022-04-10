const express = require('express');
const router = express.Router();
const {
  createNewChapter,
  detailChapter
} = require('../controllers/chapter.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', createNewChapter)
.get('/', detailChapter);

module.exports = router;
