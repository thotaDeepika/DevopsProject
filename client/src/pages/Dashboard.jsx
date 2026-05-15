import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  LayoutGrid, 
  Target, 
  MessageSquare, 
  CheckSquare, 
  Settings, 
  ChevronDown, 
  Search, 
  Bell, 
  Plus, 
  MoreHorizontal,
  Filter,
  LayoutGrid as Grid,
  Table as TableIcon,
  Calendar,
  Paperclip,
  Send,
  X,
  Loader2,
  Users,
  Copy,
  Hash,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Zap,
  ArrowRight,
  BarChart3,
  Brain,
  PenTool,
  Sparkles
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import socket from '../services/socket';

import AnalyticsView from '../components/AnalyticsView';
import AIAssistantView from '../components/AIAssistantView';
import FocusModeView from '../components/FocusModeView';
import WhiteboardView from '../components/WhiteboardView';

const Dashboard = () => {
  // State
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [view, setView] = useState("board");
  const [activityFeed, setActivityFeed] = useState([]);
  const [stats, setStats] = useState(null);
  const [showDeadlines, setShowDeadlines] = useState(false);
  
  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isWsModalOpen, setIsWsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  // Form States
  const [newTask, setNewTask] = useState({ title: "", desc: "", priority: "medium", status: "todo" });
  const [newWsName, setNewWsName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  
  // Navigation & View State
  const navigate = useNavigate();
  const [sidebarView, setSidebarView] = useState("dashboard");

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/auth');
    }
  }, [navigate]);

  // 1. Initial Load: Fetch Workspaces
  const fetchWorkspaces = async () => {
    try {
      const wsRes = await API.get('/workspaces');
      setWorkspaces(wsRes.data);
      if (wsRes.data.length > 0 && !activeWorkspace) {
        setActiveWorkspace(wsRes.data[0]);
      }
    } catch (err) {
      console.error("Error fetching workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // 2. Fetch Tasks & Messages when Workspace Changes
  useEffect(() => {
    if (!activeWorkspace) return;

    const fetchWorkspaceData = async () => {
      try {
        const boardsRes = await API.get(`/boards/workspace/${activeWorkspace._id}`);
        if (boardsRes.data.length > 0) {
          const taskRes = await API.get(`/tasks/board/${boardsRes.data[0]._id}`);
          setTasks(taskRes.data);
        } else {
          setTasks([]);
        }

        const chatRes = await API.get(`/chat/${activeWorkspace._id}`);
        setMessages(chatRes.data);

        const membersRes = await API.get(`/workspaces/${activeWorkspace._id}/members`);
        setWorkspaceMembers(membersRes.data);

        // Activity Feed & Stats
        const [activityRes, statsRes] = await Promise.all([
          API.get(`/activity/${activeWorkspace._id}`),
          API.get(`/activity/${activeWorkspace._id}/stats`),
        ]);
        setActivityFeed(activityRes.data);
        setStats(statsRes.data);

        // Connect Socket
        socket.connect();
        socket.emit('joinWorkspace', { workspaceId: activeWorkspace._id, userId: user._id });

        socket.on('onlineUsersList', (users) => setOnlineUsers(new Set(users)));
        socket.on('userOnline', ({ userId }) => setOnlineUsers(prev => new Set([...prev, userId])));
        socket.on('userOffline', ({ userId }) => setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        }));

        socket.on('userTyping', ({ name }) => setTypingUsers(prev => new Set([...prev, name])));
        socket.on('userStoppedTyping', ({ name }) => setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(name);
          return newSet;
        }));

        socket.on('newMessage', (msg) => {
          setMessages(prev => [...prev, msg]);
        });

        socket.on('taskCreated', (task) => {
          setTasks(prev => [...prev, task]);
        });
        socket.on('taskUpdated', (updatedTask) => {
          setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        });
        socket.on('activityCreated', async () => {
          const [aRes, sRes] = await Promise.all([
            API.get(`/activity/${activeWorkspace._id}`),
            API.get(`/activity/${activeWorkspace._id}/stats`),
          ]);
          setActivityFeed(aRes.data);
          setStats(sRes.data);
        });

        // Notifications
        const notifRes = await API.get('/notifications');
        setNotifications(notifRes.data);

        socket.on('newNotification', async () => {
          const res = await API.get('/notifications');
          setNotifications(res.data);
          toast('🔔 New notification!');
        });
      } catch (err) {
        console.error("Error loading workspace data:", err);
      }
    };

    fetchWorkspaceData();

    return () => {
      socket.off('newMessage');
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('activityCreated');
      socket.off('newNotification');
      socket.off('onlineUsersList');
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('fileUploaded');
      socket.disconnect();
    };
  }, [activeWorkspace, user._id]);

  // Handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeWorkspace) return;
    
    try {
      socket.emit('stopTyping', { workspaceId: activeWorkspace._id, userId: user._id });
      await API.post('/chat', {
        workspaceId: activeWorkspace._id,
        text: newMessage
      });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { workspaceId: activeWorkspace._id, userId: user._id, name: user.name });
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
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
      const res = await API.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Send a chat message with file link
      await API.post('/chat', {
        workspaceId: activeWorkspace._id,
        text: `Shared a file: ${res.data.fileUrl}`
      });
      toast.success('File uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    try {
      const res = await API.post('/workspaces', { name: newWsName });
      setWorkspaces([...workspaces, res.data]);
      setActiveWorkspace(res.data);
      setIsWsModalOpen(false);
      setNewWsName("");
      toast.success('Workspace created successfully!');
    } catch (err) {
      console.error("Error creating workspace:", err);
      toast.error(err.response?.data?.message || 'Failed to create workspace');
    }
  };

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      const res = await API.post('/workspaces/join', { inviteCode: joinCode });
      setWorkspaces([...workspaces, res.data]);
      setActiveWorkspace(res.data);
      setIsJoinModalOpen(false);
      setJoinCode("");
      toast.success('Joined workspace successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join workspace");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !activeWorkspace) return;

    try {
      const boardsRes = await API.get(`/boards/workspace/${activeWorkspace._id}`);
      let boardId;
      
      if (boardsRes.data.length === 0) {
        const newBoard = await API.post('/boards', { workspaceId: activeWorkspace._id, name: "Main Board" });
        boardId = newBoard.data._id;
      } else {
        boardId = boardsRes.data[0]._id;
      }

      await API.post('/tasks', {
        title: newTask.title,
        description: newTask.desc,
        boardId,
        workspaceId: activeWorkspace._id,
        columnId: newTask.status,
        priority: newTask.priority
      });

      setIsTaskModalOpen(false);
      setNewTask({ title: "", desc: "", priority: "medium", status: "todo" });
      toast.success('Task created successfully!');
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error('Failed to create task');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    // Optimistic UI update
    const taskIndex = tasks.findIndex(t => t._id === draggableId);
    if (taskIndex > -1) {
      const originalTasks = [...tasks];
      const newTasks = [...tasks];
      newTasks[taskIndex] = { ...newTasks[taskIndex], columnId: destination.droppableId };
      setTasks(newTasks);

      try {
        await API.put(`/tasks/${draggableId}`, { columnId: destination.droppableId });
      } catch (error) {
        toast.error("Failed to move task");
        setTasks(originalTasks); // Revert on failure
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await API.delete(`/workspaces/${activeWorkspace._id}/members/${memberId}`);
      setWorkspaceMembers(prev => prev.filter(m => m._id !== memberId));
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [tasks, searchQuery]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-blue-600">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden font-inter">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-72 bg-[#1E1F21] text-white flex flex-col shrink-0">
        <div className="p-8 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/20">CS</div>
          <span className="font-bold text-2xl tracking-tight">CollabSpace</span>
        </div>

        <nav className="flex-1 px-6 space-y-8 mt-4 overflow-y-auto custom-scrollbar pb-10">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 px-4 flex items-center justify-between">
              Workspaces 
              <div className="flex items-center space-x-2">
                <Plus size={14} className="cursor-pointer hover:text-white transition-colors" onClick={() => setIsWsModalOpen(true)} />
                <Hash size={14} className="cursor-pointer hover:text-white transition-colors" onClick={() => setIsJoinModalOpen(true)} />
              </div>
            </div>
            <div className="space-y-2">
              {workspaces.map(ws => (
                <div 
                  key={ws._id}
                  onClick={() => setActiveWorkspace(ws)}
                  className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group ${activeWorkspace?._id === ws._id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all ${activeWorkspace?._id === ws._id ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50' : 'bg-gray-700'}`}></div>
                  <span className="font-semibold text-sm">{ws.name}</span>
                </div>
              ))}
              {workspaces.length === 0 && (
                <button 
                  onClick={() => setIsWsModalOpen(true)}
                  className="w-full border-2 border-dashed border-gray-800 rounded-2xl p-4 text-xs text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-all flex flex-col items-center space-y-2"
                >
                  <Plus size={20} />
                  <span>Create Workspace</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800/50">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 px-4">Menu</div>
            <div className="space-y-2">
              <div onClick={() => setSidebarView('dashboard')} className={`sidebar-item cursor-pointer flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${sidebarView === 'dashboard' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><LayoutGrid size={18} /> <span>Dashboard</span></div>
              <div onClick={() => setSidebarView('whiteboard')} className={`sidebar-item cursor-pointer flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${sidebarView === 'whiteboard' ? 'bg-orange-600/20 text-orange-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><PenTool size={18} /> <span>Whiteboard</span></div>
              <div onClick={() => setSidebarView('focus')} className={`sidebar-item cursor-pointer flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${sidebarView === 'focus' ? 'bg-emerald-600/20 text-emerald-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Brain size={18} /> <span>Focus Mode</span></div>
              <div onClick={() => setSidebarView('analytics')} className={`sidebar-item cursor-pointer flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${sidebarView === 'analytics' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><BarChart3 size={18} /> <span>Analytics</span></div>
              <div onClick={() => setSidebarView('ai')} className={`sidebar-item cursor-pointer flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${sidebarView === 'ai' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Sparkles size={18} /> <span>AI Assistant</span></div>
              <div onClick={() => setSidebarView('team')} className={`sidebar-item cursor-pointer flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${sidebarView === 'team' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Users size={18} /> <span>Team Members</span></div>
              <div onClick={() => { setSidebarView('dashboard'); document.getElementById('chat-input')?.focus(); }} className={`sidebar-item cursor-pointer flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-gray-400 hover:text-white hover:bg-white/5`}>
                <div className="flex items-center space-x-4"><MessageSquare size={18} /> <span>Global Chat</span></div>
                <span className="bg-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold text-white">{messages.length}</span>
              </div>
              <div onClick={() => setSidebarView('settings')} className={`sidebar-item cursor-pointer flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${sidebarView === 'settings' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Settings size={18} /> <span>Settings</span></div>
            </div>
          </div>
        </nav>

        <div className="p-6 bg-white/5 m-6 rounded-3xl border border-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="User" className="w-10 h-10 rounded-full border-2 border-blue-500/20" />
            <div className="overflow-hidden">
              <div className="text-sm font-bold truncate">{user.name || 'Guest'}</div>
              <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</div>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>CollabSpace</span>
              <span className="text-gray-200">/</span>
              <span className="text-blue-600">{activeWorkspace?.name || 'Welcome'}</span>
            </div>
            <div className="flex items-center space-x-8 mt-2">
              <div 
                onClick={() => setView('board')}
                className={`flex items-center space-x-2 text-sm font-bold pb-3 cursor-pointer transition-all relative ${view === 'board' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={16} /> <span>Board</span>
                {view === 'board' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
              </div>
              <div 
                onClick={() => setView('table')}
                className={`flex items-center space-x-2 text-sm font-bold pb-3 cursor-pointer transition-all relative ${view === 'table' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <TableIcon size={16} /> <span>Table</span>
                {view === 'table' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {activeWorkspace && (
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invite:</span>
                <span className="text-sm font-mono font-bold text-blue-600">{activeWorkspace.inviteCode}</span>
                <Copy size={14} className="text-gray-300 cursor-pointer hover:text-blue-600" onClick={() => { navigator.clipboard.writeText(activeWorkspace.inviteCode); alert("Code copied!"); }} />
              </div>
            )}
            
            <button 
              disabled={!activeWorkspace}
              onClick={() => setIsTaskModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center space-x-3 shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Plus size={20} /> <span>New Task</span>
            </button>

            <div className="flex items-center space-x-4 border-l pl-6 border-gray-100">
              <div className="relative">
                <div onClick={() => setShowNotifications(!showNotifications)} className="w-11 h-11 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-2xl cursor-pointer transition-all relative">
                  <Bell size={22} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                {showNotifications && (
                  <div className="absolute top-14 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                      <span className="font-bold text-sm">Notifications</span>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-bold cursor-pointer" onClick={async () => { await API.delete('/notifications'); setNotifications([]); }}>Clear All</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(n => (
                        <div key={n._id} onClick={() => handleMarkAsRead(n._id)} className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                          <p className={`text-xs ${!n.read ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{n.message}</p>
                          <span className="text-[9px] text-gray-400 mt-1 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      )) : <div className="p-6 text-center text-xs text-gray-400">No notifications</div>}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..." 
                  className="bg-gray-50 border-none pl-12 pr-6 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 w-72 transition-all placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Area */}
        <main className="flex-1 flex overflow-hidden p-10 space-x-10 bg-[#F8F9FB]">
          <AnimatePresence mode="wait">
            <motion.div
              key={!activeWorkspace ? 'no-workspace' : sidebarView === 'dashboard' ? view : sidebarView}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1 flex overflow-hidden min-w-0"
            >
              {!activeWorkspace ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[40px] shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mb-8">
                <LayoutGrid size={48} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Welcome to CollabSpace</h2>
              <p className="text-gray-500 text-center max-w-md mb-10 leading-relaxed font-medium">
                Create a workspace to start collaborating with your team or join an existing one using an invite code.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsWsModalOpen(true)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                  Create Workspace
                </button>
                <button 
                  onClick={() => setIsJoinModalOpen(true)}
                  className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                >
                  Join via Code
                </button>
              </div>
            </div>
          ) : sidebarView === 'team' ? (
            <div className="flex-1 bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 overflow-y-auto custom-scrollbar">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Team Members</h2>
                <p className="text-gray-500 font-medium">People collaborating in {activeWorkspace?.name}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaceMembers.map(member => {
                  const isOnline = onlineUsers.has(member._id);
                  return (
                    <div key={member._id} className="flex items-center p-5 rounded-3xl border border-gray-100 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all relative group">
                      <div className="relative mr-5">
                        <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-14 h-14 rounded-2xl shadow-sm" />
                        <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{member.name}</h4>
                        <p className="text-xs text-gray-400 font-medium">{member.email}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider ${isOnline ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{isOnline ? 'Active' : 'Offline'}</span>
                      </div>
                      {activeWorkspace?.owner === user._id && member._id !== user._id && (
                        <button onClick={() => handleRemoveMember(member._id)} className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-all bg-white p-1 rounded-full shadow-sm">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : sidebarView === 'settings' ? (
            <div className="flex-1 bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 overflow-y-auto custom-scrollbar">
              <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Workspace Settings</h2>
                <p className="text-gray-500 font-medium">Manage preferences for {activeWorkspace?.name}</p>
              </div>
              
              <div className="max-w-3xl space-y-8">
                {/* Profile Settings */}
                <div className="p-8 border border-gray-100 rounded-3xl bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><Settings className="mr-3 text-blue-600" size={20} /> General Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Desktop Notifications</h4>
                        <p className="text-xs text-gray-500 mt-1">Receive push notifications for mentions and new tasks.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200/60">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Dark Mode</h4>
                        <p className="text-xs text-gray-500 mt-1">Switch to a darker theme for less eye strain.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-8 border border-red-100 rounded-3xl bg-red-50/30">
                  <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-xs text-red-400 mb-6">Irreversible actions for this workspace.</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
                    Leave Workspace
                  </button>
                </div>
              </div>
            </div>
          ) : sidebarView === 'analytics' ? (
            <AnalyticsView workspaceId={activeWorkspace._id} />
          ) : sidebarView === 'ai' ? (
            <AIAssistantView workspaceId={activeWorkspace._id} />
          ) : sidebarView === 'whiteboard' ? (
            <WhiteboardView workspaceId={activeWorkspace._id} />
          ) : sidebarView === 'focus' ? (
            <FocusModeView tasks={tasks} />
          ) : view === 'board' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Productivity Stats Bar */}
              {stats && (
                <div className="grid grid-cols-4 gap-4 mb-6 shrink-0">
                  <StatCard icon={<CheckCircle2 size={20} className="text-emerald-600" />} label="Completed Today" value={stats.completedToday} bg="bg-emerald-50" trend="+" color="text-emerald-600" />
                  <StatCard icon={<Clock size={20} className="text-blue-600" />} label="Pending" value={stats.pending} bg="bg-blue-50" color="text-blue-600" />
                  <StatCard icon={<AlertTriangle size={20} className="text-red-500" />} label="Overdue" value={stats.overdue} bg="bg-red-50" color="text-red-500" urgent={stats.overdue > 0} />
                  <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                      <TrendingUp size={16} className="text-blue-600" />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-2">{stats.progress}%</div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-700" style={{ width: `${stats.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-1 space-x-6 overflow-hidden">
                {/* Kanban Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="flex space-x-8 overflow-x-auto pb-4 custom-scrollbar flex-1">
                    <BoardColumn title="TO DO" id="todo" color="#FBBF24" tasks={filteredTasks.filter(t => t.columnId === 'todo')} />
                    <BoardColumn title="IN PROGRESS" id="in-progress" color="#3B82F6" tasks={filteredTasks.filter(t => t.columnId === 'in-progress')} />
                    <BoardColumn title="DONE" id="done" color="#10B981" tasks={filteredTasks.filter(t => t.columnId === 'done')} />
                  </div>
                </DragDropContext>

                {/* Activity Feed + Deadlines Panel */}
                <div className="w-72 flex flex-col space-y-4 shrink-0 overflow-y-auto custom-scrollbar">
                  {/* Deadlines Widget */}
                  {stats && (stats.dueToday?.length > 0 || stats.dueSoon?.length > 0) && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center space-x-2 mb-4">
                        <AlertTriangle size={16} className="text-orange-500" />
                        <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Deadlines</span>
                      </div>
                      {stats.dueToday?.map(t => (
                        <div key={t._id} className="flex items-center space-x-3 py-2 border-b border-gray-50 last:border-0">
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{t.title}</p>
                            <p className="text-[10px] text-red-500 font-bold">Due Today!</p>
                          </div>
                        </div>
                      ))}
                      {stats.dueSoon?.map(t => (
                        <div key={t._id} className="flex items-center space-x-3 py-2 border-b border-gray-50 last:border-0">
                          <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0"></span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{t.title}</p>
                            <p className="text-[10px] text-orange-500 font-bold">{new Date(t.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Activity Feed */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap size={16} className="text-blue-600" />
                      <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Live Activity</span>
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    </div>
                    {activityFeed.length > 0 ? (
                      <div className="space-y-4">
                        {activityFeed.map(a => (
                          <div key={a._id} className="flex items-start space-x-3">
                            <img src={a.userId?.avatar || `https://ui-avatars.com/api/?name=${a.userId?.name || 'U'}&background=random&size=32`} alt={a.userId?.name} className="w-7 h-7 rounded-xl shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-gray-700 leading-snug font-medium">{a.message}</p>
                              <p className="text-[9px] text-gray-400 mt-0.5 font-bold">{new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity size={28} className="text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-300 font-bold">No activity yet</p>
                        <p className="text-[10px] text-gray-200 mt-1">Start creating tasks!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white rounded-[40px] border border-dashed border-gray-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  {view === 'table' ? <TableIcon size={36} /> : <Calendar size={36} />}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 capitalize mb-2">{view} View Coming Soon</h3>
                <p className="text-gray-500 font-medium">We're perfecting the board experience first!</p>
              </div>
            </div>
          )}
            </motion.div>
          </AnimatePresence>

          {/* Right Sidebar: Chat */}
          {sidebarView !== 'whiteboard' && (
            <aside className="w-96 shrink-0 bg-white rounded-[48px] shadow-2xl shadow-gray-200/50 flex flex-col border border-gray-100 overflow-hidden relative">
              <div className="p-10 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
              <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-[0.2em] text-[10px] mb-1">Team Chat</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold text-gray-400">{onlineUsers.size} Online</span>
                </div>
              </div>
              <MoreHorizontal size={20} className="text-gray-300 cursor-pointer hover:text-gray-600" />
            </div>
            
            <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 custom-scrollbar">
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <ChatMessage 
                    key={m._id || i} 
                    name={m.sender?.name || 'User'} 
                    time={new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                    msg={m.text} 
                    img={m.sender?.avatar || `https://ui-avatars.com/api/?name=${m.sender?.name || 'U'}&background=random`} 
                  />
                ))
              ) : (
                <div className="text-center text-gray-300 text-xs italic mt-32 px-10">
                  No messages yet in {activeWorkspace?.name || 'this workspace'}. Start the conversation!
                </div>
              )}
              {typingUsers.size > 0 && (
                <div className="text-xs text-gray-400 italic animate-pulse">
                  {Array.from(typingUsers).join(', ')} {typingUsers.size > 1 ? 'are' : 'is'} typing...
                </div>
              )}
            </div>

            <div className="px-10 pb-10 pt-4 shrink-0 bg-white">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current.click()} disabled={!activeWorkspace || isUploading} className="absolute left-4 text-gray-400 hover:text-blue-600 z-10 transition-colors disabled:opacity-50">
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                </button>
                <input 
                  id="chat-input"
                  disabled={!activeWorkspace}
                  type="text" 
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type a message..." 
                  className="w-full bg-gray-50 border-none rounded-[24px] py-5 pl-12 pr-16 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300 disabled:opacity-50"
                />
                <button type="submit" disabled={!activeWorkspace || !newMessage.trim()} className="absolute right-5 text-blue-600 hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100">
                  <Send size={24} />
                </button>
              </form>
            </div>
          </aside>
          )}
        </main>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
      {isTaskModalOpen && (
        <Modal title="Create New Task" onClose={() => setIsTaskModalOpen(false)}>
          <form onSubmit={handleCreateTask} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Task Title</label>
              <input required autoFocus type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="form-input" placeholder="e.g. Design System Audit" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Description</label>
              <textarea value={newTask.desc} onChange={(e) => setNewTask({...newTask, desc: e.target.value})} className="form-input h-28 resize-none py-4" placeholder="What needs to be done?" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Priority</label>
                <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className="form-input appearance-none">
                  <option value="low">Low</option>
                  <option value="medium">Med</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Column</label>
                <select value={newTask.status} onChange={(e) => setNewTask({...newTask, status: e.target.value})} className="form-input appearance-none">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-5">Create Task</button>
          </form>
        </Modal>
      )}
      </AnimatePresence>

      {/* Workspace Modal */}
      <AnimatePresence>
      {isWsModalOpen && (
        <Modal title="Create Workspace" onClose={() => setIsWsModalOpen(false)}>
          <form onSubmit={handleCreateWorkspace} className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Workspace Name</label>
              <input required autoFocus type="text" value={newWsName} onChange={(e) => setNewWsName(e.target.value)} className="form-input" placeholder="e.g. Design Team" />
              <p className="text-[10px] text-gray-400 mt-4 leading-relaxed uppercase tracking-tighter">Your team will use an invite code to join this workspace later.</p>
            </div>
            <button type="submit" className="btn-primary w-full py-5">Create Workspace</button>
          </form>
        </Modal>
      )}
      </AnimatePresence>

      {/* Join Modal */}
      <AnimatePresence>
      {isJoinModalOpen && (
        <Modal title="Join Workspace" onClose={() => setIsJoinModalOpen(false)}>
          <form onSubmit={handleJoinWorkspace} className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Invite Code</label>
              <input required autoFocus type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="form-input font-mono uppercase text-center text-xl tracking-[0.5em]" placeholder="XXXXXX" />
            </div>
            <button type="submit" className="btn-primary w-full py-5">Join Team</button>
          </form>
        </Modal>
      )}
      </AnimatePresence>
    </div>
  );
};

const Modal = ({ title, children, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
  >
    <motion.div 
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 10 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden"
    >
      <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h3>
        <X className="text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" onClick={onClose} />
      </div>
      <div className="p-10">{children}</div>
    </motion.div>
  </motion.div>
);

const BoardColumn = ({ title, color, tasks, id }) => (
  <div className="kanban-column shrink-0">
    <div className="flex items-center justify-between mb-8 px-2">
      <div className="flex items-center space-x-3">
        <div style={{ backgroundColor: color }} className="w-2.5 h-2.5 rounded-full shadow-lg shadow-current/50"></div>
        <span className="font-bold text-gray-900 tracking-tight">{title}</span>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">{tasks.length}</span>
      </div>
      <MoreHorizontal size={20} className="text-gray-300 cursor-pointer hover:text-gray-600" />
    </div>
    
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div 
          {...provided.droppableProps} 
          ref={provided.innerRef}
          className={`space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar min-h-[150px] transition-colors rounded-2xl ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
        >
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      transform: snapshot.isDragging ? provided.draggableProps.style.transform : 'translate(0, 0)'
                    }}
                  >
                    <TaskCard {...task} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <div className="border-2 border-dashed border-gray-100 rounded-[32px] h-32 flex flex-col items-center justify-center text-xs text-gray-300 font-bold italic space-y-2">
              <span>No tasks here yet</span>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

const TaskCard = ({ title, description, priority, assignees, createdAt, status, isDragging }) => (
  <div className={`task-card group transition-all duration-200 ${isDragging ? 'shadow-2xl shadow-blue-500/20 rotate-2 scale-105 border-blue-200 cursor-grabbing' : 'hover:translate-y-[-4px] cursor-grab'}`}>
    <div className="flex justify-between items-start mb-4">
      <h4 className="font-extrabold text-gray-900 leading-tight text-base group-hover:text-blue-600 transition-colors">{title}</h4>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal size={16} className="text-gray-400" />
      </div>
    </div>
    <p className="text-xs font-medium text-gray-400 leading-relaxed mb-6 line-clamp-3">{description || 'No description provided.'}</p>
    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
      <div className="flex items-center space-x-3">
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
          priority === 'high' ? 'text-red-600 bg-red-50' : 
          priority === 'medium' ? 'text-orange-600 bg-orange-50' : 
          'text-emerald-600 bg-emerald-50'
        }`}>{priority === 'medium' ? 'Med' : priority}</span>
        <span className="text-[10px] font-bold text-gray-300 uppercase">{new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
      <div className="flex -space-x-2">
        {assignees && assignees.length > 0 ? (
          assignees.map((img, i) => (
            <img key={i} src={img} alt="user" className="w-8 h-8 rounded-full border-2 border-white shadow-sm shrink-0" />
          ))
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-300 uppercase tracking-tighter">?</div>
        )}
      </div>
    </div>
  </div>
);

const ChatMessage = ({ name, time, msg, img }) => {
  const isLink = msg.includes('http://') || msg.includes('https://');
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
      className="flex items-start space-x-5"
    >
      <img src={img} alt={name} className="w-11 h-11 rounded-2xl border-2 border-white shadow-lg shrink-0 object-cover" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[13px] font-extrabold text-gray-900 truncate">{name}</span>
          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{time}</span>
        </div>
        <div className="bg-gray-50/80 p-5 rounded-[24px] rounded-tl-none border border-white/50 shadow-sm">
          {isLink ? (
            <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
              Shared a file: <a href={msg.split('Shared a file: ')[1] || msg} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">{msg.split('Shared a file: ')[1] || msg}</a>
            </p>
          ) : (
            <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{msg}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const OnlineUser = ({ name, img }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-transform">
    <div className="flex items-center space-x-4">
      <div className="relative">
        <img src={img} alt={name} className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm transition-all group-hover:border-blue-500/20" />
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-4 border-white rounded-full"></span>
      </div>
      <span className="text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">{name}</span>
    </div>
    <div className="w-2 h-2 rounded-full bg-green-500 shadow-xl shadow-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const StatCard = ({ icon, label, value, bg, color, urgent }) => (
  <div className={`bg-white rounded-3xl p-5 border shadow-sm transition-all ${urgent ? 'border-red-200 shadow-red-100' : 'border-gray-100'}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className={`p-2 rounded-xl ${bg}`}>{icon}</div>
    </div>
    <div className={`text-3xl font-extrabold ${urgent ? 'text-red-500' : 'text-gray-900'}`}>{value}</div>
    {urgent && <p className="text-[10px] text-red-400 font-bold mt-1 animate-pulse">Needs attention!</p>}
  </div>
);

export default Dashboard;
