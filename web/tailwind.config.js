/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          sunken: 'rgb(var(--surface-sunken) / <alpha-value>)',
          raised: 'rgb(var(--surface) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--line) / <alpha-value>)',
          strong: 'rgb(var(--line-strong) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
        upi: {
          orange: '#FF6A1A',
          'orange-deep': '#E2540B',
          green: '#12A150',
          'green-deep': '#0A7C3C',
          navy: '#1B2A4A',
          ink: '#161A23',
        },
        rel: {
          excellent: '#12A150',
          good: '#62B95C',
          fair: '#E5A50A',
          poor: '#F2691C',
          critical: '#DC2828',
          na: '#C9C3B6',
        },
        cls: {
          solid: '#12A150',
          weak: '#DC2828',
          oneoff: '#E5A50A',
          volatile: '#6D4AFF',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(8,16,46,0.04), 0 10px 30px -16px rgba(8,16,46,0.08)',
        lift: '0 10px 40px -14px rgba(255,106,26,0.32), 0 2px 6px rgba(8,16,46,0.06)',
        glow: '0 0 0 4px rgba(255,106,26,0.14)',
        'glow-orange': '0 0 24px rgba(255,106,26,0.40), 0 0 8px rgba(255,106,26,0.22)',
        'glow-green': '0 0 20px rgba(18,161,80,0.35), 0 0 6px rgba(18,161,80,0.18)',
        inset: 'inset 0 1px 2px rgba(8,16,46,0.05)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF6A1A 0%, #FF8A3D 45%, #12A150 130%)',
        'orange-fade': 'linear-gradient(135deg, #FF8A3D, #E2540B)',
        'green-fade': 'linear-gradient(135deg, #16B85A, #0A7C3C)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 1.8s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'dash-flow': 'dashFlow 1.4s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        dashFlow: { to: { strokeDashoffset: '-24' } },
      },
    },
  },
  plugins: [],
}
