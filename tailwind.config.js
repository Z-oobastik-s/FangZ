/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#030308',
        panel: '#0a0a12',
        acid: '#00f0ff',
        blood: '#ff2d6a',
        wire: '#7c3aed',
        ash: '#6b7280',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
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
          '50%': { opacity: '0.85', filter: 'brightness(1.4)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        glitch: 'glitch 0.12s ease-out 2',
        'pulse-blood': 'pulseBlood 0.35s ease-out 2',
        scan: 'scan 6s linear infinite',
      },
    },
  },
  plugins: [],
};
