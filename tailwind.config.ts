import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e11d48',
          'red-light': '#f43f5e',
          'red-dark': '#be123c',
          'red-darker': '#9f1239',
        },
        dark: {
          950: '#0a0a0a',
          900: '#141414',
          800: '#1c1c1c',
          700: '#262626',
          600: '#333333',
        },
        success: {
          500: '#22c55e',
          600: '#16a34a',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(225, 29, 72, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(225, 29, 72, 0.5)' },
        },
      },
      boxShadow: {
        'brand': '0 0 30px rgba(225, 29, 72, 0.25)',
        'brand-lg': '0 0 50px rgba(225, 29, 72, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
