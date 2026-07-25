import type { Metadata } from 'next';
import BlogDetailClient from './BlogDetailClient';

const API_BASE = 'https://aajtechtrading.in/api';

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) return {};

  try {
    const res = await fetch(`${API_BASE}/blogs/${id}`, { cache: 'no-store' });
    if (!res.ok) return {};
    const post = await res.json();

    const title = `${post.title} | AAJ TECH TRADING`;
    const description = post.excerpt || `Read the latest article "${post.title}" on AAJ TECH TRADING.`;
    const imageUrl = post.image || "https://aajtechtrading.in/logo.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `https://aajtechtrading.in/blog/${id}`,
        siteName: 'AAJ TECH TRADING CORPORATION',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    console.error("Failed to generate blog metadata", err);
    return {};
  }
}

export default async function BlogDetailsPage({ params }: BlogPageProps) {
  const { id } = await params;
  return <BlogDetailClient id={id} />;
}
