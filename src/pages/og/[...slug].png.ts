import type { APIContext, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '@/utils/og-image';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
};

export async function GET(ctx: APIContext) {
  const { post } = ctx.props as { post: any };
  if (!post) return new Response('Not found', { status: 404 });

  const png = await generateOgImage({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
  });

  return new Response(png, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
