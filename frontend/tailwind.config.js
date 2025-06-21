/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {      colors: {        // Launch brand colors with new dark theme palette
        // #fbbf24 - Honey Yellow (Primary Accent)
        // #0f1419 - Very Dark Navy/Black (Primary)  
        // #1e2936 - Darker Navy (Secondary)
        // #94a3b8 - Slate-400 (Neutral Text)
        // #111827 - Dark Gray (Background)
        primary: {
          50: '#fef3c7',   // Light honey
          100: '#fde68a',  // Lighter honey
          200: '#fcd34d',  // Light yellow
          300: '#fbbf24',  // Honey yellow (main accent)
          400: '#f59e0b',  // Amber
          500: '#0f1419',  // Very dark navy (main brand color)
          600: '#1e2936',  // Darker navy
          700: '#374151',  // Gray-700
          800: '#1f2937',  // Gray-800
          900: '#111827',  // Gray-900 (background)
          950: '#030712',  // Gray-950
        },
        // Launch theme colors
        launch: {
          navy: '#0f1419',      // Very dark navy
          darkNavy: '#1e2936',  // Darker navy
          honey: '#fbbf24',     // Honey yellow
          neutral: '#94a3b8',   // Slate-400
          background: '#111827', // Dark gray background
          // Legacy colors for compatibility
          teal: '#159A9C',      // Legacy teal
          gray: '#B4BEC9',      // Legacy gray
          mint: '#DEEFE7',      // Legacy mint
          white: '#FFFFFF',     // White
        },
        // Dynamic theme colors (using CSS custom properties)
        theme: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          neutral: 'var(--color-neutral)',
          accent: 'var(--color-accent)',
          background: 'var(--color-background)',
        },
        // Status colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}
