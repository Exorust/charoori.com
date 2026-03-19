import Link from 'next/link';
import TerminalWindow from '@/components/layout/TerminalWindow';
import SectionPrompt from '@/components/layout/SectionPrompt';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { getAllPostsMeta } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <TerminalWindow>
      <section>
        <div className="mb-4">
          <Link
            href="/"
            className="text-[var(--color-od-accent)] hover:underline text-sm"
          >
            ← back to home
          </Link>
        </div>
        <SectionPrompt command="ls blog/" />

        <div className="pl-4">
          {posts.length === 0 ? (
            <p className="text-[var(--color-od-muted)] text-sm">
              No posts yet. Coming soon...
            </p>
          ) : (
            posts.map((post) => <BlogPostCard key={post.slug} post={post} />)
          )}
        </div>
      </section>
    </TerminalWindow>
  );
}
