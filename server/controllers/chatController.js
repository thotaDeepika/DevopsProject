const Message = require('../models/Message');
const Workspace = require('../models/Workspace');

// @desc    Get messages for a workspace
// @route   GET /api/chat/:workspaceId
// @access  Private
const getWorkspaceMessages = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view messages in this workspace');
    }

    const messages = await Message.find({ workspaceId: req.params.workspaceId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  const { workspaceId, text, fileUrl } = req.body;

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to send a message in this workspace');
    }

    const message = await Message.create({
      workspaceId,
      sender: req.user._id,
      text,
      fileUrl,
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    // Emit via Socket.IO
    const io = req.app.get('io');
    io.to(`workspace_${workspaceId}`).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  getWorkspaceMessages,
  sendMessage,
};
