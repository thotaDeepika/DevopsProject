import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Hash, Users, Zap, LayoutGrid, Sparkles } from 'lucide-react';

const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    className={className}
  />
);

const WelcomeView = ({ onCreateWorkspace, onJoinWorkspace }) => (
  <div className="flex-1 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center max-w-sm px-4"
    >
      {/* Icon cluster */}
      <div className="relative w-28 h-28 mx-auto mb-8">
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-2xl" />

        {/* Main icon */}
        <div className="relative w-28 h-28 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
          <LayoutGrid size={36} className="text-blue-400" />
        </div>

        {/* Floating badges */}
        <FloatingOrb
          delay={0}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center"
        />
        <div className="absolute -top-3 -right-3 w-9 h-9 rounded-xl flex items-center justify-center pointer-events-none">
          <Sparkles size={14} className="text-purple-400" />
        </div>

        <FloatingOrb
          delay={0.5}
          className="absolute -bottom-3 -left-3 w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center"
        />
        <div className="absolute -bottom-3 -left-3 w-9 h-9 rounded-xl flex items-center justify-center pointer-events-none">
          <Users size={14} className="text-emerald-400" />
        </div>

        <FloatingOrb
          delay={1}
          className="absolute -top-1 -left-4 w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center"
        />
        <div className="absolute -top-1 -left-4 w-7 h-7 rounded-lg flex items-center justify-center pointer-events-none">
          <Zap size={11} className="text-amber-400" />
        </div>
      </div>

      <h2 className="text-xl font-black text-[#f0f2f5] tracking-tight mb-2">
        Welcome to CollabSpace
      </h2>
      <p className="text-[13px] text-[#6e7a88] leading-relaxed mb-8">
        Create a workspace to collaborate with your team, or join one using an invite code.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={onCreateWorkspace}
          className="btn-primary w-full py-3 text-[13px] cursor-pointer"
          style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
        >
          <Plus size={15} />
          Create Workspace
        </button>
        <button
          onClick={onJoinWorkspace}
          className="btn-secondary w-full py-3 text-[13px] cursor-pointer"
        >
          <Hash size={15} />
          Join via Invite Code
        </button>
      </div>

      <p className="text-[10px] text-[#3d4450] mt-6">
        Workspaces are isolated — your data stays private.
      </p>
    </motion.div>
  </div>
);

export default WelcomeView;
