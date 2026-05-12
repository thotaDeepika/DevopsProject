import React, { useState, useEffect, useMemo } from 'react';
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
  Grid,
  Table as TableIcon,
  Calendar,
  Paperclip,
  Send,
  X
} from 'lucide-react';

const INITIAL_TASKS = [
  { id: 1, title: "UI Design Mockups", desc: "UI design mockups ready you frontend, ready for feedback.", priority: "High", priorityColor: "red", date: "Oct 28", status: "todo", assignees: ['https://i.pravatar.cc/150?u=1'] },
  { id: 2, title: "User Flow diagrams", desc: "User flow diagrams and content elements to content strategy.", priority: "High", priorityColor: "red", date: "Oct 28", status: "todo", assignees: ['https://i.pravatar.cc/150?u=3'] },
  { id: 3, title: "Backend API", desc: "Backend API module and analysis and frontend market feedback.", priority: "Med", priorityColor: "yellow", date: "Nov 2", status: "in-progress", assignees: ['https://i.pravatar.cc/150?u=5', 'https://i.pravatar.cc/150?u=6'] },
  { id: 4, title: "Competitive Analysis", desc: "Competitive analysis to find analytical meta.", status: "done", date: "Oct 20", assignees: ['https://i.pravatar.cc/150?u=9'] },
];

