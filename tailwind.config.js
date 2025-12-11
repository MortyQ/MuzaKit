import {createThemes} from './src/features/theme/utils/createThemes.ts'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['GT America Standard', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      // Gradient backgrounds & backdrop utilities (utilities layer will consume these names via classes like bg-gradient-blue)
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 50%, #00008B 100%)',
        'gradient-blue-subtle': 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
        'gradient-blue-dark': 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #082f49 100%)',
        'gradient-radial-blue': 'radial-gradient(circle at top, #87CEEB 0%, #4A90E2 50%, #00008B 100%)',
        'gradient-radial-subtle': 'radial-gradient(circle at center, #f0f9ff 0%, #bae6fd 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, #87CEEB 0px, transparent 50%), radial-gradient(at 100% 100%, #00008B 0px, transparent 50%), radial-gradient(at 50% 50%, #4A90E2 0px, transparent 50%)'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px'
      },
      backdropSaturate: {
        0: '0',
        50: '.5',
        100: '1',
        150: '1.5',
        200: '2'
      },
      backdropBrightness: {
        0: '0',
        50: '.5',
        75: '.75',
        90: '.9',
        95: '.95',
        100: '1',
        105: '1.05',
        110: '1.1',
        125: '1.25',
        150: '1.5',
        200: '2'
      }
    }
  },
  plugins: [
    createThemes({
      // LIGHT THEME ------------------------------------------------------------
      light: {
        // Primary blue scale (flattened tokens for Tailwind classes like bg-primary-500)
        'primary-50': '#f0f9ff',
        'primary-100': '#e0f2fe',
        'primary-200': '#bae6fd',
        'primary-300': '#7dd3fc',
        'primary-400': '#38bdf8',
        'primary-500': '#0ea5e9', // base
        'primary-600': '#0284c7', // hover
        'primary-700': '#0369a1', // active
        'primary-800': '#075985',
        'primary-900': '#0c4a6e',
        'primary-950': '#082f49',
        // Legacy semantic aliases (ensure backward compatibility)
        primary: '#0ea5e9',
        'primary-dark': '#0284c7',
        'primary-hover': '#0284c7',
        'primary-light': '#38bdf8',
        // Neutral / gray scale (slate)
        // In light mode: 50-300 for backgrounds/hover, 600-900 for text
        'neutral-50': '#f8fafc',   // lightest background
        'neutral-100': '#f1f5f9',  // subtle background
        'neutral-200': '#e2e8f0',  // hover background
        'neutral-300': '#cbd5e1',  // borders
        'neutral-400': '#94a3b8',  // muted text
        'neutral-500': '#64748b',  // secondary text
        'neutral-600': '#475569',  // body text
        'neutral-700': '#334155',  // heading text
        'neutral-800': '#1e293b',  // emphasized text
        'neutral-900': '#0f172a',  // strongest text
        neutral: '#334155', // legacy
        // Success scale
        'success-50': '#f0fdf4',
        'success-100': '#dcfce7',
        'success-200': '#bbf7d0',
        'success-300': '#86efac',
        'success-400': '#4ade80',
        'success-500': '#22c55e',
        'success-600': '#16a34a',
        'success-700': '#15803d',
        'success-800': '#166534',
        'success-900': '#14532d',
        success: '#22c55e',
        'success-dark': '#16a34a',
        lightSuccess: '#dcfce7',
        positive: '#22c55e',
        'positive-dark': '#16a34a',
        lightPositive: '#dcfce7',
        // Error scale
        'error-50': '#fef2f2',
        'error-100': '#fee2e2',
        'error-200': '#fecaca',
        'error-300': '#fca5a5',
        'error-400': '#f87171',
        'error-500': '#ef4444',
        'error-600': '#dc2626',
        'error-700': '#b91c1c',
        'error-800': '#991b1b',
        'error-900': '#7f1d1d',
        error: '#ef4444',
        'error-dark': '#dc2626',
        lightError: '#fee2e2',
        negative: '#ef4444',
        'negative-dark': '#dc2626',
        lightNegative: '#fee2e2',
        // Warning scale
        'warning-50': '#fffbeb',
        'warning-100': '#fef3c7',
        'warning-200': '#fde68a',
        'warning-300': '#fcd34d',
        'warning-400': '#fbbf24',
        'warning-500': '#f59e0b',
        'warning-600': '#d97706',
        'warning-700': '#b45309',
        'warning-800': '#92400e',
        'warning-900': '#78350f',
        warning: '#f59e0b',
        'warning-dark': '#d97706',
        lightWarning: '#fef3c7',
        // Info / Cyan scale
        'info-50': '#ecfeff',
        'info-100': '#cffafe',
        'info-200': '#a5f3fc',
        'info-300': '#67e8f9',
        'info-400': '#22d3ee',
        'info-500': '#06b6d4',
        'info-600': '#0891b2',
        'info-700': '#0e7490',
        'info-800': '#155e75',
        'info-900': '#164e63',
        info: '#06b6d4',
        'info-dark': '#0891b2',
        lightInfo: '#cffafe',
        // Base (UI surfaces)
        'base-100': '#ffffff',
        'base-200': '#f8fafc',
        'base-300': '#f1f5f9',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        mainBg: '#f8fafc',
        mainText: '#1e293b',
        secondaryText: '#64748b',
        inputBg: '#ffffff',
        primaryHover: '#0284c7',
        lightGray: '#f1f5f9',
        secondary: '#64748b',      // medium gray - good for secondary text in light mode
        'secondary-dark': '#475569', // darker gray for hover states
        accent: '#06b6d4',         // cyan accent
        'accent-dark': '#0891b2',  // darker cyan for hover
      },
      // DARK THEME -------------------------------------------------------------
      dark: {
        'primary-50': '#f0f9ff', // keep same for possible translucency in dark overlays
        'primary-100': '#e0f2fe',
        'primary-200': '#bae6fd',
        'primary-300': '#7dd3fc',
        'primary-400': '#38bdf8', // brighter base in dark mode
        'primary-500': '#0ea5e9',
        'primary-600': '#0284c7',
        'primary-700': '#0369a1',
        'primary-800': '#075985',
        'primary-900': '#0c4a6e',
        'primary-950': '#082f49',
        primary: '#38bdf8',
        'primary-dark': '#0ea5e9',
        'primary-hover': '#0ea5e9',
        'primary-light': '#7dd3fc',
        // Neutral scale (darker bases) - DARK THEME
        // In dark mode: 700-900 for backgrounds, 50-400 for text/borders
        'neutral-50': '#f8fafc',   // lightest text (rarely used)
        'neutral-100': '#f1f5f9',  // very light text
        'neutral-200': '#e2e8f0',  // light text
        'neutral-300': '#cbd5e1',  // borders in dark
        'neutral-400': '#94a3b8',  // secondary text in dark
        'neutral-500': '#64748b',  // muted text
        'neutral-600': '#475569',  // subtle backgrounds
        'neutral-700': '#334155',  // elevated background
        'neutral-800': '#1e293b',  // card background
        'neutral-900': '#0f172a',  // main background
        neutral: '#cbd5e1', // legacy - use light gray for neutral in dark mode
        // Success
        'success-50': '#f0fdf4',
        'success-100': '#dcfce7',
        'success-200': '#bbf7d0',
        'success-300': '#86efac',
        'success-400': '#4ade80',
        'success-500': '#22c55e',
        'success-600': '#16a34a',
        'success-700': '#15803d',
        'success-800': '#166534',
        'success-900': '#14532d',
        success: '#4ade80',
        'success-dark': '#22c55e',
        lightSuccess: '#14532d',
        positive: '#4ade80',
        'positive-dark': '#22c55e',
        lightPositive: '#14532d',
        // Error
        'error-50': '#fef2f2',
        'error-100': '#fee2e2',
        'error-200': '#fecaca',
        'error-300': '#fca5a5',
        'error-400': '#f87171',
        'error-500': '#ef4444',
        'error-600': '#dc2626',
        'error-700': '#b91c1c',
        'error-800': '#991b1b',
        'error-900': '#7f1d1d',
        error: '#f87171',
        'error-dark': '#ef4444',
        lightError: '#7f1d1d',
        negative: '#f87171',
        'negative-dark': '#ef4444',
        lightNegative: '#7f1d1d',
        // Warning
        'warning-50': '#fffbeb',
        'warning-100': '#fef3c7',
        'warning-200': '#fde68a',
        'warning-300': '#fcd34d',
        'warning-400': '#fbbf24',
        'warning-500': '#f59e0b',
        'warning-600': '#d97706',
        'warning-700': '#b45309',
        'warning-800': '#92400e',
        'warning-900': '#78350f',
        warning: '#fbbf24',
        'warning-dark': '#f59e0b',
        lightWarning: '#78350f',
        // Info
        'info-50': '#ecfeff',
        'info-100': '#cffafe',
        'info-200': '#a5f3fc',
        'info-300': '#67e8f9',
        'info-400': '#22d3ee',
        'info-500': '#06b6d4',
        'info-600': '#0891b2',
        'info-700': '#0e7490',
        'info-800': '#155e75',
        'info-900': '#164e63',
        info: '#22d3ee',
        'info-dark': '#06b6d4',
        lightInfo: '#164e63',
        // Surfaces
        'base-100': '#0f172a',
        'base-200': '#1e293b',
        'base-300': '#334155',
        cardBg: '#1e293b',
        cardBorder: '#334155',
        mainBg: '#0f172a',
        mainText: '#f1f5f9',
        secondaryText: '#94a3b8',
        inputBg: '#1e293b',
        primaryHover: '#0ea5e9',
        lightGray: '#334155',
        secondary: '#94a3b8',
        'secondary-dark': '#64748b',
        accent: '#22d3ee',
        'accent-dark': '#06b6d4',
      }
    })
  ]
}