import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const DeadlinesWidget = ({ stats }) => {
  if (!stats) return null;
  const hasDue = (stats.dueToday?.length > 0) || (stats.dueSoon?.length > 0);
  if (!hasDue) return null;

  return (
    <div className="bg-white/[0.02] border border-amber-500/20 rounded-2xl p-4 shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <AlertTriangle size={12} className="text-amber-400" />
        </div>
        <span className="section-label text-amber-500/80">Deadlines</span>
      </div>

      <div className="space-y-2">
        {stats.dueToday?.map(t => (
          <div key={t._id} className="flex items-center gap-2.5 p-2 rounded-lg bg-red-500/[0.06] border border-red-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#e0e4eb] truncate">{t.title}</p>
              <p className="text-[9px] text-red-400 font-bold mt-0.5">Due Today</p>
            </div>
            <Clock size={10} className="text-red-400 shrink-0" />
          </div>
        ))}

        {stats.dueSoon?.map(t => (
          <div key={t._id} className="flex items-center gap-2.5 p-2 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#e0e4eb] truncate">{t.title}</p>
              <p className="text-[9px] text-amber-400 font-medium mt-0.5">
                {new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlinesWidget;
