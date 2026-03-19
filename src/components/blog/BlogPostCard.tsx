import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import Tag from '@/components/ui/Tag';
import type { PostMeta } from '@/types';

interface BlogPostCardProps {
  post: PostMeta;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = format(parseISO(post.date), 'yyyy-MM-dd');

  return (
    <div className="py-3 border-b border-[var(--color-od-border)] last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[var(--color-od-muted)] text-xs shrink-0">
          {formattedDate}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="text-[var(--color-od-blue)] hover:text-[var(--color-od-cyan)] text-sm font-medium"
        >
          {post.title}
        </Link>
        <span className="text-[var(--color-od-muted)] text-xs">
          · {post.readingTime}
        </span>
      </div>

      {post.description && (
        <p className="mt-1 text-[var(--color-od-fg)] text-xs leading-relaxed pl-0">
          {post.description}
        </p>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
