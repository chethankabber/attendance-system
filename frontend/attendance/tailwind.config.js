/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#06b6d4',      // Cyan/Light Blue
        'secondary': '#0891b2',    // Dark Teal
        'dark': '#1f2937',         // Dark Gray
        'darker': '#111827',       // Black/Darker Gray
        'accent': '#22d3ee',       // Lighter Cyan
      }
    },
  },
  plugins: [],
}