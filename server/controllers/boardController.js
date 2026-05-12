const Board = require('../models/Board');
const Workspace = require('../models/Workspace');

// @desc    Create a board in a workspace
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
  const { workspaceId, name } = req.body;

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to create a board in this workspace');
    }

    const defaultColumns = [
      { id: 'todo', title: 'To Do', order: 0 },
      { id: 'in_progress', title: 'In Progress', order: 1 },
      { id: 'done', title: 'Done', order: 2 },
    ];

    const board = await Board.create({
      workspaceId,
      name,
      columns: defaultColumns,
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get boards for a workspace
// @route   GET /api/boards/workspace/:workspaceId
// @access  Private
const getWorkspaceBoards = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view boards for this workspace');
    }

    const boards = await Board.find({ workspaceId: req.params.workspaceId }).lean();
    res.json(boards);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Update board columns
// @route   PUT /api/boards/:id/columns
// @access  Private
const updateBoardColumns = async (req, res) => {
  const { columns } = req.body;

  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      res.status(404);
      throw new Error('Board not found');
    }

    const workspace = await Workspace.findById(board.workspaceId);
    if (!workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to update this board');
    }

    board.columns = columns;
    await board.save();

    // Emit socket event to notify other clients in the workspace
    const io = req.app.get('io');
    io.to(`workspace_${board.workspaceId}`).emit('boardUpdated', board);

    res.json(board);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  createBoard,
  getWorkspaceBoards,
  updateBoardColumns,
};
