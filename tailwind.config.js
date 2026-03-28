/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        ink: '#081225',
        mist: '#eef4ff',
        steel: '#59708f',
        accent: '#0f9d8f',
        ember: '#ff7a59',
        signal: '#2563eb',
      },
      boxShadow: {
        panel: '0 24px 60px rgba(8, 18, 37, 0.12)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(15, 157, 143, 0.20), transparent 28%), linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f5fbf9 100%)',
      },
    },
  },
  plugins: [],
};
