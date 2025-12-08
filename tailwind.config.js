/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme palette (inspired by modern mobile apps)
        'primary': '#00ff88', // Neon green for accents
        'primary-blue': '#497EE9',
        'secondary-blue': '#DDE2EE',
        'light-blue': '#CBE3FF',
        'dark-blue': '#263043',
        // Dark theme colors
        'dark-bg': '#0a0a0a', // Main dark background
        'dark-card': '#1a1a1a', // Card background (slightly lighter)
        'dark-card-hover': '#1f1f1f', // Card hover state
        'dark-border': '#2a2a2a', // Border color
        'dark-text': '#FFFFFF', // Primary text
        'dark-text-secondary': '#a0a0a0', // Secondary text
        'dark-text-muted': '#6b6b6b', // Muted text
        // Legacy grays (kept for compatibility)
        'gray-20': '#7B828E',
        'gray-30': '#8C929D',
        'gray-40': '#ADB2BC',
        'gray-50': '#4E5667',
        // Theme-aware colors
        'foreground': '#FFFFFF', // Changed to white for dark theme
        'background': '#0a0a0a', // Changed to dark
        'card-bg': '#1a1a1a', // Changed to dark card
        'border-color': '#2a2a2a', // Changed to dark border
        'text-dark': '#FFFFFF', // Changed to white
        'text-gray': '#a0a0a0', // Changed to light gray
        'purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        'pink': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9f1239',
          900: '#831843',
        },
        // Rainbow gradient colors for accents
        'rainbow': {
          green: '#00ff88',
          yellow: '#ffd700',
          orange: '#ff8c00',
          red: '#ff0066',
          pink: '#ff1493',
          blue: '#00d4ff',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
