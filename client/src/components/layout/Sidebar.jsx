import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, PenTool, Brain, BarChart3, Sparkles,
  Users, MessageSquare, Settings, Plus, Hash,
  ChevronDown, LogOut, Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutGrid,    label: 'Dashboard',     desc: 'Kanban & tasks' },
  { id: 'whiteboard', icon: PenTool,      label: 'Whiteboard',    desc: 'Infinite canvas' },
  { id: 'focus',      icon: Brain,        label: 'Focus Mode',    desc: 'Pomodoro timer' },
  { id: 'analytics',  icon: BarChart3,    label: 'Analytics',     desc: 'Team insights' },
  { id: 'ai',         icon: Sparkles,     label: 'AI Assistant',  desc: 'Gemini powered' },
  { id: 'team',       icon: Users,        label: 'Team',          desc: 'Manage members' },
  { id: 'chat',       icon: MessageSquare, label: 'Team Chat',    desc: 'Conversations' },
  { id: 'settings',   icon: Settings,     label: 'Settings',      desc: 'Preferences' },
];

const WorkspaceAvatar = ({ name, isActive }) => {
  const initials = name?.charAt(0).toUpperCase() || '?';
  const colors = [
    'from-blue-600 to-blue-800',
    'from-purple-600 to-purple-800',
    'from-emerald-600 to-emerald-800',
    'from-amber-600 to-amber-800',
    'from-rose-600 to-rose-800',
    'from-indigo-600 to-indigo-800',
  ];
  const colorIdx = name ? name.charCodeAt(0) % colors.length : 0;
  return (
    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black shrink-0 bg-gradient-to-br ${
      isActive ? colors[colorIdx] : 'from-white/[0.08] to-white/[0.04]'
    } ${isActive ? 'text-white' : 'text-[#5c6570]'}`}>
      {initials}
    </div>
  );
};

const Sidebar = ({
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  sidebarView,
  setSidebarView,
  messages,
  user,
  onCreateWorkspace,
  onJoinWorkspace,
  onSignOut,
}) => {
  const [wsExpanded, setWsExpanded] = useState(true);
  const unreadMessages = messages.filter(m => m.sender?._id !== user._id).length;

  return (
    <aside
      className="flex flex-col shrink-0 bg-[#0f1012] border-r border-white/[0.05]"
      style={{ width: 'var(--sidebar-width, 260px)' }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 border-b border-white/[0.05] shrink-0" style={{ height: 'var(--topbar-height, 58px)' }}>
        <div className="relative">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[10px] font-black text-white shadow-glow-blue">
            CS
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-[13px] tracking-tight leading-none">CollabSpace</span>
          <span className="text-[9px] text-[#3d4450] font-medium tracking-wider mt-0.5">WORKSPACE</span>
        </div>
      </div>

      {/* ── Scrollable nav ── */}
      <nav className="flex-1 overflow-y-auto dark-scrollbar px-3 py-4 flex flex-col gap-5">

        {/* Workspaces section */}
        <div>
          <button
            onClick={() => setWsExpanded(v => !v)}
            className="w-full flex items-center justify-between px-2 mb-1.5 group cursor-pointer"
          >
            <span className="section-label">Workspaces</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button
                onClick={(e) => { e.stopPropagation(); onCreateWorkspace(); }}
                className="p-1 rounded-md hover:bg-white/[0.07] text-[#5c6570] hover:text-[#9aa3b0] transition-all cursor-pointer"
                title="New workspace"
                aria-label="Create workspace"
              >
                <Plus size={12} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onJoinWorkspace(); }}
                className="p-1 rounded-md hover:bg-white/[0.07] text-[#5c6570] hover:text-[#9aa3b0] transition-all cursor-pointer"
                title="Join via invite code"
                aria-label="Join workspace"
              >
                <Hash size={12} />
              </button>
              <ChevronDown
                size={12}
                className={`text-[#5c6570] transition-transform duration-200 ${wsExpanded ? '' : '-rotate-90'}`}
              />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {wsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-0.5">
                  {workspaces.map(ws => {
                    const isActive = activeWorkspace?._id === ws._id;
                    return (
                      <button
                        key={ws._id}
                        onClick={() => setActiveWorkspace(ws)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-blue-500/[0.1] border border-blue-500/[0.15]'
                            : 'hover:bg-white/[0.04] border border-transparent'
                        }`}
                      >
                        <WorkspaceAvatar name={ws.name} isActive={isActive} />
                        <span className={`text-[13px] font-medium truncate flex-1 ${
                          isActive ? 'text-blue-300' : 'text-[#5c6570] hover:text-[#9aa3b0]'
                        }`}>
                          {ws.name}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 animate-pulse-slow" />
                        )}
                      </button>
                    );
                  })}

                  {workspaces.length === 0 && (
                    <button
                      onClick={onCreateWorkspace}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[#5c6570] hover:text-[#9aa3b0] border border-dashed border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all text-xs font-medium cursor-pointer"
                    >
                      <Plus size={13} />
                      Create first workspace
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div>
          <span className="section-label px-2 mb-1.5 block">Menu</span>
          <div className="space-y-0.5">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
              const isActive = sidebarView === id;
              const badge = id === 'chat' && unreadMessages > 0 ? unreadMessages : null;

              return (
                <button
                  key={id}
                  onClick={() => setSidebarView(id)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={15} className="nav-icon shrink-0" />
                  <span className="flex-1 text-[13px]">{label}</span>
                  {badge && (
                    <span className="text-[9px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full tabular-nums min-w-[18px] text-center">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute right-2 w-1 h-4 rounded-full bg-blue-400"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        {activeWorkspace && (
          <div>
            <span className="section-label px-2 mb-1.5 block">Workspace</span>
            <div className="px-2 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#5c6570] font-medium">Invite Code</span>
                <span className="text-[11px] font-mono font-bold text-blue-400 tracking-widest">
                  {activeWorkspace.inviteCode}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow shrink-0" />
                <span className="text-[10px] text-[#5c6570]">Live workspace</span>
                <Zap size={10} className="text-amber-400 ml-auto" />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── User profile ── */}
      <div className="px-3 pb-3 pt-3 shrink-0 border-t border-white/[0.05]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-150 group cursor-pointer">
          <div className="relative shrink-0">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=2563eb&color=fff&size=64`}
              alt={user.name || 'User'}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f1012]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[#e0e4eb] truncate leading-none mb-0.5">
              {user.name || 'Guest'}
            </div>
            <div className="text-[10px] text-emerald-500 font-medium">Online</div>
          </div>
          <button
            onClick={onSignOut}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded-lg hover:bg-red-500/10 text-[#5c6570] hover:text-red-400 cursor-pointer"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
