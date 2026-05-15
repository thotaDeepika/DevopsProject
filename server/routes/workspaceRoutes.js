const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  joinWorkspace,
  getUserWorkspaces,
  getWorkspaceMembers,
  removeMember,
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createWorkspace).get(protect, getUserWorkspaces);
router.post('/join', protect, joinWorkspace);
router.get('/:id/members', protect, getWorkspaceMembers);
router.delete('/:id/members/:memberId', protect, removeMember);

module.exports = router;
