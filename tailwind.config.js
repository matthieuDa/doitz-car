/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#0F172A',
          surface: '#1E293B',
          accent: '#2563EB',
          accentGlow: '#00F0FF',
          gold: '#D4AF37',
        },
      },
      backgroundImage: {
        'radial-highlight':
          'radial-gradient(circle at center, var(--tw-gradient-stops))',
        glass:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#CBD5E1',
            h1: { color: '#F1F5F9' },
            h2: { color: '#F1F5F9' },
            h3: { color: '#E2E8F0' },
            h4: { color: '#E2E8F0' },
            strong: { color: '#F1F5F9' },
            a: { color: '#3B82F6', '&:hover': { color: '#60A5FA' } },
            blockquote: { color: '#94A3B8', borderLeftColor: '#3B82F6' },
            code: { color: '#E2E8F0', backgroundColor: '#1E293B', padding: '2px 6px', borderRadius: '4px' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            thead: { borderBottomColor: '#334155' },
            'thead th': { color: '#F1F5F9' },
            'tbody tr': { borderBottomColor: '#1E293B' },
            'tbody td': { color: '#CBD5E1' },
            hr: { borderColor: '#1E293B' },
          }
        }
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
