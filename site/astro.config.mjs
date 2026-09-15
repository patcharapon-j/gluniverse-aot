// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  // Astro 7 defaults to JSX whitespace rules, which drop the space between a
  // line of text and a following tag. The manual's prose relies on HTML rules.
  compressHTML: true,
  integrations: [mdx(), icon()],
  vite: {
    server: {
      // The Compendium reads the shared tables one level above the site.
      fs: { allow: ['..'] },
    },
  },
});
