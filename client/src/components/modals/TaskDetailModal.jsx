import React from 'react';
import { motion } from 'framer-motion';
import { X, Flag, Clock, LayoutGrid, Calendar } from 'lucide-react';
import MarkdownContent from '../ui/MarkdownContent';

const PRIORITY = {
  high:   { label: 'High',   cls: 'bg-red-500/10 text-red-400 border-red-500/20',         flag: 'text-red-400' },
  medium: { label: 'Medium', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   flag: 'text-amber-400' },
  low:    { label: 'Low',    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', flag: 'text-emerald-400' },
};

const COLUMN = {
  'todo':        { label: 'To Do',       cls: 'bg-amber-500/10 text-amber-400',   dot: 'bg-amber-400' },
  'in-progress': { label: 'In Progress', cls: 'bg-blue-500/10 text-blue-400',     dot: 'bg-blue-400' },
  'done':        { label: 'Done',        cls: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400' },
};

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  const pConfig = PRIORITY[task.priority] || PRIORITY.low;
  const cConfig = COLUMN[task.columnId]   || COLUMN.todo;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="bg-[#16181a] border border-white/[0.09] rounded-2xl shadow-modal w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-white/[0.07]">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <Flag size={14} className={`${pConfig.flag} shrink-0 mt-0.5`} />
            <h2 className="text-[15px] font-bold text-white leading-snug">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5c6570] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Meta badges */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] flex-wrap">
          {/* Priority */}
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${pConfig.cls}`}>
            <Flag size={10} />
            {pConfig.label} Priority
          </span>

          {/* Status */}
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${cConfig.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cConfig.dot}`} />
            {cConfig.label}
          </span>

          {/* Created date */}
          {task.createdAt && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#5c6570] px-2.5 py-1 rounded-lg bg-white/[0.04]">
              <Calendar size={10} />
              {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto dark-scrollbar">
          {task.description ? (
            <div>
              <p className="section-label mb-3">Description</p>
              <MarkdownContent text={task.description} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <LayoutGrid size={24} className="text-[#3d4450] mb-2" />
              <p className="text-[12px] text-[#5c6570]">No description provided.</p>
            </div>
          )}
        </div>

        {/* Assignees footer */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-3">
            <span className="text-[11px] text-[#5c6570]">Assignees</span>
            <div className="flex -space-x-1.5">
              {task.assignees.slice(0, 5).map((img, i) => (
                <img key={i} src={img} alt="" className="w-6 h-6 rounded-full border-2 border-[#16181a] object-cover" />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TaskDetailModal;
