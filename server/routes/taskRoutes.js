const express = require('express');
const router = express.Router();
const {
  createTask,
  getBoardTasks,
  updateTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.get('/board/:boardId', protect, getBoardTasks);
router.put('/:id', protect, updateTask);

module.exports = router;
