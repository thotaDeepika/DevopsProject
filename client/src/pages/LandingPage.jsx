import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Zap, LayoutGrid, MessageSquare, Layers,
  Shield, CheckCircle, Users, TrendingUp, Brain,
  PenTool, BarChart3, Sparkles, ChevronRight, Play,
  Globe, Code2, ExternalLink,
} from 'lucide-react';

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const SectionRef = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
};

const FEATURES = [
  { icon: Zap,          color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  title: 'Real-Time Collaboration',  desc: 'See updates the moment they happen. Drag tasks, type messages — your entire team stays perfectly in sync.' },
  { icon: LayoutGrid,   color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  title: 'Visual Task Management',   desc: 'Fluid drag-and-drop Kanban boards. Table views. Analytics. Know exactly where every project stands.' },
  { icon: MessageSquare,color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'Contextual Chat',           desc: 'Keep conversations right next to your work. No more app-switching — messages live where the work lives.' },
  { icon: Layers,       color: '#ec4899', bg: 'rgba(236,72,153,0.1)',  title: 'Infinite Whiteboard',       desc: 'Sketch architectures, brainstorm wireframes, map flows — all on a limitless canvas built into your workspace.' },
  { icon: Brain,        color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  title: 'AI Assistant',              desc: 'Daily digests, chat summaries, task generation. Powered by Gemini — your intelligent workspace co-pilot.' },
  { icon: Shield,       color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  title: 'Enterprise Security',       desc: 'JWT auth, encrypted tokens, isolated workspaces. Your intellectual property is protected at every layer.' },
];

