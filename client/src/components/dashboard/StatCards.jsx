import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

const StatCard = ({ icon, label, value, accent, urgent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`stat-card flex flex-col gap-3 ${urgent ? 'border-red-500/20 bg-red-500/[0.03]' : ''}`}
  >
    <div className="flex items-center justify-between">
      <span className="section-label">{label}</span>
      <div className={`p-1.5 rounded-lg ${accent}`}>{icon}</div>
    </div>
    <div className={`text-2xl font-black tabular-nums tracking-tight ${urgent ? 'text-red-400' : 'text-[#f0f2f5]'}`}>
      {value ?? '—'}
    </div>
    {urgent && (
      <p className="text-[10px] text-red-400 font-semibold -mt-1">Needs attention</p>
    )}
  </motion.div>
);

const StatCards = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-3 shrink-0 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card h-20 skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3 shrink-0 mb-4">
      <StatCard
        icon={<CheckCircle2 size={13} className="text-emerald-400" />}
        label="Completed"
        value={stats.completedToday}
        accent="bg-emerald-500/10"
        delay={0}
      />
      <StatCard
        icon={<Clock size={13} className="text-blue-400" />}
        label="Pending"
        value={stats.pending}
        accent="bg-blue-500/10"
        delay={0.05}
      />
      <StatCard
        icon={<AlertTriangle size={13} className="text-red-400" />}
        label="Overdue"
        value={stats.overdue}
        accent="bg-red-500/10"
        urgent={stats.overdue > 0}
        delay={0.1}
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="stat-card flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <span className="section-label">Progress</span>
          <TrendingUp size={13} className="text-blue-400" />
        </div>
        <div className="text-2xl font-black text-[#f0f2f5] tabular-nums tracking-tight">
          {stats.progress}%
        </div>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden -mt-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default StatCards;
