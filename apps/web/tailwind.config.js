module.exports = {
  darkMode: 'media',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'primary-blue': '#005bb5',
        'primary-blue-hover': '#0047a8',
        'navbar-green': '#4caf50',
        'button-blue': '#007aff',
        'button-blue-hover': '#006ae6',
        'button-blue-active': '#005bb5',
      },
      boxShadow: {
        custom:
          '0 0 10px rgba(0, 122, 255, 0.4), 0 0 30px rgba(0, 122, 255, 0.4)',
        'custom-hover':
          '0 0 20px rgba(0,122,255,0.7), 0 0 40px rgba(0,122,255,0.7)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
      },
      animation: {
        fadeIn: 'fadeIn 2s ease-in-out',
      },
    },
  },
  plugins: [],
};
