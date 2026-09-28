/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hind Siliguri', 'Inter', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
      colors: {
        ink: '#1d1330',
        brand: {
          purple: '#7a2c8e',
          'purple-dark': '#5a1f68',
          red: '#e23c2e',
          amber: '#ffb400',
        },
        paper: '#faf6ef',
        line: '#e4d9c9',
      },
    },
  },
  plugins: [],
}
