import type { Config } from 'tailwindcss';

/**
 * Theme tokens are driven by CSS variables (see src/styles/index.css) so
 * light/dark mode is a single `data-theme` swap. Palette per spec §19:
 * blue, light blue, green, black, white — used accessibly.
 */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'hsl(var(--brand) / <alpha-value>)',
          soft: 'hsl(var(--brand-soft) / <alpha-value>)',
          fg: 'hsl(var(--brand-fg) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          fg: 'hsl(var(--accent-fg) / <alpha-value>)',
        },
        bg: 'hsl(var(--bg) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-2': 'hsl(var(--surface-2) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        fg: 'hsl(var(--fg) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        danger: 'hsl(var(--danger) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 hsl(var(--fg) / 0.04), 0 8px 24px -12px hsl(var(--fg) / 0.12)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config;