const INITIAL_MESSAGES = [
  { id: 1, name: "Sarah", time: "11:32 AM", msg: "Working on frontend, ready for feedback", img: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Mark", time: "11:34 AM", msg: "@Sarah Looks great, finalizing API", img: "https://i.pravatar.cc/150?u=5" },
];

const Dashboard = () => {
  // State
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState("Marketing");
  const [view, setView] = useState("board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", desc: "", priority: "Med", status: "todo" });

  // Handlers
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now(),
      name: "Alex R.", // Current User
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: newMessage,
      img: "https://i.pravatar.cc/150?u=alex"
    };
    
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task = {
      ...newTask,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assignees: ['https://i.pravatar.cc/150?u=alex'],
      priorityColor: newTask.priority === 'High' ? 'red' : newTask.priority === 'Med' ? 'yellow' : 'green'
    };

    setTasks([...tasks, task]);
    setIsModalOpen(false);
    setNewTask({ title: "", desc: "", priority: "Med", status: "todo" });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1F21] text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-lg">CS</div>
          <span className="font-bold text-xl tracking-tight">CollabSpace</span>
        </div>

        <nav className="flex-1 px-4 space-y-6 mt-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4 flex items-center justify-between">
              Workspaces <ChevronDown size={14} />
            </div>
            <div className="space-y-1">
              {['Marketing', 'Product', 'Design'].map(ws => (
                <div 
                  key={ws}
                  onClick={() => setActiveWorkspace(ws)}
                  className={`sidebar-item ${activeWorkspace === ws ? 'active' : ''}`}
                >
                  <LayoutGrid size={18} /> <span>{ws}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">Menu</div>
            <div className="space-y-1">
              <div className="sidebar-item active"><LayoutGrid size={18} /> <span>Dashboard</span></div>
              <div className="sidebar-item flex items-center justify-between">
                <div className="flex items-center space-x-3 text-blue-400 font-medium">
                   <CheckSquare size={18} /> <span>Product Launch</span>
                </div>
              </div>
              <div className="sidebar-item"><MessageSquare size={18} /> <span>Messages</span></div>
              <div className="sidebar-item flex items-center justify-between">
                <div className="flex items-center space-x-3"><CheckSquare size={18} /> <span>Tasks</span></div>
                <span className="bg-blue-600 text-[10px] px-1.5 py-0.5 rounded-full">{tasks.length}</span>
              </div>
              <div className="sidebar-item"><Settings size={18} /> <span>Settings</span></div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>CollabSpace</span>
              <span>/</span>
              <span className="font-medium text-gray-900">Q4 Product Launch</span>
            </div>
            <div className="flex items-center space-x-6 mt-1">
              <div 
                onClick={() => setView('board')}
                className={`flex items-center space-x-2 text-sm font-semibold pb-2 cursor-pointer transition-all ${view === 'board' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                <Grid size={16} /> <span>Board</span>
              </div>
              <div 
                onClick={() => setView('table')}
                className={`flex items-center space-x-2 text-sm font-medium pb-2 cursor-pointer hover:text-gray-900 transition-all ${view === 'table' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                <TableIcon size={16} /> <span>Table</span>
              </div>
              <div 
                onClick={() => setView('timeline')}
                className={`flex items-center space-x-2 text-sm font-medium pb-2 cursor-pointer hover:text-gray-900 transition-all ${view === 'timeline' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                <Calendar size={16} /> <span>Timeline</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Plus size={18} /> <span>New Task</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
                <Bell size={20} />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..." 
                  className="bg-gray-50 border border-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                />
              </div>
              <div className="flex items-center space-x-3 border-l pl-6">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">Alex R.</div>
                  <div className="text-[10px] text-green-500 font-bold uppercase">Active</div>
                </div>
                <img src="https://i.pravatar.cc/150?u=alex" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Area */}
        <main className="flex-1 flex overflow-hidden p-8 space-x-8 bg-[#F8F9FB]">
          {view === 'board' ? (
            <div className="flex-1 flex space-x-8 overflow-x-auto pb-4 custom-scrollbar">
              <BoardColumn title="TO DO" color="#FBBF24" tasks={filteredTasks.filter(t => t.status === 'todo')} />
              <BoardColumn title="IN PROGRESS" color="#3B82F6" tasks={filteredTasks.filter(t => t.status === 'in-progress')} />
              <BoardColumn title="DONE" color="#10B981" tasks={filteredTasks.filter(t => t.status === 'done')} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {view === 'table' ? <TableIcon size={32} /> : <Calendar size={32} />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 capitalize">{view} View Coming Soon</h3>
                <p className="text-gray-500">We're currently focusing on the Kanban board experience.</p>
              </div>
            </div>
          )}

          {/* Right Sidebar: Chat */}
          <aside className="w-80 bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 flex flex-col border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-gray-900 uppercase tracking-tighter text-sm">Team Chat</h3>
              <MoreHorizontal size={16} className="text-gray-400" />
            </div>
            
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
              {messages.map(m => (
                <ChatMessage key={m.id} {...m} />
              ))}
            </div>

            <div className="px-8 pb-8 pt-4 shrink-0 bg-white">
              <form onSubmit={handleSendMessage} className="relative mb-8">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 pr-14 text-sm focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-400"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:scale-110 transition-transform">
                  <Send size={20} />
                </button>
              </form>

              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Online Members</h4>
                <div className="space-y-5">
                  <OnlineUser name="Sarah J." img="https://i.pravatar.cc/150?u=1" />
                  <OnlineUser name="Mark L." img="https://i.pravatar.cc/150?u=5" />
                  <OnlineUser name="Chloe A." img="https://i.pravatar.cc/150?u=9" />
                  <OnlineUser name="David R." img="https://i.pravatar.cc/150?u=12" />
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Create New Task</h3>
              <X className="text-gray-400 cursor-pointer hover:text-gray-900" onClick={() => setIsModalOpen(false)} />
            </div>
            <form onSubmit={handleCreateTask} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                <textarea 
                  value={newTask.desc}
                  onChange={(e) => setNewTask({...newTask, desc: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 h-24 focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option>Low</option>
                    <option>Med</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status</label>
                  <select 
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const BoardColumn = ({ title, color, tasks }) => (
  <div className="kanban-column">
    <div className="flex items-center justify-between mb-6">
      <div 
        style={{ backgroundColor: color }}
        className="px-4 py-1.5 rounded-lg text-white font-bold text-[10px] uppercase tracking-widest"
      >
        {title}
      </div>
      <MoreHorizontal size={18} className="text-gray-300 cursor-pointer hover:text-gray-600" />
    </div>
    <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
      {tasks.length > 0 ? (
        tasks.map(task => <TaskCard key={task.id} {...task} />)
      ) : (
        <div className="border-2 border-dashed border-gray-100 rounded-2xl h-24 flex items-center justify-center text-xs text-gray-300 font-medium italic">
          No tasks here yet
        </div>
      )}
    </div>
  </div>
);

const TaskCard = ({ title, desc, priority, priorityColor, date, assignees, status }) => (
  <div className="task-card active:scale-[0.98] transition-transform">
    <h4 className="font-bold text-gray-900 leading-tight mb-2 text-sm">{title}</h4>
    <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-2">{desc}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {status === 'done' ? (
          <span className="text-[9px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-md uppercase">Completed</span>
        ) : (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
            priorityColor === 'red' ? 'text-red-500 bg-red-50' : 
            priorityColor === 'yellow' ? 'text-yellow-600 bg-yellow-50' : 
            'text-green-500 bg-green-50'
          }`}>{priority}</span>
        )}
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{date}</span>
      </div>
      <div className="flex -space-x-1.5">
        {assignees.map((img, i) => (
          <img key={i} src={img} alt="user" className="w-6 h-6 rounded-full border-2 border-white shadow-sm shrink-0" />
        ))}
      </div>
    </div>
  </div>
);

const ChatMessage = ({ name, time, msg, img }) => (
  <div className="flex items-start space-x-4 animate-in slide-in-from-bottom-2 duration-300">
    <img src={img} alt={name} className="w-9 h-9 rounded-full border-2 border-white shadow-sm shrink-0" />
    <div className="flex-1">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-bold text-gray-900">{name}</span>
        <span className="text-[9px] text-gray-300 font-medium">{time}</span>
      </div>
      <div className="bg-gray-50/50 p-3 rounded-2xl rounded-tl-none border border-gray-50">
        <p className="text-[11px] text-gray-600 leading-relaxed">{msg}</p>
      </div>
    </div>
  </div>
);

const OnlineUser = ({ name, img }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <img src={img} alt={name} className="w-8 h-8 rounded-full border border-gray-50" />
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></span>
      </div>
      <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-900 transition-colors">{name}</span>
    </div>
    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
  </div>
);

export default Dashboard;
