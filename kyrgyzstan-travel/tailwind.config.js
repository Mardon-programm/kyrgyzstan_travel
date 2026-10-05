/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: '#0B0F12',
          card: '#141A21',
        },
        terracotta: '#D94E34',
        terracottaHover: '#C0422D',
        pine: '#1E3F36',
        gold: '#E5A93B',
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        'md': '12px',
      },
      boxShadow: {
        'glow-terracotta': '0 0 40px rgba(217, 78, 52, 0.3)',
        'glow-gold': '0 0 40px rgba(229, 169, 59, 0.25)',
        'inner-glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'topo-lines': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C13.431 0 0 13.431 0 30s13.431 30 30 30 30-13.431 30-30-13.431-30-30-30zm0 4c14.33 0 26 11.67 26 26S44.33 56 30 56 4 44.33 4 30 15.67 4 30 4zm0 4c11.046 0 20 8.954 20 20S41.046 50 30 50 10 41.046 10 30 18.954 10 30 10z' fill='none' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}