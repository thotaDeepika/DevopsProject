import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Brain, Coffee, BellOff, CheckCircle2, Flag } from 'lucide-react';

const PRIORITY_COLOR = {
  high:   'border-red-400/40 bg-red-400/[0.08]',
  medium: 'border-amber-400/40 bg-amber-400/[0.08]',
  low:    'border-emerald-400/40 bg-emerald-400/[0.08]',
};

const FocusModeView = ({ tasks }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode,     setMode]     = useState('focus');

  const pendingTasks = tasks.filter(t => t.columnId !== 'done');
  const totalSecs    = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress     = ((totalSecs - timeLeft) / totalSecs) * 100;
  const isFocus      = mode === 'focus';

  const accentColor = isFocus ? '#6366f1' : '#10b981';
  const accentCls   = isFocus
    ? { bg: 'bg-indigo-500/10 border-indigo-500/20', text: 'text-indigo-400' }
    : { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400' };

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft === 0) {
        try {
          const a = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          a.play().catch(() => {});
        } catch { /* ignore */ }
        setIsActive(false);
        if (isFocus) { setMode('break'); setTimeLeft(5 * 60); }
        else         { setMode('focus'); setTimeLeft(25 * 60); }
      }
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [isActive, timeLeft, isFocus]);

  const toggleTimer = () => setIsActive(a => !a);
  const resetTimer  = () => { setIsActive(false); setTimeLeft(isFocus ? 25 * 60 : 5 * 60); };
  const switchMode  = () => {
    const next = isFocus ? 'break' : 'focus';
    setMode(next);
    setIsActive(false);
    setTimeLeft(next === 'focus' ? 25 * 60 : 5 * 60);
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const R       = 88;
  const CIRCUM  = 2 * Math.PI * R;
  const dashOff = CIRCUM * (1 - progress / 100);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0d0e11] rounded-2xl border border-white/[0.07] relative">
      {/* Ambient glow */}
      <div
        className="absolute top-[-20%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-15 pointer-events-none transition-colors duration-700"
        style={{ background: accentColor }}
      />

      {/* ── Timer panel ── */}
      <div className="w-1/2 flex flex-col items-center justify-center p-10 border-r border-white/[0.06] relative z-10 gap-8">
        {/* Mode badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${accentCls.bg}`}>
          {isFocus
            ? <Brain size={14} className={accentCls.text} />
            : <Coffee size={14} className={accentCls.text} />
          }
          <span className={`text-[10px] font-bold uppercase tracking-widest ${accentCls.text}`}>
            {isFocus ? 'Deep Work' : 'Short Break'}
          </span>
        </div>

        {/* SVG ring timer */}
        <div className="relative">
          <svg width={220} height={220} className="-rotate-90">
            <circle
              cx={110} cy={110} r={R}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={7}
              fill="none"
            />
            <motion.circle
              cx={110} cy={110} r={R}
              stroke={accentColor}
              strokeWidth={7}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUM}
              animate={{ strokeDashoffset: dashOff }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </svg>
          {/* Inner glow */}
          <div
            className="absolute inset-4 rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{ background: accentColor }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white font-mono tabular-nums tracking-tight">
              {fmt(timeLeft)}
            </span>
            <span className="text-[11px] text-[#5c6570] mt-1 font-medium">
              {Math.round(progress)}% complete
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={resetTimer}
            className="w-11 h-11 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#5c6570] hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
            aria-label="Reset timer"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            style={{
              background: isActive ? 'rgba(255,255,255,0.08)' : accentColor,
              boxShadow: isActive ? 'none' : `0 0 28px ${accentColor}50`,
            }}
            aria-label={isActive ? 'Pause' : 'Start'}
          >
            {isActive
              ? <Pause size={22} fill="currentColor" />
              : <Play size={22} fill="currentColor" className="ml-0.5" />
            }
          </button>

          <button
            onClick={switchMode}
            className="w-11 h-11 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#5c6570] hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
            aria-label={isFocus ? 'Switch to break' : 'Switch to focus'}
          >
            {isFocus ? <Coffee size={16} /> : <Brain size={16} />}
          </button>
        </div>
      </div>

      {/* ── Task list panel ── */}
      <div className="w-1/2 flex flex-col p-8 relative z-10">
        <div className="flex items-center justify-between mb-5 shrink-0">
          <h2 className="text-[15px] font-bold text-[#f0f2f5]">Pending Tasks</h2>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5c6570] bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full">
            <BellOff size={11} />
            Focus Mode
          </div>
        </div>

        <div className="flex-1 overflow-y-auto dark-scrollbar space-y-2 pr-1">
          <AnimatePresence>
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task, i) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 hover:bg-white/[0.05] hover:border-white/[0.09] transition-all"
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-md border-2 shrink-0 ${PRIORITY_COLOR[task.priority] || PRIORITY_COLOR.low}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#c8d0da] truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        task.columnId === 'todo'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {task.columnId === 'todo' ? 'To Do' : 'In Progress'}
                      </span>
                      <Flag size={9} className={
                        task.priority === 'high' ? 'text-red-400' :
                        task.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                      } />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-16"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <CheckCircle2 size={22} className="text-emerald-400" />
                </div>
                <p className="text-[13px] font-semibold text-[#e0e4eb] mb-1">All caught up!</p>
                <p className="text-[11px] text-[#5c6570]">No pending tasks. Time for a break.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FocusModeView;
