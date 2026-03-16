/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earthquake: {
          minor: '#4ade80',    // green for <3 magnitude
          light: '#fbbf24',    // yellow for 3-5 magnitude  
          moderate: '#f97316', // orange for 5-7 magnitude
          major: '#ef4444',    // red for >7 magnitude
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
  // Ensure Tailwind doesn't conflict with MUI
  corePlugins: {
    preflight: false,
  },
}