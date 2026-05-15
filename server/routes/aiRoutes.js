const express = require('express');
const router = express.Router();
const {
  summarizeChat,
  dailyDigest,
  generateTaskDescription,
  getAnalytics,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/summarize-chat', protect, summarizeChat);
router.post('/daily-digest', protect, dailyDigest);
router.post('/generate-task-description', protect, generateTaskDescription);
router.get('/analytics/:workspaceId', protect, getAnalytics);

module.exports = router;
