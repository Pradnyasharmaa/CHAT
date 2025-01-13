/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust based on your file structure
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
      }
    },
  },
  plugins: [],
};

