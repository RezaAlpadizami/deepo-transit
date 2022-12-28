/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primarydeepo: '#3f44c2',
        secondarydeepo: '#546ac2',
        container: '#edefff',
        processbtnfrom: '#ffa108',
        processbtnto: '#f67c08',
        thead: '#bbc9ff',
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
