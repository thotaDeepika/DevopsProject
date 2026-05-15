const express = require('express');
const router = express.Router();
const { getWorkspaceActivity, getWorkspaceStats } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:workspaceId', protect, getWorkspaceActivity);
router.get('/:workspaceId/stats', protect, getWorkspaceStats);

module.exports = router;
