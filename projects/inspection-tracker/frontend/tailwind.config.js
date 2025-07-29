/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'hebrew': ['Rubik', 'Assistant', 'Heebo', 'sans-serif'],
      },
      spacing: {
        'rtl': {
          'right': 'left',
          'left': 'right',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      addUtilities({
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
        '.text-right-rtl': {
          'text-align': 'right',
          'direction': 'rtl',
        },
        '.mr-auto-rtl': {
          'margin-right': 'auto',
          'margin-left': '0',
        },
        '.ml-auto-rtl': {
          'margin-left': 'auto', 
          'margin-right': '0',
        }
      });
    }
  ],
}