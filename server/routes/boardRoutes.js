const express = require('express');
const router = express.Router();
const {
  createBoard,
  getWorkspaceBoards,
  updateBoardColumns,
} = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBoard);
router.get('/workspace/:workspaceId', protect, getWorkspaceBoards);
router.put('/:id/columns', protect, updateBoardColumns);

module.exports = router;
