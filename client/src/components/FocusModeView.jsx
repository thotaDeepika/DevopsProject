import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Brain, CheckCircle2, Coffee, BellOff, Volume2 } from 'lucide-react';

const FocusModeView = ({ tasks }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  // Only show tasks that are not done
  const pendingTasks = tasks.filter(t => t.columnId !== 'done');

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound when timer finishes (optional)
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {}); // catch to ignore browser auto-play block
      
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex p-6 bg-slate-900 rounded-[40px] m-6 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Left Panel: Timer */}
      <div className="w-1/2 flex flex-col items-center justify-center border-r border-white/10 p-10 z-10">
        <div className="flex items-center gap-3 mb-12 bg-white/5 px-6 py-2 rounded-full border border-white/10">
          {mode === 'focus' ? <Brain size={20} className="text-indigo-400" /> : <Coffee size={20} className="text-emerald-400" />}
          <span className="font-bold text-sm tracking-widest uppercase">
            {mode === 'focus' ? 'Deep Work' : 'Short Break'}
          </span>
        </div>

        <div className="relative mb-12">
          {/* Glowing ring */}
          <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${mode === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'} ${isActive ? 'animate-pulse' : ''}`}></div>
          
          <div className="w-64 h-64 rounded-full border-8 border-white/10 flex items-center justify-center relative bg-slate-900/50 backdrop-blur-sm z-10">
            {/* Progress ring visual hack */}
            <div className="text-7xl font-black font-mono tracking-tighter">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${isActive ? 'bg-white/10 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
          >
            {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Right Panel: Pending Tasks & Distraction Free info */}
      <div className="w-1/2 p-10 flex flex-col z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Your Tasks</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full">
            <BellOff size={14} />
            Notifications Muted
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {pendingTasks.length > 0 ? (
            pendingTasks.map(task => (
              <div key={task._id} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors flex items-start gap-4 group">
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex flex-shrink-0 transition-colors ${
                  task.priority === 'high' ? 'border-red-400/50 bg-red-400/10' :
                  task.priority === 'medium' ? 'border-amber-400/50 bg-amber-400/10' :
                  'border-emerald-400/50 bg-emerald-400/10'
                }`}></div>
                <div>
                  <h3 className="font-semibold text-white/90 text-sm leading-tight">{task.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/50 uppercase">{task.columnId.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
              <CheckCircle2 size={48} className="opacity-50" />
              <p className="text-sm font-medium">All caught up! Time for a break.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusModeView;
