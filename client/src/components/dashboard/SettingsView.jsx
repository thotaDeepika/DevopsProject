import React, { useState } from 'react';
import { Settings, Bell, Palette, Shield, Info, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={value}
    onClick={() => onChange(!value)}
    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none cursor-pointer ${
      value ? 'bg-blue-600' : 'bg-white/[0.1]'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
        value ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
);

const SettingsSection = ({ icon, title, children }) => (
  <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
      <div className="text-blue-400">{icon}</div>
      <span className="text-[13px] font-semibold text-[#e0e4eb]">{title}</span>
    </div>
    <div className="px-5 py-4 space-y-4">
      {children}
    </div>
  </div>
);

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-start justify-between gap-6">
    <div className="flex-1">
      <p className="text-[13px] font-medium text-[#c8d0da]">{label}</p>
      {description && <p className="text-[11px] text-[#5c6570] mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <div className="shrink-0 mt-0.5">{children}</div>
  </div>
);

const SettingsView = ({ activeWorkspace, user }) => {
  const [notifs,       setNotifs]       = useState(true);
  const [emailDigest,  setEmailDigest]  = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied,       setCopied]       = useState(false);

  const copyCode = () => {
    if (!activeWorkspace?.inviteCode) return;
    navigator.clipboard.writeText(activeWorkspace.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    toast.error('Leave workspace requires backend support. Contact your workspace owner.', { duration: 4000 });
  };

  return (
    <div className="flex-1 overflow-y-auto dark-scrollbar">
      <div className="max-w-2xl mx-auto p-5 space-y-4">
        {/* Page header */}
        <div className="mb-5">
          <h2 className="text-[15px] font-bold text-[#f0f2f5]">Settings</h2>
          <p className="text-[11px] text-[#5c6570] mt-0.5">
            Preferences for <span className="text-[#9aa3b0]">{activeWorkspace?.name}</span>
          </p>
        </div>

        {/* Workspace info */}
        <SettingsSection icon={<Info size={14} />} title="Workspace Info">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="section-label mb-1.5">Workspace Name</p>
              <p className="text-[13px] font-semibold text-[#e0e4eb]">{activeWorkspace?.name || '—'}</p>
            </div>
            <div>
              <p className="section-label mb-1.5">Invite Code</p>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-mono font-bold text-blue-400 tracking-widest">
                  {activeWorkspace?.inviteCode || '—'}
                </span>
                {activeWorkspace?.inviteCode && (
                  <button
                    onClick={copyCode}
                    className="p-1 rounded-md hover:bg-white/[0.07] text-[#5c6570] hover:text-[#9aa3b0] transition-all cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={<Bell size={14} />} title="Notifications">
          <SettingRow
            label="Push Notifications"
            description="Receive in-app alerts for task updates and mentions."
          >
            <Toggle value={notifs} onChange={setNotifs} />
          </SettingRow>
          <SettingRow
            label="Email Digest"
            description="Get a daily summary of workspace activity via email."
          >
            <Toggle value={emailDigest} onChange={setEmailDigest} />
          </SettingRow>
          <SettingRow
            label="Sound Effects"
            description="Play audio cues for messages and alerts."
          >
            <Toggle value={soundEnabled} onChange={setSoundEnabled} />
          </SettingRow>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection icon={<Palette size={14} />} title="Appearance">
          <SettingRow
            label="Theme"
            description="CollabSpace uses a premium dark theme optimized for long working sessions."
          >
            <span className="text-[11px] text-[#6e7a88] bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.07] font-medium">
              Dark
            </span>
          </SettingRow>
        </SettingsSection>

        {/* Account */}
        <SettingsSection icon={<Settings size={14} />} title="Account">
          <div className="flex items-center gap-4 py-1">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=2563eb&color=fff&size=64`}
              alt={user.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <p className="text-[13px] font-semibold text-[#e0e4eb]">{user.name || 'Guest'}</p>
              <p className="text-[11px] text-[#5c6570] mt-0.5">{user.email || '—'}</p>
            </div>
          </div>
        </SettingsSection>

        {/* Danger zone */}
        <div className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-red-400" />
            <h3 className="text-[13px] font-bold text-red-400">Danger Zone</h3>
          </div>
          <p className="text-[11px] text-[#5c6570] mb-4 leading-relaxed">
            These actions are irreversible. Proceed with caution.
          </p>
          <button
            onClick={handleLeave}
            className="btn-danger text-[12px] px-5 py-2 cursor-pointer"
          >
            Leave Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
