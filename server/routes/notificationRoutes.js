const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  clearNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getUserNotifications)
  .delete(protect, clearNotifications);

router.put('/:id/read', protect, markAsRead);

module.exports = router;
