import React from 'react';
import Modal from '../ui/Modal';
import { Hash } from 'lucide-react';

const JoinModal = ({ code, setCode, onClose, onSubmit }) => (
  <Modal title="Join Workspace" onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="invite-code" className="form-label">Invite Code</label>
        <div className="relative">
          <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c6570] pointer-events-none" />
          <input
            id="invite-code"
            required
            autoFocus
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl pl-10 pr-4 py-2.5 text-[13px] font-mono text-[#e0e4eb] placeholder:text-[#3d4450] focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all duration-150 tracking-[0.2em] uppercase"
            placeholder="XXXXXX"
            maxLength={8}
          />
        </div>
        <p className="text-[11px] text-[#5c6570] mt-2">
          Ask your workspace admin for the invite code.
        </p>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5 text-[13px] cursor-pointer">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1 py-2.5 text-[13px] cursor-pointer">
          Join Workspace
        </button>
      </div>
    </form>
  </Modal>
);

export default JoinModal;
