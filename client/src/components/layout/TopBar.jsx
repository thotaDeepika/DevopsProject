import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Plus, Copy, LayoutGrid, Table2, Check, X, Loader2, ChevronRight } from 'lucide-react';
import API from '../../services/api';

const dropdownVariants = {
  hidden:  { opacity: 0, y: 6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.1 } },
};

const TopBar = ({
  activeWorkspace,
  view,
  setView,
  searchQuery,
  setSearchQuery,
  notifications,
  setNotifications,
  onNewTask,
  sidebarView,
}) => {
  const [showNotif,       setShowNotif]       = useState(false);
  const [copied,          setCopied]          = useState(false);
  const [clearingNotifs,  setClearingNotifs]  = useState(false);
  const notifRef = useRef(null);

  const unread = notifications.filter(n => !n.read).length;

  // Close notif panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    if (showNotif) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotif]);

  const copyInviteCode = () => {
    if (!activeWorkspace?.inviteCode) return;
    navigator.clipboard.writeText(activeWorkspace.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const handleClearAll = async () => {
    try {
      setClearingNotifs(true);
      await API.delete('/notifications');
      setNotifications([]);
    } catch { /* silent */ } finally {
      setClearingNotifs(false);
    }
  };

  const showViewToggle = sidebarView === 'dashboard';

  return (
    <header
      className="flex items-center justify-between px-5 bg-[#070809]/80 backdrop-blur-sm border-b border-white/[0.05] shrink-0"
      style={{ height: 'var(--topbar-height, 58px)' }}
    >
      {/* ── Left ── */}
      <div className="flex items-center gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#3d4450] font-medium">CollabSpace</span>
          <ChevronRight size={12} className="text-[#3d4450]" />
          <span className="text-[#e0e4eb] font-semibold">
            {activeWorkspace?.name || 'Dashboard'}
          </span>
        </div>

        {/* Board / Table view toggle */}
        {showViewToggle && activeWorkspace && (
          <div className="flex items-center p-0.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setView('board')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-150 cursor-pointer ${
                view === 'board'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-[#5c6570] hover:text-[#9aa3b0]'
              }`}
            >
              <LayoutGrid size={13} />
              Board
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-150 cursor-pointer ${
                view === 'table'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-[#5c6570] hover:text-[#9aa3b0]'
              }`}
            >
              <Table2 size={13} />
              Table
            </button>
          </div>
        )}
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-2">
        {/* Invite code pill */}
        {activeWorkspace?.inviteCode && (
          <button
            onClick={copyInviteCode}
            className="hidden md:flex items-center gap-2 text-[11px] bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-[#6e7a88] hover:text-[#a0aab6] hover:border-white/[0.12] transition-all duration-150 cursor-pointer"
          >
            <span className="text-[#3d4450] font-medium font-sans">Invite</span>
            <span className="font-mono font-bold text-blue-400/80 tracking-widest">{activeWorkspace.inviteCode}</span>
            {copied
              ? <Check size={11} className="text-emerald-400" />
              : <Copy size={11} className="text-[#3d4450]" />
            }
          </button>
        )}

        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4450] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="bg-white/[0.04] border border-white/[0.07] rounded-lg pl-8 pr-8 py-1.5 text-[12px] text-[#e0e4eb] placeholder:text-[#3d4450] focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-150 w-44 focus:w-56"
            style={{ transition: 'width 0.2s ease, border-color 0.15s ease, background 0.15s ease' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5c6570] hover:text-[#9aa3b0] cursor-pointer transition-colors"
            >
              <X size={11} />
            </button>
          )}
        </div>

        {/* New Task button */}
        <button
          onClick={onNewTask}
          disabled={!activeWorkspace}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
          style={{ boxShadow: activeWorkspace ? '0 2px 8px rgba(59,130,246,0.3)' : 'none' }}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(v => !v)}
            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer ${
              showNotif ? 'bg-white/[0.08] text-[#e0e4eb]' : 'text-[#5c6570] hover:text-[#9aa3b0] hover:bg-white/[0.06]'
            }`}
            aria-label="Notifications"
          >
            <Bell size={15} />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="notif-dot"
              />
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-10 w-80 bg-[#16181a] border border-white/[0.09] rounded-2xl shadow-dropdown overflow-hidden z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[13px] text-white">Notifications</span>
                    {unread > 0 && (
                      <span className="text-[9px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full tabular-nums">
                        {unread}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleClearAll}
                    disabled={clearingNotifs || notifications.length === 0}
                    className="text-[11px] text-[#5c6570] hover:text-[#9aa3b0] transition-colors disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    {clearingNotifs && <Loader2 size={10} className="animate-spin" />}
                    Clear all
                  </button>
                </div>

                {/* Notification list */}
                <div className="max-h-72 overflow-y-auto dark-scrollbar">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map(n => (
                        <button
                          key={n._id}
                          onClick={() => handleMarkRead(n._id)}
                          className={`w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors last:border-0 cursor-pointer ${
                            !n.read ? 'bg-blue-500/[0.04]' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                            )}
                            <div className={!n.read ? '' : 'pl-4'}>
                              <p className={`text-[12px] leading-snug ${n.read ? 'text-[#6e7a88]' : 'text-[#c8d0da] font-medium'}`}>
                                {n.message}
                              </p>
                              <span className="text-[10px] text-[#3d4450] mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                        <Bell size={18} className="text-[#3d4450]" />
                      </div>
                      <p className="text-[12px] text-[#5c6570] font-medium">You're all caught up</p>
                      <p className="text-[11px] text-[#3d4450] mt-1">No new notifications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
