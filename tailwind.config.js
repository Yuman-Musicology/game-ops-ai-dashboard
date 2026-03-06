/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          800: '#1a1b26',
          700: '#24283b',
          600: '#2d3142',
          500: '#363b52',
        },
        accent: {
          cyan: '#7dcfff',
          green: '#9ece6a',
          red: '#f7768e',
          orange: '#ff9e64',
          purple: '#bb9af7',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
