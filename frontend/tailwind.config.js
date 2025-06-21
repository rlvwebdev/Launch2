/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Professional Color System - World-class TMS Design
      colors: {
        // Primary Brand Colors - Professional Transportation Blue
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Main brand color - professional blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        
        // Enhanced Neutral System - Enterprise Grade
        neutral: {
          25: '#fcfcfd',   // Ultra light backgrounds
          50: '#f8fafc',   // Page backgrounds
          100: '#f1f5f9',  // Card backgrounds
          200: '#e2e8f0',  // Borders, dividers
          300: '#cbd5e1',  // Disabled states
          400: '#94a3b8',  // Secondary text
          500: '#64748b',  // Body text
          600: '#475569',  // Headings
          700: '#334155',  // Important text
          800: '#1e293b',  // Navigation
          900: '#0f172a',  // Primary text
          950: '#020617'   // Maximum contrast
        },
        
        // Semantic Status Colors - Transportation Operations
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Completed, delivered, active
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f59e0b',  // Maintenance, delays, attention
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Breakdowns, critical issues
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Information, updates, notifications
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        
        // Transportation Entity Colors
        truck: {
          50: '#fef7f0',
          100: '#feecdc',
          200: '#fed4b8',
          300: '#fdb584',
          400: '#fb8a4e',
          500: '#f97316',  // Orange for trucks
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        trailer: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Blue for trailers
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        driver: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',  // Yellow for drivers
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006'
        },
        load: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Green for loads
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        
        // Surface System - Professional Layering
        surface: {
          base: '#ffffff',      // Default background
          raised: '#ffffff',    // Cards, panels
          overlay: '#ffffff',   // Modals, dropdowns
          sunken: '#f8fafc',   // Input fields, wells
          inverse: '#0f172a'   // Dark mode, inverse elements
        },
        
        // Legacy CSS Variable Support (backward compatibility)
        'color-primary': '#0ea5e9',
        'color-accent': '#0ea5e9',
        'color-background': '#ffffff',
        'color-surface': '#f8fafc',
        'color-text': '#0f172a',
        'color-text-secondary': '#64748b',
        'color-neutral': '#cbd5e1',        'color-border': '#e2e8f0'
      },
      
      // Enhanced Screen Breakpoints - Optimized for laptop and high-resolution displays
      screens: {
        'sm': '640px',    // Mobile landscape
        'md': '768px',    // Tablet portrait
        'lg': '1024px',   // Laptop (standard)
        'xl': '1280px',   // Desktop (standard)
        '2xl': '1536px',  // Large desktop
        '3xl': '1920px',  // Full HD
        '4xl': '2560px',  // 2K displays
        'ultrawide': '3440px', // Ultrawide monitors
      },
      
      // Professional Typography Scale - Optimized for TMS interfaces
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.025em' }],    // 12px - Small labels, badges
        'sm': ['0.875rem', { lineHeight: '1.25', letterSpacing: '0.025em' }],   // 14px - Body text, descriptions
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],            // 16px - Default body text
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],          // 18px - Large body text
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],           // 20px - Small headings
        '2xl': ['1.5rem', { lineHeight: '1.33', letterSpacing: '-0.025em' }],   // 24px - Section headings
        '3xl': ['1.875rem', { lineHeight: '1.33', letterSpacing: '-0.025em' }], // 30px - Page headings
        '4xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.05em' }],   // 36px - Large headings
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.05em' }],       // 48px - Hero headings
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.05em' }],    // 60px - Display headings
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.05em' }],     // 72px - Large display
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.075em' }],        // 96px - XXL display
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.075em' }]         // 128px - Massive display
      },
      
      // Font Families - Professional typography stack
      fontFamily: {
        'primary': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'heading': ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Liberation Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      
      // Enhanced Spacing System - 4px grid for precise layouts
      spacing: {
        '0.5': '0.125rem',   // 2px
        '1.5': '0.375rem',   // 6px
        '2.5': '0.625rem',   // 10px
        '3.5': '0.875rem',   // 14px
        '4.5': '1.125rem',   // 18px
        '5.5': '1.375rem',   // 22px
        '6.5': '1.625rem',   // 26px
        '7.5': '1.875rem',   // 30px
        '8.5': '2.125rem',   // 34px
        '9.5': '2.375rem',   // 38px
        '18': '4.5rem',      // 72px
        '22': '5.5rem',      // 88px
        '26': '6.5rem',      // 104px
        '30': '7.5rem',      // 120px
        '34': '8.5rem',      // 136px
        '38': '9.5rem',      // 152px
        '42': '10.5rem',     // 168px
        '46': '11.5rem',     // 184px
        '50': '12.5rem',     // 200px
        '54': '13.5rem',     // 216px
        '58': '14.5rem',     // 232px
        '62': '15.5rem',     // 248px
        '66': '16.5rem',     // 264px
        '70': '17.5rem',     // 280px
        '74': '18.5rem',     // 296px
        '78': '19.5rem',     // 312px
        '82': '20.5rem',     // 328px
        '86': '21.5rem',     // 344px
        '90': '22.5rem',     // 360px
        '94': '23.5rem',     // 376px
        '98': '24.5rem'      // 392px
      },
      
      // Professional Border Radius Scale
      borderRadius: {
        'xs': '0.125rem',    // 2px - Small elements, badges
        'sm': '0.25rem',     // 4px - Buttons, inputs
        'DEFAULT': '0.375rem', // 6px - Cards, panels
        'md': '0.5rem',      // 8px - Larger cards
        'lg': '0.75rem',     // 12px - Modal, major components
        'xl': '1rem',        // 16px - Large panels
        '2xl': '1.5rem',     // 24px - Hero elements
        '3xl': '2rem',       // 32px - Large containers
        '4xl': '2.5rem',     // 40px - Extra large
        '5xl': '3rem'        // 48px - Maximum
      },
      
      // Professional Shadow System - Enterprise grade depth
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.2)',
        '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
        
        // Professional elevation system
        'elevated': '0 8px 30px rgb(0 0 0 / 0.08), 0 4px 16px rgb(0 0 0 / 0.06)',
        'floating': '0 16px 40px rgb(0 0 0 / 0.12), 0 8px 24px rgb(0 0 0 / 0.08)',
        'glass': '0 4px 16px 0 rgb(31 38 135 / 0.15), 0 8px 32px 0 rgb(31 38 135 / 0.1)',
        'glow': '0 0 20px rgb(14 165 233 / 0.15)',
        
        // Focus states
        'outline': '0 0 0 3px rgb(14 165 233 / 0.15)',
        'outline-error': '0 0 0 3px rgb(239 68 68 / 0.15)',
        'outline-warning': '0 0 0 3px rgb(245 158 11 / 0.15)',
        'outline-success': '0 0 0 3px rgb(34 197 94 / 0.15)',
        
        // Component-specific shadows
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
        'dropdown': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
        'nav': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)'
      },
      
      // Professional Transition System
      transitionDuration: {
        'fast': '150ms',     // Quick interactions
        'normal': '250ms',   // Standard transitions
        'slow': '350ms',     // Deliberate animations
        'slower': '500ms'    // Complex animations
      },
      
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ease-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1)'
      },
      
      // Grid Templates - Professional layouts
      gridTemplateColumns: {
        'dashboard': 'repeat(12, minmax(0, 1fr))',
        'auto-fit': 'repeat(auto-fit, minmax(320px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(280px, 1fr))',
        'sidebar': 'minmax(200px, 240px) 1fr',
        'sidebar-collapsed': '64px 1fr',
        'nav-mobile': '1fr auto',
        'layout-desktop': 'auto 1fr auto',
        'stats': 'repeat(auto-fit, minmax(200px, 1fr))',
        'cards': 'repeat(auto-fit, minmax(300px, 1fr))',
        'list': '1fr 120px 100px 120px 80px'
      },
      
      // Z-Index Scale - Organized layering
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
        'toast': '800',
        'loading': '900',
        'max': '999'
      },
      
      // Professional Animation System
      keyframes: {
        // Basic transitions
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        
        // Slide animations
        'slide-in-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        
        // Scale animations
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' }
        },
        
        // Loading animations
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        
        // Interactive animations
        'bounce-gentle': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' }
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
        },
        
        // Status animations
        'success-check': {
          '0%': { transform: 'scale(0) rotate(45deg)', opacity: '0' },
          '50%': { transform: 'scale(1.1) rotate(45deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(45deg)', opacity: '1' }
        }
      },
      
      animation: {
        // Basic transitions
        'fade-in': 'fade-in 0.25s ease-out',
        'fade-out': 'fade-out 0.25s ease-out',
        
        // Slide animations
        'slide-in-up': 'slide-in-up 0.35s ease-out',
        'slide-in-down': 'slide-in-down 0.35s ease-out',
        'slide-in-left': 'slide-in-left 0.35s ease-out',
        'slide-in-right': 'slide-in-right 0.35s ease-out',
        
        // Scale animations
        'scale-in': 'scale-in 0.25s ease-out',
        'scale-out': 'scale-out 0.25s ease-out',
        
        // Loading states
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        
        // Interactive feedback
        'bounce-gentle': 'bounce-gentle 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        
        // Status feedback
        'success-check': 'success-check 0.6s ease-out'
      },
      
      // Backdrop Blur Scale
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px'
      }
    },
  },  plugins: [
    forms({
      strategy: 'class',
    }),
    typography,
    // Custom Utilities Plugin
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Professional Button Utilities
        '.btn-primary': {
          backgroundColor: theme('colors.primary.500'),
          color: theme('colors.white'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: theme('colors.primary.600'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.md'),
          },
          '&:active': {
            backgroundColor: theme('colors.primary.700'),
            transform: 'translateY(0)',
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.neutral.100'),
          color: theme('colors.neutral.700'),
          border: `1px solid ${theme('colors.neutral.300')}`,
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: theme('colors.neutral.50'),
            borderColor: theme('colors.neutral.400'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.sm'),
          },
        },
        // Professional Card Utilities
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.sm'),
          border: `1px solid ${theme('colors.neutral.200')}`,
          transition: 'all 0.2s ease',
        },
        '.card-hover': {
          '&:hover': {
            boxShadow: theme('boxShadow.md'),
            transform: 'translateY(-1px)',
          },
        },
        // Professional Input Utilities
        '.input': {
          backgroundColor: theme('colors.white'),
          border: `1px solid ${theme('colors.neutral.300')}`,
          borderRadius: theme('borderRadius.md'),
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          transition: 'all 0.2s ease',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}20`,
          },
        },
        // Mobile-First Touch Targets
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        // Professional Loading States
        '.loading-shimmer': {
          background: `linear-gradient(90deg, ${theme('colors.neutral.200')} 25%, ${theme('colors.neutral.100')} 50%, ${theme('colors.neutral.200')} 75%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        },
        // Accessibility Utilities
        '.focus-ring': {
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}40`,
          },
        },
      };
      addUtilities(newUtilities);    },
  ],
};

export default config;
