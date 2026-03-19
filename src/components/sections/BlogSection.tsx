import Link from 'next/link';
import SectionPrompt from '@/components/layout/SectionPrompt';
import BlogPostCard from '@/components/blog/BlogPostCard';
import type { PostMeta } from '@/types';

interface BlogSectionProps {
  posts: PostMeta[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="mb-10">
      <SectionPrompt command="ls blog/" />

      <div className="pl-4">
        {posts.length === 0 ? (
          <p className="text-[var(--color-od-muted)] text-sm">
            No posts yet. Coming soon...
          </p>
        ) : (
          <>
            {posts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
            <Link
              href="/blog"
              className="text-[var(--color-od-accent)] hover:underline text-sm mt-2 inline-block"
            >
              more...
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
