/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-light': 'hsl(var(--primary-light) / <alpha-value>)',
        'primary-dark': 'hsl(var(--primary-dark) / <alpha-value>)',
        
        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        'secondary-light': 'hsl(var(--secondary-light) / <alpha-value>)',
        'secondary-dark': 'hsl(var(--secondary-dark) / <alpha-value>)',
        
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-light': 'hsl(var(--accent-light) / <alpha-value>)',
        'accent-dark': 'hsl(var(--accent-dark) / <alpha-value>)',
        
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
        
        neutral: {
          50: 'hsl(var(--neutral-50) / <alpha-value>)',
          100: 'hsl(var(--neutral-100) / <alpha-value>)',
          200: 'hsl(var(--neutral-200) / <alpha-value>)',
          300: 'hsl(var(--neutral-300) / <alpha-value>)',
          400: 'hsl(var(--neutral-400) / <alpha-value>)',
          500: 'hsl(var(--neutral-500) / <alpha-value>)',
          600: 'hsl(var(--neutral-600) / <alpha-value>)',
          700: 'hsl(var(--neutral-700) / <alpha-value>)',
          800: 'hsl(var(--neutral-800) / <alpha-value>)',
          900: 'hsl(var(--neutral-900) / <alpha-value>)',
          950: 'hsl(var(--neutral-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};