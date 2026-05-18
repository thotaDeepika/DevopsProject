import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, LayoutGrid, MessageSquare, Brain, Sparkles } from 'lucide-react';
import API from '../services/api';

const FEATURES = [
  { icon: LayoutGrid,    text: 'Real-time Kanban boards' },
  { icon: MessageSquare, text: 'Team chat built-in' },
  { icon: Brain,         text: 'AI workspace assistant' },
  { icon: Sparkles,      text: 'Infinite whiteboard canvas' },
];

const Auth = () => {
  const [isLogin,       setIsLogin]       = useState(true);
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [name,          setName]          = useState('');
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [showPassword,  setShowPassword]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload  = isLogin ? { email, password } : { name, email, password };
      const res      = await API.post(endpoint, payload);
      localStorage.setItem('token',        res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('user',         JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const inputCls = "w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-3 text-[13px] text-[#e0e4eb] placeholder:text-[#3d4450] focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all duration-150";

  return (
    <div className="min-h-screen flex bg-[#070809]">

      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex w-[460px] shrink-0 flex-col relative overflow-hidden bg-[#0d0e11] border-r border-white/[0.05]">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-blue-600/[0.12] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[350px] h-[350px] rounded-full bg-purple-600/[0.08] blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[11px] font-black text-white shadow-glow-blue">
              CS
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight">CollabSpace</span>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold text-blue-400 mb-6 bg-blue-500/10 px-3 py-1.5 rounded-full w-fit border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              v2.0 — Production Ready
            </div>

            <h2 className="text-4xl font-black tracking-tight leading-[1.08] mb-5 text-white">
              Your team's command<br />
              <span className="gradient-text bg-gradient-to-r from-blue-400 to-purple-400">
                center
              </span>
            </h2>

            <p className="text-[#6e7a88] leading-relaxed mb-10 text-[13px] max-w-xs">
              Everything your team needs to plan, build, and ship — in one real-time workspace.
            </p>

            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Icon size={14} />
                  </div>
                  <span className="text-[13px] text-[#9aa3b0] font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="border-t border-white/[0.06] pt-6">
            <p className="text-[11px] text-[#3d4450] mb-3">Trusted by engineering teams</p>
            <div className="flex -space-x-2">
              {['AK', 'BM', 'CL', 'DR', 'EF'].map(initials => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full border-2 border-[#0d0e11] bg-gradient-to-br from-[#1f2126] to-[#16181a] flex items-center justify-center text-[9px] font-bold text-[#6e7a88]"
                >
                  {initials}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#0d0e11] bg-white/[0.04] flex items-center justify-center text-[9px] font-bold text-[#5c6570]">
                +∞
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] bg-blue-600/[0.04] blur-[100px] rounded-full" />
        </div>

        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[11px] font-black text-white">CS</div>
            <span className="font-bold text-white text-[14px]">CollabSpace</span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-[22px] font-black text-white tracking-tight mb-1.5">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-[13px] text-[#5c6570]">
              {isLogin ? 'Sign in to continue to CollabSpace' : 'Join your team and start building'}
            </p>
          </div>

          {/* Error banner */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl mb-5 text-[12px]"
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (register only) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="form-label">Full Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="form-label">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls} pr-11`}
                  placeholder="••••••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c6570] hover:text-[#9aa3b0] transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-150 active:scale-[0.98] mt-1 text-[13px] cursor-pointer"
              style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-[12px] text-[#5c6570] hover:text-[#9aa3b0] transition-colors cursor-pointer"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-blue-400 font-semibold hover:text-blue-300">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-blue-400 font-semibold hover:text-blue-300">Sign in</span></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
