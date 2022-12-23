/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primarydeepo: '#184D47',
        secondarydeepo: '#2C7873',
        container: '#F3F3F3',
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
