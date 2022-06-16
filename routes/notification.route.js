const express = require('express');
const router = express.Router();
const { 
  getNotifications,
  readAllNotifications,
  readNotification,
} = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware.verifyToken, getNotifications)
  .put('/read-all', authMiddleware.verifyToken, readAllNotifications)
  .put('/read', authMiddleware.verifyToken, readNotification);

module.exports = router;
