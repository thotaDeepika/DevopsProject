const Activity = require('../models/Activity');
const Workspace = require('../models/Workspace');

// @desc    Get workspace activity feed
// @route   GET /api/activity/:workspaceId
// @access  Private
const getWorkspaceActivity = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized');
    }

    const activities = await Activity.find({ workspaceId: req.params.workspaceId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json(activities);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get productivity stats for a workspace
// @route   GET /api/activity/:workspaceId/stats
// @access  Private
const getWorkspaceStats = async (req, res) => {
  try {
    const Task = require('../models/Task');
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const allTasks = await Task.find({ workspaceId: req.params.workspaceId }).lean();

    const completedToday = allTasks.filter(t =>
      t.columnId === 'done' &&
      new Date(t.updatedAt) >= today &&
      new Date(t.updatedAt) < tomorrow
    ).length;

    const overdue = allTasks.filter(t =>
      t.deadline && new Date(t.deadline) < today && t.columnId !== 'done'
    ).length;

    const pending = allTasks.filter(t => t.columnId !== 'done').length;
    const total = allTasks.length;
    const done = allTasks.filter(t => t.columnId === 'done').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    const dueToday = allTasks.filter(t =>
      t.deadline &&
      new Date(t.deadline) >= today &&
      new Date(t.deadline) < tomorrow &&
      t.columnId !== 'done'
    );

    const dueSoon = allTasks.filter(t =>
      t.deadline &&
      new Date(t.deadline) >= tomorrow &&
      new Date(t.deadline) < nextWeek &&
      t.columnId !== 'done'
    );

    res.json({
      completedToday,
      pending,
      overdue,
      progress,
      total,
      done,
      dueToday,
      dueSoon,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { getWorkspaceActivity, getWorkspaceStats };
