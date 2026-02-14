import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        casino: {
          black: '#0a0a0a',
          darkGray: '#1a1a1a',
          gray: '#2a2a2a',
          gold: '#d4af37',
          lightGold: '#f4d03f',
          green: '#1b5e20',
          darkGreen: '#0d3818',
        },
        accent: {
          success: '#4caf50',
          error: '#f44336',
          warning: '#ff9800',
          info: '#2196f3',
        },
      },
      backgroundImage: {
        'casino-gradient':
          'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d3818 100%)',
        'light-gradient':
          'linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e8f5e9 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
        'card-gradient': 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-green': '0 0 20px rgba(27, 94, 32, 0.3)',
        card: '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
} satisfies Config;
