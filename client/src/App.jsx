import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Auth        = lazy(() => import('./pages/Auth'));
const Dashboard   = lazy(() => import('./pages/Dashboard'));

// ─── Premium page loader ───────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-[#070809]">
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[11px] font-black text-white shadow-glow-blue">
          CS
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: 'rgba(59,130,246,0.3)', filter: 'blur(8px)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── Page transition wrapper ───────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ height: '100%', display: 'contents' }}
      >
        <Routes location={location}>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/auth"      element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Legacy route redirects */}
          <Route path="/workspace" element={<Navigate to="/dashboard" replace />} />
          <Route path="/board"     element={<Navigate to="/dashboard?view=dashboard&board=board" replace />} />
          <Route path="/chat"      element={<Navigate to="/dashboard?view=chat" replace />} />
          {/* Catch-all */}
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
