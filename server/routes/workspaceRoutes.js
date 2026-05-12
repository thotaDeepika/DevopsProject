const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  joinWorkspace,
  getUserWorkspaces,
  getWorkspaceMembers,
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createWorkspace).get(protect, getUserWorkspaces);
router.post('/join', protect, joinWorkspace);
router.get('/:id/members', protect, getWorkspaceMembers);

module.exports = router;
