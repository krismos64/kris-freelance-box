/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#f4f7f9',
          text: {
            primary: '#2c3e50',
            secondary: 'rgba(44, 62, 80, 0.7)'
          },
          primary: '#2563eb',
          secondary: '#3b82f6',
          accent: '#16a34a'
        },
        dark: {
          background: '#0f172a',
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)'
          },
          primary: '#3b82f6',
          secondary: '#60a5fa',
          accent: '#22c55e'
        }
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(135deg, #e0e7ff 0%, #f0f5ff 25%, #3b82f6 75%, #60a5fa 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #3b82f6 75%, #60a5fa 100%)'
      }
    },
  },
  plugins: [],
}
