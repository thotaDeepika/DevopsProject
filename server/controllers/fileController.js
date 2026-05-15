const File = require('../models/File');
const Workspace = require('../models/Workspace');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');

// @desc    Upload a file
// @route   POST /api/files
// @access  Private
const uploadFile = async (req, res) => {
  const { workspaceId } = req.body;

  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to upload to this workspace');
    }

    const newFile = await File.create({
      workspaceId,
      uploadedBy: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.path, // Cloudinary URL
      fileType: req.file.mimetype,
      size: req.file.size,
    });

    // Notify workspace members
    const io = req.app.get('io');
    io.to(`workspace_${workspaceId}`).emit('fileUploaded', newFile);

    // Notify other members
    workspace.members.forEach(async (memberId) => {
      if (memberId.toString() !== req.user._id.toString()) {
        await Notification.create({
          userId: memberId,
          type: 'file_uploaded',
          message: `${req.user.name} uploaded a new file: ${newFile.fileName}`,
          relatedId: newFile._id,
        });
        io.to(`user_${memberId}`).emit('newNotification');
      }
    });

    // Log activity
    await Activity.create({
      workspaceId,
      userId: req.user._id,
      type: 'file_uploaded',
      message: `${req.user.name} uploaded "${newFile.fileName}"`,
      meta: { fileId: newFile._id, fileUrl: newFile.fileUrl },
    });
    io.to(`workspace_${workspaceId}`).emit('activityCreated');

    res.status(201).json(newFile);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get workspace files
// @route   GET /api/files/workspace/:workspaceId
// @access  Private
const getWorkspaceFiles = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view files in this workspace');
    }

    const files = await File.find({ workspaceId: req.params.workspaceId })
      .populate('uploadedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.json(files);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  uploadFile,
  getWorkspaceFiles,
};
