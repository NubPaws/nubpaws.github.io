import { defineConfig } from 'tailwindcss/helpers';
import typography from '@tailwindcss/typography';

export default defineConfig({
  content: ['./src/**/*.{astro,md,mdx,jsx,tsx,svelte,vue}'],
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        primary: ({ opacityVariable }) => `rgb(var(--tw-color-primary) / var(${opacityVariable}))`,
      },

      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: 'unset',

            '--tw-prose-body': theme('colors.zinc.900'),
            '--tw-prose-headings': theme('colors.zinc.900'),

            '--tw-prose-links': `rgb(var(--tw-color-primary) / 1)`,

            '--tw-prose-code': theme('colors.zinc.800'),

            '--tw-prose-pre-bg': theme('colors.zinc.50'),

            'h1,h2,h3,h4,h5,h6': {
              scrollMarginTop: theme('spacing.24'),
              letterSpacing: theme('letterSpacing.tight'),
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
      }),
    },
  },
});
