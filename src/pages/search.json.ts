import { getCollection } from 'astro:content';

export async function GET() {
  const blog = await getCollection('blog', ({ data }) => !data.draft);
  const docs = await getCollection('docs', ({ data }) => !data.draft);

  const index = [
    ...blog.map((post) => ({
      type: 'blog' as const,
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      category: post.data.category,
      url: `/blog/${post.id}`,
    })),
    ...docs.map((doc) => ({
      type: 'docs' as const,
      title: doc.data.title,
      description: doc.data.description || '',
      tags: [] as string[],
      category: doc.data.section,
      url: `/docs/${doc.id}`,
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
