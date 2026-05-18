import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertTriangle, Clock, CheckCircle2, Circle, Minus } from 'lucide-react';

const STATUS_CONFIG = {
  'todo':        { icon: <Circle size={13} />,       label: 'To Do',        color: 'text-amber-400' },
  'in-progress': { icon: <Clock size={13} />,         label: 'In Progress',  color: 'text-blue-400' },
  'done':        { icon: <CheckCircle2 size={13} />,  label: 'Done',         color: 'text-emerald-400' },
};

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  medium: { label: 'Medium', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  low:    { label: 'Low',    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
};

const TableView = ({ filteredTasks }) => {
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [filter, setFilter] = useState('all');

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const displayed = filteredTasks
    .filter(t => filter === 'all' || t.columnId === filter)
    .slice()
    .sort((a, b) => {
      let av = a[sortKey] ?? '';
      let bv = b[sortKey] ?? '';
      if (sortKey === 'createdAt') { av = new Date(av); bv = new Date(bv); }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <Minus size={11} className="text-gray-700" />;
    return sortDir === 'asc' ? <ChevronUp size={11} className="text-blue-400" /> : <ChevronDown size={11} className="text-blue-400" />;
  };

  const ThBtn = ({ col, label }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-gray-300 transition-colors"
    >
      {label}<SortIcon col={col} />
    </button>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.02] border border-white/[0.07] rounded-2xl">
      {/* Filters */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.07]">
        {['all', 'todo', 'in-progress', 'done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === f
                ? 'bg-white/[0.1] text-white'
                : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.05]'
            }`}
          >
            {f === 'all' ? 'All Tasks' : STATUS_CONFIG[f]?.label}
          </button>
        ))}
        <div className="ml-auto text-xs text-gray-700">{displayed.length} tasks</div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-5 py-3 w-[40%]"><ThBtn col="title" label="Task" /></th>
              <th className="text-left px-4 py-3"><ThBtn col="columnId" label="Status" /></th>
              <th className="text-left px-4 py-3"><ThBtn col="priority" label="Priority" /></th>
              <th className="text-left px-4 py-3"><ThBtn col="createdAt" label="Created" /></th>
            </tr>
          </thead>
          <tbody>
            {displayed.length > 0 ? (
              displayed.map((task, i) => {
                const status = STATUS_CONFIG[task.columnId] || STATUS_CONFIG['todo'];
                const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;
                return (
                  <motion.tr
                    key={task._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-[13px] font-medium text-gray-200 group-hover:text-white transition-colors truncate max-w-xs">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-gray-700 truncate max-w-xs mt-0.5">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 text-[11px] font-medium ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${priority.color}`}>
                        {priority.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-gray-600">
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-700">
                    <AlertTriangle size={24} className="text-gray-800" />
                    <p className="text-sm font-medium">No tasks found</p>
                    <p className="text-xs">Try a different filter or create a task.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
