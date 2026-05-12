const Task = require('../models/Task');
const Board = require('../models/Board');
const Workspace = require('../models/Workspace');
const Notification = require('../models/Notification');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { boardId, workspaceId, columnId, title, description, assignedTo, deadline, priority } = req.body;

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to create a task in this workspace');
    }

    const task = await Task.create({
      boardId,
      workspaceId,
      columnId,
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      deadline,
      priority,
    });

    // Send real-time event
    const io = req.app.get('io');
    io.to(`workspace_${workspaceId}`).emit('taskCreated', task);

    // Create notification if assigned to someone else
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: assignedTo,
        type: 'task_assigned',
        message: `You have been assigned a new task: ${title}`,
        relatedId: task._id,
      });
      io.to(`user_${assignedTo}`).emit('newNotification');
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get tasks for a board
// @route   GET /api/tasks/board/:boardId
// @access  Private
const getBoardTasks = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      res.status(404);
      throw new Error('Board not found');
    }

    const workspace = await Workspace.findById(board.workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view tasks for this board');
    }

    const tasks = await Task.find({ boardId: req.params.boardId }).lean();
    res.json(tasks);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const workspace = await Workspace.findById(task.workspaceId);
    if (!workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Send real-time event
    const io = req.app.get('io');
    io.to(`workspace_${task.workspaceId}`).emit('taskUpdated', updatedTask);

    res.json(updatedTask);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  createTask,
  getBoardTasks,
  updateTask,
};
