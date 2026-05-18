import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { motion } from 'framer-motion';

const COLUMN_CONFIG = {
  'todo':        { label: 'To Do',       color: '#f59e0b', dot: 'bg-amber-400',   countCls: 'text-amber-400 bg-amber-400/10' },
  'in-progress': { label: 'In Progress', color: '#3b82f6', dot: 'bg-blue-400',    countCls: 'text-blue-400 bg-blue-400/10' },
  'done':        { label: 'Done',        color: '#10b981', dot: 'bg-emerald-400', countCls: 'text-emerald-400 bg-emerald-400/10' },
};

const KanbanColumn = ({ id, tasks, onAddTask, onTaskClick }) => {
  const config = COLUMN_CONFIG[id] || { label: id, color: '#6b7280', dot: 'bg-gray-400', countCls: 'text-gray-400 bg-gray-400/10' };

  return (
    <div className="kanban-column" style={{ minWidth: 300 }}>
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot} shrink-0`} />
          <span className="text-[11px] font-bold text-[#a0aab6] uppercase tracking-widest">{config.label}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums ${config.countCls}`}>
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[#5c6570] hover:text-[#9aa3b0] transition-all cursor-pointer"
            aria-label="Add task"
          >
            <Plus size={13} />
          </button>
        )}
      </div>

      {/* Droppable zone */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex flex-col gap-2 min-h-[120px] flex-1 rounded-xl transition-colors duration-150 p-1 -m-1 ${
              snapshot.isDraggingOver ? 'drop-zone-active' : ''
            }`}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging
                          ? provided.draggableProps.style.transform
                          : 'translate(0,0)',
                      }}
                    >
                      <TaskCard
                        {...task}
                        isDragging={snapshot.isDragging}
                        onClick={() => !snapshot.isDragging && onTaskClick && onTaskClick(task)}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <div
                className={`border border-dashed rounded-xl h-20 flex flex-col items-center justify-center transition-all duration-150 ${
                  snapshot.isDraggingOver
                    ? 'border-blue-500/40 bg-blue-500/5 text-blue-400'
                    : 'border-white/[0.06] text-[#3d4450]'
                }`}
              >
                <span className="text-[10px] font-medium">Drop tasks here</span>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
