const crypto = require('crypto');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
  const { name, description } = req.body;

  try {
    const inviteCode = crypto.randomBytes(4).toString('hex');

    const workspace = await Workspace.create({
      name,
      description,
      inviteCode,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(400);
    throw new Error('Failed to create workspace: ' + error.message);
  }
};

// @desc    Join a workspace
// @route   POST /api/workspaces/join
// @access  Private
const joinWorkspace = async (req, res) => {
  const { inviteCode } = req.body;

  try {
    const workspace = await Workspace.findOne({ inviteCode });

    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found with this invite code');
    }

    if (workspace.members.includes(req.user._id)) {
      res.status(400);
      throw new Error('You are already a member of this workspace');
    }

    workspace.members.push(req.user._id);
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get user's workspaces
// @route   GET /api/workspaces
// @access  Private
const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user._id })
      .lean();
    res.json(workspaces);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get workspace members
// @route   GET /api/workspaces/:id/members
// @access  Private
const getWorkspaceMembers = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('members', 'name email avatar')
      .lean();

    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found');
    }

    // Check if user is part of the workspace
    const isMember = workspace.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      res.status(403);
      throw new Error('Not authorized to view members of this workspace');
    }

    res.json(workspace.members);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  createWorkspace,
  joinWorkspace,
  getUserWorkspaces,
  getWorkspaceMembers,
};
