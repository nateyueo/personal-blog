import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: process.env.SITE_URL || 'https://personal-blog.pages.dev',
  output: 'static',

  integrations: [
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      styleOverrides: {
        borderRadius: '0.5rem',
        codeFontFamily: '"JetBrains Mono", "Fira Code", monospace',
        codeFontSize: '0.875rem',
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft'),
    }),
    robotsTxt({
      policy: [
        { userAgent: '*', allow: '/', disallow: ['/draft/', '/admin/'] },
      ],
      sitemap: true,
    }),
  ],

  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  image: {
    domains: [],
  },
});
