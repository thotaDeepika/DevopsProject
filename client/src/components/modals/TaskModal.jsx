import React from 'react';
import Modal from '../ui/Modal';

const selectCls = "w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-[13px] text-[#e0e4eb] focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all duration-150 appearance-none cursor-pointer";
const inputCls  = "w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-[13px] text-[#e0e4eb] placeholder:text-[#3d4450] focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all duration-150";

const TaskModal = ({ newTask, setNewTask, onClose, onSubmit }) => (
  <Modal title="Create Task" onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="form-label">Task Title</label>
        <input
          id="task-title"
          required
          autoFocus
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className={inputCls}
          placeholder="e.g. Design system audit"
        />
      </div>

      <div>
        <label htmlFor="task-desc" className="form-label">Description</label>
        <textarea
          id="task-desc"
          value={newTask.desc}
          onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
          className={`${inputCls} h-24 resize-none`}
          placeholder="What needs to be done?"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-priority" className="form-label">Priority</label>
          <select
            id="task-priority"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className={selectCls}
          >
            <option value="low"    className="bg-[#16181a]">Low</option>
            <option value="medium" className="bg-[#16181a]">Medium</option>
            <option value="high"   className="bg-[#16181a]">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-column" className="form-label">Column</label>
          <select
            id="task-column"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            className={selectCls}
          >
            <option value="todo"        className="bg-[#16181a]">To Do</option>
            <option value="in-progress" className="bg-[#16181a]">In Progress</option>
            <option value="done"        className="bg-[#16181a]">Done</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5 text-[13px] cursor-pointer">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1 py-2.5 text-[13px] cursor-pointer">
          Create Task
        </button>
      </div>
    </form>
  </Modal>
);

export default TaskModal;
