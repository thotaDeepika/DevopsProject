import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import API from '../services/api';
import socket from '../services/socket';

// Layout
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import ChatPanel from '../components/dashboard/ChatPanel';

// Views
import BoardView from '../components/dashboard/BoardView';
import TableView from '../components/dashboard/TableView';
import TeamView from '../components/dashboard/TeamView';
import SettingsView from '../components/dashboard/SettingsView';
import WelcomeView from '../components/dashboard/WelcomeView';

// Feature views
import AnalyticsView from '../components/AnalyticsView';
import AIAssistantView from '../components/AIAssistantView';
import FocusModeView from '../components/FocusModeView';
import WhiteboardView from '../components/WhiteboardView';

// Modals
import TaskModal from '../components/modals/TaskModal';
import WorkspaceModal from '../components/modals/WorkspaceModal';
import JoinModal from '../components/modals/JoinModal';
import TaskDetailModal from '../components/modals/TaskDetailModal';

// ─── Page transition config ───────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

// ─── Main component ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-synced view state — fixes back/forward button
  const sidebarView = searchParams.get('view') || 'dashboard';
  const boardView   = searchParams.get('board') || 'board';

  const setSidebarView = (view) => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('view', view); return p; });
  const setBoardView   = (view) => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('board', view); return p; });

  // ── Core state ──────────────────────────────────────────────────────────────
  const [tasks, setTasks]                     = useState([]);
  const [messages, setMessages]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [newMessage, setNewMessage]           = useState('');
  const [searchQuery, setSearchQuery]         = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [workspaces, setWorkspaces]           = useState([]);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [notifications, setNotifications]     = useState([]);
  const [onlineUsers, setOnlineUsers]         = useState(new Set());
  const [typingUsers, setTypingUsers]         = useState(new Set());
  const [isUploading, setIsUploading]         = useState(false);
  const [activityFeed, setActivityFeed]       = useState([]);
  const [stats, setStats]                     = useState(null);

  const fileInputRef    = useRef(null);
  const typingTimeout   = useRef(null);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [chatCollapsed,   setChatCollapsed]   = useState(false);
  const [selectedTask,    setSelectedTask]    = useState(null);

  // ── Modals ──────────────────────────────────────────────────────────────────
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isWsModalOpen,   setIsWsModalOpen]   = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [newTask,  setNewTask]  = useState({ title: '', desc: '', priority: 'medium', status: 'todo' });
  const [newWsName, setNewWsName] = useState('');
  const [joinCode,  setJoinCode]  = useState('');
  const [user, setUser]           = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  });

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error('Please sign in first');
      navigate('/auth');
    }
  }, [navigate]);

  // ── 1. Fetch workspaces on mount ────────────────────────────────────────────
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await API.get('/workspaces');
        setWorkspaces(res.data);
        if (res.data.length > 0) setActiveWorkspace(res.data[0]);
      } catch {
        /* silent — handled by interceptor */
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  // ── 2. Fetch workspace data & wire socket when workspace changes ─────────────
  useEffect(() => {
    if (!activeWorkspace) return;

    const load = async () => {
      try {
        // Tasks
        const boardsRes = await API.get(`/boards/workspace/${activeWorkspace._id}`);
        if (boardsRes.data.length > 0) {
          const taskRes = await API.get(`/tasks/board/${boardsRes.data[0]._id}`);
          setTasks(taskRes.data);
        } else {
          setTasks([]);
        }

        // Chat
        const chatRes = await API.get(`/chat/${activeWorkspace._id}`);
        setMessages(chatRes.data);

        // Members
        const membersRes = await API.get(`/workspaces/${activeWorkspace._id}/members`);
        setWorkspaceMembers(membersRes.data);

        // Activity & stats
        const [actRes, sRes] = await Promise.all([
          API.get(`/activity/${activeWorkspace._id}`),
          API.get(`/activity/${activeWorkspace._id}/stats`),
        ]);
        setActivityFeed(actRes.data);
        setStats(sRes.data);

        // Notifications
        const notifRes = await API.get('/notifications');
        setNotifications(notifRes.data);

        // Socket
        socket.connect();
        socket.emit('joinWorkspace', { workspaceId: activeWorkspace._id, userId: user._id });

        socket.on('onlineUsersList', (users) => setOnlineUsers(new Set(users)));
        socket.on('userOnline',  ({ userId }) => setOnlineUsers(p => new Set([...p, userId])));
        socket.on('userOffline', ({ userId }) => setOnlineUsers(p => { const s = new Set(p); s.delete(userId); return s; }));

        socket.on('userTyping',        ({ name }) => setTypingUsers(p => new Set([...p, name])));
        socket.on('userStoppedTyping', ({ name }) => setTypingUsers(p => { const s = new Set(p); s.delete(name); return s; }));

        socket.on('newMessage',   (msg)  => setMessages(p => [...p, msg]));
        socket.on('taskCreated',  (task) => setTasks(p => [...p, task]));
        socket.on('taskUpdated',  (task) => setTasks(p => p.map(t => t._id === task._id ? task : t)));

        socket.on('activityCreated', async () => {
          const [a, s] = await Promise.all([
            API.get(`/activity/${activeWorkspace._id}`),
            API.get(`/activity/${activeWorkspace._id}/stats`),
          ]);
          setActivityFeed(a.data);
          setStats(s.data);
        });

        socket.on('newNotification', async () => {
          const r = await API.get('/notifications');
          setNotifications(r.data);
          toast('🔔 New notification!', { icon: '🔔' });
        });
      } catch (err) {
        console.error('Error loading workspace data:', err);
      }
    };

    load();

    return () => {
      ['newMessage','taskCreated','taskUpdated','activityCreated','newNotification',
       'onlineUsersList','userOnline','userOffline','userTyping','userStoppedTyping','fileUploaded']
        .forEach(ev => socket.off(ev));
      socket.disconnect();
    };
  }, [activeWorkspace, user._id]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeWorkspace) return;
    try {
      socket.emit('stopTyping', { workspaceId: activeWorkspace._id, userId: user._id });
      await API.post('/chat', { workspaceId: activeWorkspace._id, text: newMessage });
      setNewMessage('');
    } catch { /* silent */ }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!activeWorkspace) return;
    socket.emit('typing', { workspaceId: activeWorkspace._id, userId: user._id, name: user.name });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', { workspaceId: activeWorkspace._id, userId: user._id });
    }, 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeWorkspace) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', activeWorkspace._id);
    try {
      setIsUploading(true);
      const res = await API.post('/files', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await API.post('/chat', { workspaceId: activeWorkspace._id, text: `Shared a file: ${res.data.fileUrl}` });
      toast.success('File uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    try {
      const res = await API.post('/workspaces', { name: newWsName });
      setWorkspaces(p => [...p, res.data]);
      setActiveWorkspace(res.data);
      setIsWsModalOpen(false);
      setNewWsName('');
      toast.success('Workspace created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create workspace');
    }
  };

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      const res = await API.post('/workspaces/join', { inviteCode: joinCode });
      setWorkspaces(p => [...p, res.data]);
      setActiveWorkspace(res.data);
      setIsJoinModalOpen(false);
      setJoinCode('');
      toast.success('Joined workspace!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join workspace');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !activeWorkspace) return;
    try {
      const boardsRes = await API.get(`/boards/workspace/${activeWorkspace._id}`);
      let boardId;
      if (boardsRes.data.length === 0) {
        const nb = await API.post('/boards', { workspaceId: activeWorkspace._id, name: 'Main Board' });
        boardId = nb.data._id;
      } else {
        boardId = boardsRes.data[0]._id;
      }
      await API.post('/tasks', {
        title:       newTask.title,
        description: newTask.desc,
        boardId,
        workspaceId: activeWorkspace._id,
        columnId:    newTask.status,
        priority:    newTask.priority,
      });
      setIsTaskModalOpen(false);
      setNewTask({ title: '', desc: '', priority: 'medium', status: 'todo' });
      toast.success('Task created!');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const idx = tasks.findIndex(t => t._id === draggableId);
    if (idx < 0) return;

    const original = [...tasks];
    const updated  = [...tasks];
    updated[idx] = { ...updated[idx], columnId: destination.droppableId };
    setTasks(updated);

    try {
      await API.put(`/tasks/${draggableId}`, { columnId: destination.droppableId });
    } catch {
      toast.error('Failed to move task');
      setTasks(original);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await API.delete(`/workspaces/${activeWorkspace._id}/members/${memberId}`);
      setWorkspaceMembers(p => p.filter(m => m._id !== memberId));
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // ── Derived ──────────────────────────────────────────────────────────────────
  const filteredTasks = useMemo(() =>
    tasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [tasks, searchQuery]);

  // ── Loading screen ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#070809]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[11px] font-black text-white">
              CS
            </div>
            <div className="absolute inset-0 rounded-2xl bg-blue-500/30 blur-lg animate-pulse-slow" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-500"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <p className="text-xs text-[#5c6570] font-medium tracking-wide">Loading workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Which view to render ──────────────────────────────────────────────────────
  const renderMain = () => {
    if (!activeWorkspace) {
      return <WelcomeView onCreateWorkspace={() => setIsWsModalOpen(true)} onJoinWorkspace={() => setIsJoinModalOpen(true)} />;
    }
    switch (sidebarView) {
      case 'analytics':  return <AnalyticsView workspaceId={activeWorkspace._id} />;
      case 'ai':         return <AIAssistantView workspaceId={activeWorkspace._id} />;
      case 'whiteboard': return <WhiteboardView workspaceId={activeWorkspace._id} />;
      case 'focus':      return <FocusModeView tasks={tasks} />;
      case 'team':       return <TeamView workspaceMembers={workspaceMembers} onlineUsers={onlineUsers} activeWorkspace={activeWorkspace} user={user} handleRemoveMember={handleRemoveMember} />;
      case 'settings':   return <SettingsView activeWorkspace={activeWorkspace} user={user} />;
      case 'chat':
        setSidebarView('dashboard');
        setTimeout(() => document.getElementById('chat-input')?.focus(), 150);
        return null;
      default:
        return boardView === 'board'
          ? <BoardView
              filteredTasks={filteredTasks}
              stats={stats}
              activityFeed={activityFeed}
              onDragEnd={onDragEnd}
              onAddTask={() => setIsTaskModalOpen(true)}
              onTaskClick={setSelectedTask}
            />
          : <TableView filteredTasks={filteredTasks} />;
    }
  };

  const showChat = sidebarView !== 'whiteboard';

  return (
    <div className="flex h-screen bg-[#070809] overflow-hidden" style={{ '--sidebar-width': '260px', '--topbar-height': '58px', '--chat-width': '320px' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1c1f',
            color: '#e5e7eb',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#1a1c1f' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#1a1c1f' } },
        }}
      />

      {/* Sidebar */}
      <Sidebar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
        messages={messages}
        user={user}
        onCreateWorkspace={() => setIsWsModalOpen(true)}
        onJoinWorkspace={() => setIsJoinModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          activeWorkspace={activeWorkspace}
          view={boardView}
          setView={setBoardView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          setNotifications={setNotifications}
          onNewTask={() => setIsTaskModalOpen(true)}
          sidebarView={sidebarView}
        />

        {/* Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Page area */}
          <div className={`flex-1 overflow-hidden flex flex-col min-w-0 ${sidebarView === 'whiteboard' ? '' : 'p-5'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${sidebarView}-${boardView}`}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-1 flex flex-col overflow-hidden h-full"
              >
                {renderMain()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Chat panel */}
          {showChat && (
            <ChatPanel
              messages={messages}
              typingUsers={typingUsers}
              onlineUsers={onlineUsers}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              handleTyping={handleTyping}
              handleFileUpload={handleFileUpload}
              activeWorkspace={activeWorkspace}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
              collapsed={chatCollapsed}
              onToggle={() => setChatCollapsed(v => !v)}
            />
          )}
        </main>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <TaskModal
            newTask={newTask}
            setNewTask={setNewTask}
            onClose={() => setIsTaskModalOpen(false)}
            onSubmit={handleCreateTask}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWsModalOpen && (
          <WorkspaceModal
            name={newWsName}
            setName={setNewWsName}
            onClose={() => setIsWsModalOpen(false)}
            onSubmit={handleCreateWorkspace}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isJoinModalOpen && (
          <JoinModal
            code={joinCode}
            setCode={setJoinCode}
            onClose={() => setIsJoinModalOpen(false)}
            onSubmit={handleJoinWorkspace}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
