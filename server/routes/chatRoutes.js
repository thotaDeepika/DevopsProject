const express = require('express');
const router = express.Router();
const { getWorkspaceMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:workspaceId', protect, getWorkspaceMessages);
router.post('/', protect, sendMessage);

module.exports = router;