const STATS = [
  { value: '10x',   label: 'Faster task management' },
  { value: '99.9%', label: 'Uptime guaranteed' },
  { value: '<50ms', label: 'Real-time latency' },
  { value: '∞',     label: 'Workspace capacity' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Lead Engineer',      avatar: 'SK', text: 'CollabSpace replaced 4 tools for our team. The real-time sync is genuinely instant — it changed how we ship.' },
  { name: 'Marcus T.', role: 'Product Manager',   avatar: 'MT', text: 'The AI assistant saves me 30 minutes every morning. Daily digests alone are worth the switch.' },
  { name: 'Priya R.', role: 'DevOps Architect',   avatar: 'PR', text: 'The whiteboard + kanban combo is unmatched. We plan infrastructure and track it in the same tool.' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: Users,       title: 'Create your workspace', desc: 'Sign up and create a workspace in seconds. Invite your team with a simple code.' },
  { step: '02', icon: LayoutGrid,  title: 'Add your tasks',        desc: 'Create tasks, set priorities, assign deadlines. Organize with drag-and-drop kanban.' },
  { step: '03', icon: TrendingUp,  title: 'Ship together',         desc: 'Real-time chat, AI insights, whiteboards — collaborate and ship with momentum.' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070809] text-[#f0f2f5] overflow-x-hidden">

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[5%] w-[700px] h-[700px] rounded-full bg-blue-600/[0.07] blur-[160px]" />
        <div className="absolute top-[25%] right-[-15%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.05] blur-[140px]" />
        <div className="absolute bottom-[5%] left-[25%] w-[500px] h-[500px] rounded-full bg-emerald-600/[0.04] blur-[120px]" />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-20 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[11px] font-black text-white shadow-glow-blue">
              CS
            </div>
            <span className="font-bold text-[14px] tracking-tight text-white">CollabSpace</span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {['Features', 'Metrics', 'Reviews'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="landing-nav-link text-[13px]">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/auth')}
              className="text-[13px] font-medium text-[#6e7a88] hover:text-[#e0e4eb] transition-colors px-4 py-2 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="text-[13px] font-semibold bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-100 transition-all duration-150 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Version badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 mb-8 cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-medium text-[#9aa3b0]">CollabSpace v2.0 — Live &amp; Production Ready</span>
            <ChevronRight size={12} className="text-[#5c6570]" />
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.04] mb-6 text-balance">
            Where high-performance<br />
            <span className="gradient-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
              teams ship together
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={fadeUp} className="text-[17px] text-[#6e7a88] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            A unified workspace for DevOps and product teams. Real-time kanban, AI assistance,
            team chat, infinite whiteboards — everything in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <button
              onClick={() => navigate('/auth')}
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-150 active:scale-95 shadow-glow-blue cursor-pointer text-[14px]"
            >
              Start for free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-[#9aa3b0] hover:text-[#e0e4eb] font-medium px-6 py-3.5 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03] transition-all duration-150 cursor-pointer text-[14px]"
            >
              <Play size={14} fill="currentColor" />
              Open App
            </button>
          </motion.div>

          {/* App mockup */}
          <motion.div variants={fadeUp} className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-600/[0.08] to-transparent blur-3xl" />
            <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden shadow-xl-dark">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.01]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex-1 mx-4 bg-white/[0.04] rounded-md h-6 flex items-center px-3 border border-white/[0.05]">
                  <span className="text-[11px] text-[#3d4450] font-mono">app.collabspace.io/dashboard</span>
                </div>
              </div>

              {/* Dashboard preview */}
              <div className="grid h-64" style={{ gridTemplateColumns: '200px 1fr 260px' }}>
                {/* Sidebar mock */}
                <div className="border-r border-white/[0.05] p-3 bg-[#0f1012] flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-md bg-blue-600/50" />
                    <div className="h-2.5 w-20 rounded skeleton" />
                  </div>
                  {['Dashboard', 'Whiteboard', 'Analytics', 'AI Assistant', 'Team Chat'].map((item, i) => (
                    <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${i === 0 ? 'bg-blue-500/[0.12]' : ''}`}>
                      <div className={`w-3.5 h-3.5 rounded ${i === 0 ? 'bg-blue-400/50' : 'bg-white/[0.06]'}`} />
                      <div className="h-2 rounded flex-1" style={{ background: i === 0 ? 'rgba(147,197,253,0.4)' : 'rgba(255,255,255,0.04)' }} />
                    </div>
                  ))}
                </div>

                {/* Board mock */}
                <div className="p-3 flex gap-3 overflow-hidden bg-[#070809]">
                  {['Todo', 'In Progress', 'Done'].map((col, ci) => {
                    const colors = ['#f59e0b', '#3b82f6', '#10b981'];
                    return (
                      <div key={col} className="flex-1 rounded-xl p-2.5 flex flex-col gap-2 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[ci] }} />
                          <div className="h-2 w-14 rounded" style={{ background: `${colors[ci]}40` }} />
                        </div>
                        {[...Array(ci === 1 ? 3 : 2)].map((_, i) => (
                          <div key={i} className="rounded-lg p-2 border border-white/[0.05]" style={{ background: 'rgba(22,24,25,0.8)' }}>
                            <div className="h-2 rounded w-3/4 mb-1.5" style={{ background: 'rgba(255,255,255,0.1)' }} />
                            <div className="h-1.5 rounded w-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Chat mock */}
                <div className="border-l border-white/[0.05] p-3 bg-[#0f1012] flex flex-col gap-2.5">
                  <div className="h-2.5 w-16 rounded skeleton mb-1" />
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-lg shrink-0 bg-white/[0.08]" />
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="h-1.5 rounded w-2/5" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <div className="h-5 rounded-lg rounded-tl-none" style={{ background: 'rgba(255,255,255,0.05)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#070809] to-transparent rounded-b-2xl pointer-events-none" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section id="metrics" className="relative z-10 border-y border-white/[0.05] py-14">
        <SectionRef className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <div className="text-4xl font-black mb-1.5 gradient-text bg-gradient-to-br from-white to-[#5c6570]">
                {value}
              </div>
              <div className="text-[13px] text-[#5c6570] font-medium">{label}</div>
            </motion.div>
          ))}
        </SectionRef>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionRef className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[12px] font-bold text-blue-400 mb-4 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
              <Sparkles size={13} /> Everything in one workspace
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight mb-5 leading-tight">
              Built for how modern<br />teams actually work
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#6e7a88] text-[17px] max-w-2xl mx-auto leading-relaxed">
              Stop juggling 6 different tools. CollabSpace brings task management, communication,
              planning and AI together in one fluid experience.
            </motion.p>
          </SectionRef>

          <SectionRef className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="feature-card group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: bg, color }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-[14px] font-bold mb-2 text-[#e0e4eb]">{title}</h3>
                <p className="text-[#6e7a88] text-[13px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </SectionRef>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-28 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6">
          <SectionRef className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight mb-5 leading-tight">
              Up and running in 60 seconds
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#6e7a88] text-[17px]">
              No setup. No configuration. Just start building.
            </motion.p>
          </SectionRef>

          <SectionRef className="grid md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="relative p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
              >
                <div className="text-5xl font-black text-white/[0.04] absolute top-4 right-5 font-mono select-none">
                  {step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                  <Icon size={18} />
                </div>
                <h3 className="text-[14px] font-bold text-[#e0e4eb] mb-2">{title}</h3>
                <p className="text-[13px] text-[#6e7a88] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </SectionRef>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" className="relative z-10 py-28 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6">
          <SectionRef className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tight mb-4 leading-tight">
              Loved by engineering teams
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#6e7a88] text-[15px]">
              Real feedback from real teams using CollabSpace every day.
            </motion.p>
          </SectionRef>

          <SectionRef className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map(({ name, role, avatar, text }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] flex flex-col gap-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
              >
                <p className="text-[13px] text-[#9aa3b0] leading-relaxed flex-1">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#e0e4eb]">{name}</div>
                    <div className="text-[11px] text-[#5c6570]">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </SectionRef>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-28 border-t border-white/[0.05]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[350px] bg-blue-600/[0.07] blur-[120px] rounded-full" />
        </div>
        <SectionRef className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
            Ready to ship faster?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#6e7a88] text-[17px] mb-10 leading-relaxed">
            Join your team on CollabSpace. Free to start, built to scale.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-150 active:scale-95 shadow-glow-blue text-[15px] cursor-pointer"
            >
              Get Started Free
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mt-8">
            {['No credit card', 'No setup fees', 'Unlimited workspaces'].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-[12px] text-[#5c6570]">
                <CheckCircle size={13} className="text-emerald-500" />
                {item}
              </div>
            ))}
          </motion.div>
        </SectionRef>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[10px] font-black text-white">CS</div>
            <span className="text-[13px] font-semibold text-[#5c6570]">CollabSpace</span>
          </div>
          <p className="text-[11px] text-[#3d4450]">© 2026 CollabSpace. Built for high-performance DevOps teams.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#3d4450] hover:text-[#6e7a88] transition-colors"><Code2 size={16} /></a>
            <a href="#" className="text-[#3d4450] hover:text-[#6e7a88] transition-colors"><ExternalLink size={16} /></a>
            <a href="#" className="text-[#3d4450] hover:text-[#6e7a88] transition-colors"><Globe size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
