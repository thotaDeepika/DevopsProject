const { GoogleGenerativeAI } = require('@google/generative-ai');
const Message = require('../models/Message');
const Activity = require('../models/Activity');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to verify workspace membership
const verifyMember = async (workspaceId, userId) => {
  const ws = await Workspace.findById(workspaceId);
  if (!ws || !ws.members.includes(userId)) throw new Error('Not authorized');
  return ws;
};

// @desc    Summarize recent chat messages using Gemini
// @route   POST /api/ai/summarize-chat
// @access  Private
const summarizeChat = async (req, res) => {
  const { workspaceId } = req.body;
  try {
    await verifyMember(workspaceId, req.user._id);

    const messages = await Message.find({ workspaceId })
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    if (messages.length === 0) {
      return res.json({ summary: 'No recent messages to summarize.' });
    }

    const chatText = messages
      .reverse()
      .map(m => `${m.sender?.name || 'User'}: ${m.text}`)
      .join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const prompt = `You are a helpful team assistant for a project management tool called CollabSpace. 
Summarize the following team chat conversation in 3-5 bullet points. Be concise and focus on key decisions, action items, and blockers mentioned.

Chat messages:
${chatText}

Format your response as bullet points starting with •`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    console.error("Gemini Error (Summarize):", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate "What changed today?" digest
// @route   POST /api/ai/daily-digest
// @access  Private
const dailyDigest = async (req, res) => {
  const { workspaceId } = req.body;
  try {
    await verifyMember(workspaceId, req.user._id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      workspaceId,
      createdAt: { $gte: today },
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    if (activities.length === 0) {
      return res.json({ digest: 'No activity recorded today yet. Start collaborating!' });
    }

    const activityText = activities
      .map(a => `• ${a.message} (at ${new Date(a.createdAt).toLocaleTimeString()})`)
      .join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const prompt = `You are a helpful team assistant for CollabSpace, a project management tool.
Based on today's team activity log, write a brief, encouraging daily digest in 2-4 sentences. Highlight key accomplishments and any important patterns you notice. Keep it positive and professional.

Today's activity:
${activityText}`;

    const result = await model.generateContent(prompt);
    const digest = result.response.text();

    res.json({ digest, activityCount: activities.length });
  } catch (error) {
    console.error("Gemini Error (Digest):", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate a task description using AI
// @route   POST /api/ai/generate-task-description
// @access  Private
const generateTaskDescription = async (req, res) => {
  const { title, workspaceId } = req.body;
  try {
    await verifyMember(workspaceId, req.user._id);

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const prompt = `You are a project management assistant. Generate a clear, concise task description for a software development task titled: "${title}".

Include:
- What needs to be done (1-2 sentences)
- Acceptance criteria (2-3 bullet points)

Keep it under 100 words. Be practical and specific.`;

    const result = await model.generateContent(prompt);
    res.json({ description: result.response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get rich analytics data for charts
// @route   GET /api/ai/analytics/:workspaceId
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    await verifyMember(req.params.workspaceId, req.user._id);

    const tasks = await Task.find({ workspaceId: req.params.workspaceId })
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name')
      .lean();

    // Tasks per column
    const columnCounts = {
      'To Do': tasks.filter(t => t.columnId === 'todo').length,
      'In Progress': tasks.filter(t => t.columnId === 'in-progress').length,
      'Done': tasks.filter(t => t.columnId === 'done').length,
    };

    // Priority breakdown
    const priorityCounts = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };

    // Tasks per member (busiest members)
    const memberTaskMap = {};
    tasks.forEach(t => {
      const assignee = t.assignedTo?.name || t.createdBy?.name || 'Unassigned';
      memberTaskMap[assignee] = (memberTaskMap[assignee] || 0) + 1;
    });
    const memberStats = Object.entries(memberTaskMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Activity over last 7 days
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = await Activity.countDocuments({
        workspaceId: req.params.workspaceId,
        createdAt: { $gte: day, $lt: nextDay },
      });

      weeklyActivity.push({
        day: day.toLocaleDateString('en', { weekday: 'short' }),
        actions: count,
      });
    }

    // Completion rate
    const completionRate = tasks.length > 0
      ? Math.round((tasks.filter(t => t.columnId === 'done').length / tasks.length) * 100)
      : 0;

    res.json({
      columnCounts,
      priorityCounts,
      memberStats,
      weeklyActivity,
      completionRate,
      totalTasks: tasks.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { summarizeChat, dailyDigest, generateTaskDescription, getAnalytics };
