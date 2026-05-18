import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Loader2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const ChatMessage = ({ name, time, msg, img }) => {
  const isFile = msg.includes('Shared a file:') && (msg.includes('http://') || msg.includes('https://'));
  const fileUrl = isFile ? (msg.split('Shared a file: ')[1] || msg) : null;
  const fileName = fileUrl?.split('/').pop() || 'View file';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex items-end gap-2"
    >
      <img src={img} alt={name} className="w-6 h-6 rounded-lg object-cover shrink-0 mb-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[11px] font-semibold text-[#c8d0da] truncate">{name}</span>
          <span className="text-[9px] text-[#3d4450] shrink-0 tabular-nums">{time}</span>
        </div>
        <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl rounded-tl-none px-3 py-2 max-w-full">
          {isFile ? (
            <p className="text-[11px] text-[#9aa3b0] leading-relaxed break-all">
              <span className="text-[#5c6570] mr-1">📎</span>
              <a href={fileUrl} target="_blank" rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                {fileName}
              </a>
            </p>
          ) : (
            <p className="text-[12px] text-[#c8d0da] leading-relaxed break-words">{msg}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ChatPanel = ({
  messages,
  typingUsers,
  onlineUsers,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleTyping,
  handleFileUpload,
  activeWorkspace,
  isUploading,
  fileInputRef,
  collapsed,
  onToggle,
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!collapsed && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, collapsed]);

  const unread = messages.length;

  return (
    <motion.aside
      animate={{ width: collapsed ? 44 : 320 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col shrink-0 bg-[#0f1012] border-l border-white/[0.05] overflow-hidden"
      style={{ minWidth: 0 }}
    >
      {collapsed ? (
        /* ── Collapsed strip ── */
        <div className="flex flex-col items-center py-4 h-full gap-4">
          {/* Toggle button */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-[#5c6570] hover:text-[#9aa3b0] hover:bg-white/[0.07] transition-all cursor-pointer"
            title="Expand chat"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Icon */}
          <div className="relative">
            <MessageSquare size={15} className="text-[#5c6570]" />
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </div>

          {/* Vertical label */}
          <div
            className="text-[10px] font-semibold text-[#3d4450] tracking-widest uppercase select-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Team Chat
          </div>
        </div>
      ) : (
        /* ── Expanded panel ── */
        <>
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 border-b border-white/[0.05] shrink-0"
            style={{ height: 'var(--topbar-height, 58px)' }}
          >
            <div>
              <div className="text-[12px] font-bold text-[#e0e4eb] tracking-tight">Team Chat</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-[#5c6570]">{onlineUsers.size} online</span>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-[#5c6570] hover:text-[#9aa3b0] hover:bg-white/[0.07] transition-all cursor-pointer"
              title="Collapse chat"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto dark-scrollbar px-4 py-4 flex flex-col gap-3.5">
            {messages.length > 0 ? (
              messages.map((m, i) => (
                <ChatMessage
                  key={m._id || i}
                  name={m.sender?.name || 'User'}
                  time={new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  msg={m.text}
                  img={m.sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender?.name || 'U')}&background=2563eb&color=fff&size=64`}
                />
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                  <Send size={16} className="text-[#3d4450]" />
                </div>
                <p className="text-[12px] text-[#5c6570] font-medium">No messages yet</p>
                <p className="text-[10px] text-[#3d4450] mt-1">
                  Start a conversation in{' '}
                  <span className="text-[#5c6570]">{activeWorkspace?.name || 'this workspace'}</span>
                </p>
              </div>
            )}

            {/* Typing indicator */}
            <AnimatePresence>
              {typingUsers.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex gap-0.5 items-center bg-white/[0.05] border border-white/[0.06] px-3 py-2 rounded-xl rounded-tl-none">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1 h-1 rounded-full bg-[#5c6570]"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#5c6570] italic">
                    {Array.from(typingUsers).join(', ')} {typingUsers.size > 1 ? 'are' : 'is'} typing
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2.5 border-t border-white/[0.05] shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!activeWorkspace || isUploading}
                className="p-2 rounded-lg text-[#5c6570] hover:text-[#9aa3b0] hover:bg-white/[0.06] transition-all disabled:opacity-30 shrink-0 cursor-pointer"
                aria-label="Attach file"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />}
              </button>
              <div className="relative flex-1">
                <input
                  id="chat-input"
                  disabled={!activeWorkspace}
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder={activeWorkspace ? 'Message...' : 'Select a workspace'}
                  className="w-full bg-white/[0.05] border border-white/[0.07] rounded-xl px-3.5 py-2 text-[12px] text-[#e0e4eb] placeholder:text-[#3d4450] focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.07] transition-all duration-150 disabled:opacity-40"
                />
              </div>
              <button
                type="submit"
                disabled={!activeWorkspace || !newMessage.trim()}
                className="p-2 rounded-lg text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </>
      )}
    </motion.aside>
  );
};

export default ChatPanel;
