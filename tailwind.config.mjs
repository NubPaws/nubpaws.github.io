import { defineConfig } from 'tailwindcss/helpers';
import typography from '@tailwindcss/typography';

export default defineConfig({
  content: ['./src/**/*.{astro,md,mdx,jsx,tsx,svelte,vue}'],
  plugins: [typography],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            /* — tighter lists — */
            'ul,ol': {
              marginTop: theme('spacing.1'),
              marginBottom: theme('spacing.1'),
            },
            'ul > li + li, ol > li + li': {
              marginTop: theme('spacing.1'),
            },

            /* — blue links + no underline on hover — */
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
              },
            },

            /* — headings less bold — */
            'h1,h2,h3,h4,h5,h6': {
              scrollMarginTop: theme('spacing.24'),
              letterSpacing: theme('letterSpacing.tight'),
              fontWeight: theme('fontWeight.semibold'),
            },
            /* keep H4 & H5 fully bold */
            'h4,h5': {
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
      }),
    },
  },
});
