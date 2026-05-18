/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Surface system
        surface: {
          base: '#070809',
          0: '#0a0b0d',
          1: '#101214',
          2: '#161819',
          3: '#1a1c1f',
          4: '#1f2126',
        },
        // Sidebar tokens
        sidebar: {
          bg:     '#0f1012',
          border: '#1c1e22',
          hover:  '#16181c',
          active: '#1a2035',
        },
        // Accent palette
        accent: {
          blue:      '#3b82f6',
          'blue-dim': '#1d4ed8',
          'blue-soft': '#93c5fd',
          purple:    '#8b5cf6',
          emerald:   '#10b981',
          amber:     '#f59e0b',
          red:       '#ef4444',
          pink:      '#ec4899',
          indigo:    '#6366f1',
        },
        // Border tokens
        border: {
          subtle:  'rgba(255,255,255,0.04)',
          default: 'rgba(255,255,255,0.07)',
          strong:  'rgba(255,255,255,0.12)',
        },
      },
      animation: {
        'fade-in':        'fadeIn 0.2s ease-out',
        'fade-up':        'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-down':      'fadeDown 0.2s ease-out',
        'slide-in-left':  'slideInLeft 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':       'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
        'shimmer':        'shimmer 1.8s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'glow-pulse':     'glowPulse 2.5s ease-in-out infinite',
        'spin-slow':      'spin 4s linear infinite',
        'bounce-subtle':  'bounceSubtle 0.5s cubic-bezier(0.16,1,0.3,1)',
        'slide-up':       'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        'pulse-slow':     'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-14px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(14px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '-400px 0' },
          to:   { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1)' },
          '50%':      { opacity: '0.5', filter: 'brightness(1.4)' },
        },
        bounceSubtle: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        // Glow shadows
        'glow-blue':    '0 0 20px rgba(59,130,246,0.3), 0 0 48px rgba(59,130,246,0.12)',
        'glow-purple':  '0 0 20px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.1)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.25)',
        'glow-amber':   '0 0 20px rgba(245,158,11,0.25)',
        // Surface shadows
        'card':         '0 1px 4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover':   '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
        'premium':      '0 0 0 1px rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.35)',
        'modal':        '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        'sidebar':      'inset -1px 0 0 rgba(255,255,255,0.04)',
        'dropdown':     '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        // Focus shadows
        'input-focus':  '0 0 0 3px rgba(59,130,246,0.15)',
        // Elevation system
        'sm-dark':      '0 1px 3px rgba(0,0,0,0.4)',
        'md-dark':      '0 4px 16px rgba(0,0,0,0.4)',
        'lg-dark':      '0 16px 48px rgba(0,0,0,0.5)',
        'xl-dark':      '0 32px 80px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer-dark':    'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)',
        'glass-surface':   'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'blue-glow':       'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)',
        'purple-glow':     'radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs:   '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth':  'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}
