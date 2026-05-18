import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { Loader2, TrendingUp, Users, Target, BarChart3 } from 'lucide-react';
import API from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#16181a',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 12,
    fontSize: 12,
    color: '#e0e4eb',
    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
    padding: '8px 12px',
  },
  cursor: { fill: 'rgba(255,255,255,0.02)' },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.25, ease: [0.16, 1, 0.3, 1] },
});

const StatTile = ({ icon, label, value, accent, delay = 0 }) => (
  <motion.div
    {...fadeUp(delay)}
    className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3.5"
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="section-label mb-0.5">{label}</p>
      <p className="text-xl font-black text-[#f0f2f5] tabular-nums">{value ?? '—'}</p>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, delay = 0 }) => (
  <motion.div
    {...fadeUp(delay)}
    className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5"
  >
    <h3 className="section-label mb-5">{title}</h3>
    {children}
  </motion.div>
);

const AnalyticsView = ({ workspaceId }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/ai/analytics/${workspaceId}`);
        setData(res.data);
      } catch {
        /* handled silently */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Loader2 size={18} className="animate-spin text-blue-400" />
          </div>
          <span className="text-[12px] text-[#5c6570] font-medium">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <BarChart3 size={32} className="text-[#3d4450] mb-3" />
        <p className="text-[13px] text-[#5c6570] font-medium">No analytics data available</p>
        <p className="text-[11px] text-[#3d4450] mt-1">Create and complete tasks to generate insights.</p>
      </div>
    );
  }

  const columnData   = Object.entries(data.columnCounts).map(([name, value]) => ({ name, value }));
  const priorityData = Object.entries(data.priorityCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex-1 overflow-y-auto dark-scrollbar">
      <div className="space-y-4 p-0.5">
        {/* Page header */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BarChart3 size={16} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#f0f2f5] leading-none">Team Analytics</h2>
            <p className="text-[11px] text-[#5c6570] mt-0.5">Data-driven insights into workspace performance</p>
          </div>
        </motion.div>

        {/* Top stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatTile
            icon={<Target size={16} className="text-blue-400" />}
            label="Total Tasks"
            value={data.totalTasks}
            accent="bg-blue-500/10"
            delay={0.05}
          />
          <StatTile
            icon={<TrendingUp size={16} className="text-emerald-400" />}
            label="Completion Rate"
            value={`${data.completionRate}%`}
            accent="bg-emerald-500/10"
            delay={0.1}
          />
          <StatTile
            icon={<Users size={16} className="text-purple-400" />}
            label="Active Members"
            value={data.memberStats.length}
            accent="bg-purple-500/10"
            delay={0.15}
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-2 gap-3">
          <ChartCard title="Activity — Last 7 Days" delay={0.2}>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5c6570' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5c6570' }} width={24} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="actions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#60a5fa', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Tasks by Status" delay={0.25}>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={columnData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5c6570' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5c6570' }} width={24} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-2 gap-3">
          <ChartCard title="Task Priorities" delay={0.3}>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-1">
              {priorityData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] text-[#6e7a88] capitalize">{entry.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Busiest Members" delay={0.35}>
            <div className="space-y-3">
              {data.memberStats.length > 0 ? data.memberStats.map((m, i) => {
                const pct = Math.min((m.count / (data.totalTasks || 1)) * 200, 100);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-[11px] font-bold text-[#9aa3b0] shrink-0">
                      {m.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium text-[#c8d0da] truncate">{m.name}</span>
                        <span className="text-[10px] font-bold text-[#5c6570] tabular-nums ml-2">{m.count}</span>
                      </div>
                      <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, delay: 0.4 + i * 0.06, ease: 'easeOut' }}
                          className="h-full rounded-full bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-6 text-center">
                  <p className="text-[11px] text-[#5c6570]">No tasks assigned yet.</p>
                </div>
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
