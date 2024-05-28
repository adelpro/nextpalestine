const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark-100': '#f5f6f7',
        'brand-CTA-dark-200': '#e5e7eb',
        'brand-CTA-dark-500': '#6B7280',
        'brand-CTA-dark-600': '#222222',
        'brand-CTA-blue-500': '#3B82F6',
        'brand-CTA-blue-600': '#2363eb',
        'brand-CTA-green-500': '#10B981',
        'brand-CTA-green-600': '#059669',
        'brand-CTA-red-500': '#FF4B4B',
        'brand-CTA-red-600': '#DB2727',
        'brand-success': '#4BB543',
        'brand-info': '#4D71F9',
        'brand-warning': '#FFA800',
        'brand-danger': '#FF4B4B',
      },
      fontFamily: {
        Poppins: ['Poppins, sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        opacity: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        appear: {
          from: {
            opacity: 0,
            transalte: 'transformY(4rem)',
          },
          to: {
            opacity: 1,
            translate: 'transformY(0%)',
          },
        },
      },
      animation: {
        slideIn: 'slideIn 0.2s ease-out',
        fadeIn: 'opacity 0.4s ease-out',
        slideInWithFade: 'slideIn 0.2s ease-out, opacity 0.5s ease-out',
        appear: 'appear 750ms ease-in-out ',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
};
