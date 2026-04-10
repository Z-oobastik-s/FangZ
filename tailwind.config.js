/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#020205',
        panel: '#06060d',
        acid: '#00f0ff',
        'acid-dim': '#00a8b8',
        blood: '#ff1a5c',
        wire: '#8b5cf6',
        ash: '#64748b',
        frost: '#e2e8f0',
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      boxShadow: {
        'glow-acid': '0 0 32px rgba(0, 240, 255, 0.22), 0 0 1px rgba(0, 240, 255, 0.8)',
        'glow-acid-sm': '0 0 16px rgba(0, 240, 255, 0.18)',
        'glow-wire': '0 0 28px rgba(139, 92, 246, 0.2)',
        'inset-frost': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        capture:
          '0 0 0 1px rgba(0, 240, 255, 0.12), 0 0 60px rgba(0, 0, 0, 0.85), 0 0 80px rgba(0, 240, 255, 0.08)',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 1px)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 2px)' },
        },
        pulseBlood: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.88', filter: 'brightness(1.35)' },
        },
        fzBreathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.65', transform: 'scale(1.002)' },
        },
        fzHit: {
          '0%': { filter: 'brightness(1.35) drop-shadow(0 0 8px rgba(0,240,255,0.9))' },
          '100%': { filter: 'brightness(1) drop-shadow(0 0 0 rgba(0,240,255,0))' },
        },
        fzMiss: {
          '0%': { filter: 'brightness(1.4) contrast(1.15)', transform: 'translate(0)' },
          '25%': { transform: 'translate(-4px, 3px)' },
          '50%': { transform: 'translate(3px, -2px)' },
          '100%': { filter: 'brightness(1)', transform: 'translate(0)' },
        },
        fzTicker: {
          '0%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
          '100%': { opacity: '0.35' },
        },
      },
      animation: {
        glitch: 'glitch 0.12s ease-out 2',
        'pulse-blood': 'pulseBlood 0.35s ease-out 2',
        'fz-breathe': 'fzBreathe 5.5s ease-in-out infinite',
        'fz-hit': 'fzHit 0.14s ease-out 1',
        'fz-miss': 'fzMiss 0.22s ease-out 1',
        'fz-ticker': 'fzTicker 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
