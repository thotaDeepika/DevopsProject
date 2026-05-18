import React from 'react';
import { motion } from 'framer-motion';
import { X, Crown, Users } from 'lucide-react';

const TeamView = ({ workspaceMembers, onlineUsers, activeWorkspace, user, handleRemoveMember }) => (
  <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.01] border border-white/[0.07] rounded-2xl">
    {/* Header */}
    <div className="px-6 py-4 border-b border-white/[0.07] shrink-0 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
        <Users size={15} className="text-blue-400" />
      </div>
      <div>
        <h2 className="text-[14px] font-bold text-[#f0f2f5]">Team Members</h2>
        <p className="text-[11px] text-[#5c6570] mt-0.5">
          {workspaceMembers.length} {workspaceMembers.length === 1 ? 'person' : 'people'} in{' '}
          <span className="text-[#9aa3b0]">{activeWorkspace?.name}</span>
        </p>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto dark-scrollbar p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {workspaceMembers.map((member, i) => {
          const isOnline   = onlineUsers.has(member._id);
          const isOwner    = activeWorkspace?.owner === member._id;
          const canRemove  = activeWorkspace?.owner === user._id && member._id !== user._id;

          return (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center gap-3.5 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.11] transition-all duration-200 group"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2563eb&color=fff&size=64`}
                  alt={member.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#16181a] ${
                  isOnline ? 'bg-emerald-400' : 'bg-[#3d4450]'
                }`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px] font-semibold text-[#e0e4eb] truncate">{member.name}</span>
                  {isOwner && <Crown size={10} className="text-amber-400 shrink-0" />}
                </div>
                <p className="text-[10px] text-[#5c6570] truncate mb-1.5">{member.email}</p>
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md ${
                  isOnline
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-white/[0.04] text-[#5c6570]'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-[#3d4450]'}`} />
                  {isOnline ? 'Active now' : 'Offline'}
                </span>
              </div>

              {/* Remove button */}
              {canRemove && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                  title={`Remove ${member.name}`}
                  aria-label={`Remove ${member.name}`}
                >
                  <X size={11} />
                </button>
              )}
            </motion.div>
          );
        })}

        {workspaceMembers.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
            <Users size={28} className="text-[#3d4450] mb-3" />
            <p className="text-[13px] text-[#5c6570] font-medium">No members yet</p>
            <p className="text-[11px] text-[#3d4450] mt-1">Share the invite code to add teammates.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default TeamView;
