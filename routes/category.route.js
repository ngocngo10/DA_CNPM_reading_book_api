const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories
} = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, createCategory)
  .get('/', getAllCategories)
module.exports = router;
