import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';

const ActivityFeed = ({ activityFeed }) => (
  <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col min-h-0 flex-1">
    {/* Header */}
    <div className="flex items-center gap-2 mb-3 shrink-0">
      <Zap size={13} className="text-blue-400" />
      <span className="section-label flex-1">Live Activity</span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
    </div>

    {activityFeed.length > 0 ? (
      <div className="space-y-2.5 overflow-y-auto dark-scrollbar flex-1">
        {activityFeed.slice(0, 20).map((a, i) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.025, ease: 'easeOut' }}
            className="flex items-start gap-2"
          >
            <img
              src={a.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.userId?.name || 'U')}&background=2563eb&color=fff&size=32`}
              alt=""
              className="w-5 h-5 rounded-md shrink-0 mt-0.5 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#9aa3b0] leading-snug">{a.message}</p>
              <p className="text-[9px] text-[#3d4450] mt-0.5 tabular-nums">
                {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
        <Activity size={20} className="text-[#3d4450] mb-2" />
        <p className="text-[11px] text-[#5c6570] font-medium">No activity yet</p>
        <p className="text-[10px] text-[#3d4450] mt-0.5">Create tasks to get started</p>
      </div>
    )}
  </div>
);

export default ActivityFeed;
