import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext } from '@hello-pangea/dnd';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import StatCards from './StatCards';
import ActivityFeed from './ActivityFeed';
import DeadlinesWidget from './DeadlinesWidget';

const COLUMNS = ['todo', 'in-progress', 'done'];

const BoardView = ({ filteredTasks, stats, activityFeed, onDragEnd, onAddTask, onTaskClick }) => {
  const [activityOpen, setActivityOpen] = useState(true);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <StatCards stats={stats} />

      <div className="flex flex-1 gap-3 overflow-hidden min-h-0">
        {/* Kanban board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar flex-1 min-w-0">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col}
                id={col}
                tasks={filteredTasks.filter(t => t.columnId === col)}
                onAddTask={onAddTask}
                onTaskClick={onTaskClick}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Right panel: activity + collapse toggle */}
        <div className="flex items-start gap-1 shrink-0">
          {/* Toggle button */}
          <button
            onClick={() => setActivityOpen(v => !v)}
            className="mt-0 p-1.5 rounded-lg text-[#5c6570] hover:text-[#9aa3b0] hover:bg-white/[0.06] transition-all cursor-pointer shrink-0 self-start"
            title={activityOpen ? 'Hide activity' : 'Show activity'}
          >
            {activityOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <AnimatePresence initial={false}>
            {activityOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 224, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3 overflow-y-auto dark-scrollbar pb-2 overflow-hidden"
                style={{ minWidth: 0 }}
              >
                <DeadlinesWidget stats={stats} />
                <ActivityFeed activityFeed={activityFeed} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
