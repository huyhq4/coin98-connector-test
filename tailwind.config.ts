import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      textPrimary: 'var(--textPrimary)',
      textSecondary: 'var(--textSecondary)',
    },
    extend: {},
  },
  plugins: [],
};
export default config;
