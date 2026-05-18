import React from 'react';
import Modal from '../ui/Modal';

const inputCls = "w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-[13px] text-[#e0e4eb] placeholder:text-[#3d4450] focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all duration-150";

const WorkspaceModal = ({ name, setName, onClose, onSubmit }) => (
  <Modal title="Create Workspace" onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="ws-name" className="form-label">Workspace Name</label>
        <input
          id="ws-name"
          required
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          placeholder="e.g. Design Team"
        />
        <p className="text-[11px] text-[#5c6570] mt-2">
          An invite code will be generated automatically for your team.
        </p>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5 text-[13px] cursor-pointer">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1 py-2.5 text-[13px] cursor-pointer">
          Create Workspace
        </button>
      </div>
    </form>
  </Modal>
);

export default WorkspaceModal;
