import React from 'react';
import { Clock, Flag, ExternalLink } from 'lucide-react';

const PRIORITY_CONFIG = {
  high:   { label: 'High', cls: 'bg-red-500/10 text-red-400 border-red-500/20',         flag: 'text-red-400' },
  medium: { label: 'Med',  cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   flag: 'text-amber-400' },
  low:    { label: 'Low',  cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', flag: 'text-emerald-400' },
};

// Strip markdown syntax for the card preview so it reads cleanly
const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold**
    .replace(/\*([^*]+)\*/g, '$1')        // *italic*
    .replace(/`([^`]+)`/g, '$1')          // `code`
    .replace(/^[#]+\s+/gm, '')            // ## headings
    .replace(/^[*\-•]\s+/gm, '• ')        // bullets
    .replace(/^\d+[.)]\s+/gm, '')         // numbered lists
    .trim();
};

const TaskCard = ({ title, description, priority, assignees, createdAt, isDragging, onClick }) => {
  const pConfig = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  const cleanDesc = stripMarkdown(description);

  return (
    <div
      className={`task-card group ${isDragging ? 'is-dragging' : ''}`}
      onClick={onClick}
      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
    >
      {/* Title row */}
      <div className="flex items-start gap-2 mb-2">
        <Flag size={11} className={`${pConfig.flag} shrink-0 mt-0.5`} />
        <h4 className="text-[13px] font-semibold text-[#e0e4eb] leading-snug flex-1">
          {title}
        </h4>
        {/* View detail hint — only visible on hover */}
        <ExternalLink
          size={11}
          className="shrink-0 text-[#3d4450] opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
        />
      </div>

      {/* Description preview — plain text, 2 lines max */}
      {cleanDesc && (
        <p className="text-[11px] text-[#5c6570] leading-relaxed mb-3 line-clamp-2 pl-[18px]">
          {cleanDesc}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className={`badge ${pConfig.cls}`}>{pConfig.label}</span>
          {createdAt && (
            <span className="flex items-center gap-1 text-[10px] text-[#3d4450]">
              <Clock size={9} />
              {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        <div className="flex -space-x-1.5">
          {assignees && assignees.length > 0 ? (
            assignees.slice(0, 3).map((img, i) => (
              <img key={i} src={img} alt="" className="w-5 h-5 rounded-full border-2 border-[#161819] object-cover" />
            ))
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/[0.06] border-2 border-[#161819] flex items-center justify-center">
              <span className="text-[7px] text-[#5c6570]">—</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
