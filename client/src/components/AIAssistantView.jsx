import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, MessageSquare, FileText, Bot, Loader2,
  ListTodo, Copy, Check, ChevronRight, Plus, RefreshCw,
  AlertCircle, Flag,
} from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';
import MarkdownContent from './ui/MarkdownContent';

// ─── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: 'digest',
    icon: FileText,
    label: 'Daily Digest',
    desc: "Today's team activity summary",
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    endpoint: 'daily-digest',
    responseKey: 'digest',
  },
  {
    id: 'chat',
    icon: MessageSquare,
    label: 'Chat Summary',
    desc: 'Summarise recent conversations',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    endpoint: 'summarize-chat',
    responseKey: 'summary',
  },
  {
    id: 'task',
    icon: ListTodo,
    label: 'Task Generator',
    desc: 'Generate & create tasks with AI',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    endpoint: 'generate-task-description',
    responseKey: 'description',
  },
];

// ─── Main component ────────────────────────────────────────────────────────────
const AIAssistantView = ({ workspaceId }) => {
  // Per-tab result cache — switching tabs no longer clears results
  const [results,   setResults]   = useState({ digest: null, chat: null, task: null });
  const [loading,   setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState('digest');
  const [copied,    setCopied]    = useState(false);

  // Task generator state
  const [taskTitle,    setTaskTitle]    = useState('');
  const [genDesc,      setGenDesc]      = useState('');   // editable AI-generated description
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskColumn,   setTaskColumn]   = useState('todo');
  const [creating,     setCreating]     = useState(false);

  const tab = TABS.find(t => t.id === activeTab);
  const currentResult = results[activeTab];

  // ── Fetch AI result ──────────────────────────────────────────────────────────
  const handleFetch = useCallback(async (tabId, extra = {}) => {
    if (!workspaceId) return;
    const t = TABS.find(x => x.id === tabId);
    if (!t) return;
    try {
      setLoading(true);
      const res = await API.post(`/ai/${t.endpoint}`, { workspaceId, ...extra });
      const text = res.data[t.responseKey]
        ?? res.data.description
        ?? res.data.digest
        ?? res.data.summary
        ?? '';
      setResults(prev => ({ ...prev, [tabId]: text }));
      if (tabId === 'task') setGenDesc(text); // sync editable field
    } catch (err) {
      const msg = err?.response?.data?.message || 'AI service error. Check your GEMINI_API_KEY.';
      setResults(prev => ({ ...prev, [tabId]: `__error__${msg}` }));
    } finally {
      setLoading(false);
      setCopied(false);
    }
  }, [workspaceId]);

  // ── Switch tab ───────────────────────────────────────────────────────────────
  const switchTab = (tabId) => {
    setActiveTab(tabId);
    // Auto-fetch digest and chat if no cached result yet
    if (tabId !== 'task' && !results[tabId]) {
      handleFetch(tabId);
    }
  };

  // ── Create task from AI description ─────────────────────────────────────────
  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !genDesc.trim() || !workspaceId) return;
    try {
      setCreating(true);
      // Get or create the default board
      const boardsRes = await API.get(`/boards/workspace/${workspaceId}`);
      let boardId;
      if (boardsRes.data.length === 0) {
        const nb = await API.post('/boards', { workspaceId, name: 'Main Board' });
        boardId = nb.data._id;
      } else {
        boardId = boardsRes.data[0]._id;
      }
      await API.post('/tasks', {
        title:       taskTitle,
        description: genDesc,
        boardId,
        workspaceId,
        columnId:    taskColumn,
        priority:    taskPriority,
      });
      toast.success('Task created!');
      // Reset task form
      setTaskTitle('');
      setGenDesc('');
      setResults(prev => ({ ...prev, task: null }));
      setTaskPriority('medium');
      setTaskColumn('todo');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const copyResult = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult.replace(/^__error__/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isError = typeof currentResult === 'string' && currentResult.startsWith('__error__');
  const errorMsg = isError ? currentResult.slice(9) : '';

  // ── Right panel content — extracted to avoid nested ternaries ─────────────
  const renderPanel = () => {
    if (loading) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sparkles size={22} className="text-purple-400" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-[#e0e4eb] mb-1">Gemini is thinking...</p>
            <p className="text-[11px] text-[#5c6570]">Generating your {tab?.label.toLowerCase()}</p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      );
    }

    if (isError) {
      return (
        <motion.div
          key="error"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-400" />
          </div>
          <p className="text-[13px] font-semibold text-red-400">AI Error</p>
          <p className="text-[11px] text-[#5c6570] max-w-xs">{errorMsg}</p>
          <button
            onClick={() => handleFetch(activeTab, activeTab === 'task' ? { title: taskTitle } : {})}
            className="btn-secondary px-4 py-2 text-[11px] mt-1 cursor-pointer"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    if (currentResult && activeTab !== 'task') {
      return (
        <motion.div
          key={`result-${activeTab}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-purple-400" />
              <span className="text-[13px] font-semibold text-white">{tab?.label}</span>
            </div>
            <button
              onClick={copyResult}
              className="flex items-center gap-1.5 text-[11px] text-[#6e7a88] hover:text-[#a0aab6] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06] cursor-pointer"
            >
              {copied
                ? <><Check size={12} className="text-emerald-400" /> Copied!</>
                : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto dark-scrollbar p-5">
            <MarkdownContent text={currentResult} />
          </div>
        </motion.div>
      );
    }

    if (currentResult && activeTab === 'task') {
      const priorityCls =
        taskPriority === 'high'   ? 'bg-red-500/10 border-red-500/20 text-red-400' :
        taskPriority === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      const columnLabel =
        taskColumn === 'in-progress' ? 'In Progress' :
        taskColumn === 'done'        ? 'Done' : 'To Do';

      return (
        <motion.div
          key="task-result"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-[13px] font-semibold text-white">AI Generated — Review &amp; Create</span>
            </div>
            <button
              onClick={copyResult}
              className="flex items-center gap-1.5 text-[11px] text-[#6e7a88] hover:text-[#a0aab6] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06] cursor-pointer"
            >
              {copied
                ? <><Check size={12} className="text-emerald-400" /> Copied!</>
                : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto dark-scrollbar p-5 space-y-4">
            <div>
              <label htmlFor="ai-task-title" className="form-label">Task Title</label>
              <input
                id="ai-task-title"
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-[13px] text-[#e0e4eb] focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label htmlFor="ai-task-desc" className="form-label">AI-Generated Description</label>
              <textarea
                id="ai-task-desc"
                value={genDesc}
                onChange={(e) => setGenDesc(e.target.value)}
                rows={8}
                className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-[13px] text-[#c8d0da] focus:outline-none focus:border-blue-500/40 transition-all resize-none leading-relaxed"
              />
              <p className="text-[10px] text-[#3d4450] mt-1">Edit the description before creating.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ai-task-priority" className="form-label">Priority</label>
                <select
                  id="ai-task-priority"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-[13px] text-[#e0e4eb] focus:outline-none focus:border-blue-500/40 transition-all cursor-pointer appearance-none"
                >
                  <option value="low"    className="bg-[#16181a]">Low</option>
                  <option value="medium" className="bg-[#16181a]">Medium</option>
                  <option value="high"   className="bg-[#16181a]">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="ai-task-column" className="form-label">Start In</label>
                <select
                  id="ai-task-column"
                  value={taskColumn}
                  onChange={(e) => setTaskColumn(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-[13px] text-[#e0e4eb] focus:outline-none focus:border-blue-500/40 transition-all cursor-pointer appearance-none"
                >
                  <option value="todo"        className="bg-[#16181a]">To Do</option>
                  <option value="in-progress" className="bg-[#16181a]">In Progress</option>
                  <option value="done"        className="bg-[#16181a]">Done</option>
                </select>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-medium ${priorityCls}`}>
              <Flag size={11} />
              {taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1)} priority · added to{' '}
              <span className="font-bold">{columnLabel}</span>
            </div>
          </div>
          <div className="px-5 py-4 border-t border-white/[0.06] shrink-0 flex gap-3">
            <button
              onClick={() => { setResults(prev => ({ ...prev, task: null })); setGenDesc(''); }}
              className="btn-secondary px-4 py-2.5 text-[12px] cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleCreateTask}
              disabled={creating || !taskTitle.trim() || !genDesc.trim()}
              className="btn-primary flex-1 py-2.5 text-[13px] cursor-pointer disabled:opacity-40"
              style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
            >
              {creating
                ? <><Loader2 size={14} className="animate-spin" /> Creating task...</>
                : <><Plus size={14} /> Create Task</>}
            </button>
          </div>
        </motion.div>
      );
    }

    // Empty state
    const emptyIcon = activeTab === 'task'
      ? <ListTodo size={22} className="text-[#3d4450]" />
      : <Bot size={22} className="text-[#3d4450]" />;

    const emptyContent = activeTab === 'task' ? (
      <>
        <p className="text-[13px] text-[#6e7a88] font-medium">Enter a task title</p>
        <p className="text-[11px] text-[#3d4450] max-w-xs">
          Type a title in the left panel and click <strong className="text-[#5c6570]">Generate with AI</strong>.
          Gemini will write the description and acceptance criteria.
        </p>
      </>
    ) : (
      <>
        <p className="text-[13px] text-[#6e7a88] font-medium">
          {activeTab === 'digest' ? 'Generating daily digest...' : 'Generating chat summary...'}
        </p>
        <p className="text-[11px] text-[#3d4450] max-w-xs">
          {activeTab === 'digest'
            ? "Gemini will summarise your team's activity from today."
            : 'Gemini will summarise the last 50 messages in your workspace chat.'}
        </p>
        <button
          onClick={() => handleFetch(activeTab)}
          className="btn-primary px-5 py-2 text-[12px] mt-1 cursor-pointer"
        >
          <Sparkles size={13} /> Generate Now
        </button>
      </>
    );

    return (
      <motion.div
        key={`empty-${activeTab}`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          {emptyIcon}
        </div>
        {emptyContent}
      </motion.div>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-glow-purple">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-[#f0f2f5] leading-none">AI Assistant</h2>
          <p className="text-[11px] text-[#5c6570] mt-0.5">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden min-h-0">

        {/* ── Left panel: tabs ── */}
        <div className="w-60 shrink-0 flex flex-col gap-2">
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            const hasResult = !!results[t.id];

            return (
              <div
                key={t.id}
                className={`rounded-2xl border transition-all duration-150 ${
                  isActive
                    ? `${t.bg} ${t.border}`
                    : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/[0.1]'
                }`}
              >
                <button
                  onClick={() => switchTab(t.id)}
                  className="w-full flex items-center gap-3 p-3.5 text-left cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? `${t.bg} ${t.color}` : 'bg-white/[0.05] text-[#5c6570]'
                  }`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-[13px] font-semibold ${isActive ? 'text-white' : 'text-[#9aa3b0]'}`}>
                        {t.label}
                      </p>
                      {hasResult && !isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#5c6570] mt-0.5">{t.desc}</p>
                  </div>
                  <ChevronRight size={13} className={`shrink-0 ${isActive ? t.color : 'text-[#3d4450]'}`} />
                </button>

                {/* Task input (inline, only when task tab active) */}
                <AnimatePresence>
                  {t.id === 'task' && isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5 space-y-2">
                        <input
                          type="text"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && taskTitle.trim() && !loading)
                              handleFetch('task', { title: taskTitle });
                          }}
                          placeholder="e.g. Add rate limiting to API"
                          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-[#e0e4eb] placeholder:text-[#3d4450] focus:outline-none focus:border-blue-500/40 transition-all"
                        />
                        <button
                          disabled={!taskTitle.trim() || loading}
                          onClick={() => handleFetch('task', { title: taskTitle })}
                          className="w-full btn-primary py-2 text-[12px] cursor-pointer disabled:opacity-40"
                        >
                          {loading && activeTab === 'task' ? (
                            <><Loader2 size={12} className="animate-spin" /> Generating...</>
                          ) : 'Generate with AI'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Re-fetch button for digest/chat */}
          {activeTab !== 'task' && currentResult && !loading && (
            <button
              onClick={() => handleFetch(activeTab)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-white/[0.07] text-[11px] text-[#5c6570] hover:text-[#9aa3b0] hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          )}
        </div>

        {/* ── Right panel: result ── */}
        <div className="flex-1 bg-white/[0.02] border border-white/[0.07] rounded-2xl flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {renderPanel()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantView;
