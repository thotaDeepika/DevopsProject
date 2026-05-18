import React from 'react';

// Handles Gemini / AI output: **bold**, *italic*, `code`,
// bullet variants (* / - / •), numbered lists, ATX headings,
// and lines that are entirely **Bold Heading**.

const renderInline = (text) => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`'))
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md text-[11px] font-mono text-blue-300 bg-blue-500/10 border border-blue-500/20">
          {part.slice(1, -1)}
        </code>
      );
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-[#e0e4eb] font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={i} className="text-[#c8d0da] italic">{part.slice(1, -1)}</em>;
    return part;
  });
};

const isBoldHeading = (t) => t.startsWith('**') && t.endsWith('**') && t.length > 4;
const BULLET_RE    = /^[*\-•]\s+/;
const NUMBERED_RE  = /^(\d+)[.)]\s+/;

const MarkdownContent = ({ text, className = '' }) => {
  if (!text) return null;

  const elements = text.split('\n').map((line, i) => {
    const t = line.trim();

    if (!t) return <div key={i} className="h-2" />;

    if (t.startsWith('### '))
      return <h4 key={i} className="text-[13px] font-bold text-[#e0e4eb] mt-3 mb-1">{renderInline(t.slice(4))}</h4>;
    if (t.startsWith('## '))
      return <h3 key={i} className="text-[14px] font-bold text-white mt-4 mb-1.5">{renderInline(t.slice(3))}</h3>;
    if (t.startsWith('# '))
      return <h2 key={i} className="text-[15px] font-bold text-white mt-4 mb-2">{renderInline(t.slice(2))}</h2>;

    if (isBoldHeading(t))
      return <p key={i} className="text-[14px] font-bold text-white mt-3 mb-0.5">{t.slice(2, -2)}</p>;

    if (BULLET_RE.test(t))
      return (
        <div key={i} className="flex items-start gap-2.5 my-0.5 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0 mt-[5px]" />
          <span className="text-[13px] text-[#c8d0da] leading-relaxed flex-1">
            {renderInline(t.replace(BULLET_RE, ''))}
          </span>
        </div>
      );

    const numMatch = t.match(NUMBERED_RE);
    if (numMatch)
      return (
        <div key={i} className="flex items-start gap-2 my-0.5 pl-1">
          <span className="text-[11px] font-bold text-blue-400/70 shrink-0 mt-0.5 min-w-[16px] text-right">
            {numMatch[1]}.
          </span>
          <span className="text-[13px] text-[#c8d0da] leading-relaxed flex-1">
            {renderInline(t.replace(NUMBERED_RE, ''))}
          </span>
        </div>
      );

    return (
      <p key={i} className="text-[13px] text-[#c8d0da] leading-relaxed">
        {renderInline(t)}
      </p>
    );
  });

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};

export default MarkdownContent;
