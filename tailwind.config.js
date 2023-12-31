/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    backgroundSize: {
      '300%': '300%',
      '400%': '400%',
    },
    extend: {
      backgroundImage: {
        hero: "url('/src/assets/images/bg-wave.svg')",
        'hero-content': "url('/src/assets/images/bg-content-wave-4.svg')",
      },
      boxShadow: {
        custom: '4px 4px 2px 1px rgba(0, 0, 255, .2)',
        hover: '-12px 12px 2px -1px rgba(0, 0, 255, .2)',
      },
      animation: {
        ani: 'ani 8s linear infinite',
        border: 'none',
      },
      keyframes: {
        ani: {
          '0%': { backgroundPosition: '0%' },
          '100%': { backgroundPosition: '400%' },
        },
      },
      colors: {
        primarydeepo: '#57cc99',
        secondarydeepo: '#57cc99',
        container: '#edefff',
        processbtnfrom: '#ffa108',
        processbtnto: '#f67c08',
        borders: 'rgba(0, 0, 255, .2)',
        thead: '#F3F4F5',
        slate: {
          850: '#172030',
        },
      },
      transitionProperty: {
        height: 'height',
        width: 'width',
        display: 'display',
        spacing: 'margin, padding',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });
    }),
  ],
};
