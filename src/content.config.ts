import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().max(100),
    description: z.string().max(200),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['tech', 'product', 'thinking', 'tutorial', 'life']).default('tech'),
    tags: z.array(z.string()).max(5).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    canonicalUrl: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    section: z.string(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
    status: z.enum(['draft', 'review', 'published', 'deprecated']).default('published'),
    sidebarLabel: z.string().optional(),
    sidebarHidden: z.boolean().default(false),
    badge: z.object({
      text: z.string(),
      variant: z.enum(['info', 'success', 'warning', 'danger']),
    }).optional(),
    tableOfContents: z.boolean().default(true),
    editUrl: z.boolean().default(true),
    prev: z.string().optional(),
    next: z.string().optional(),
  }),
});

export const collections = { blog, docs };
