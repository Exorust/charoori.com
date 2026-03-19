import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { getAllSlugs, getPostBySlug } from '@/lib/posts';
import TerminalWindow from '@/components/layout/TerminalWindow';
import SectionPrompt from '@/components/layout/SectionPrompt';
import BlogPostContent from '@/components/blog/BlogPostContent';
import Tag from '@/components/ui/Tag';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: `${post.frontmatter.title} · charoori.com`,
      description: post.frontmatter.description,
    };
  } catch {
    return { title: 'Post not found · charoori.com' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content, readingTime } = post;
  const formattedDate = format(parseISO(frontmatter.date), 'MMMM d, yyyy');

  return (
    <TerminalWindow title={`${slug}.md — charoori.com`}>
      <div className="mb-2">
        <Link
          href="/"
          className="text-[var(--color-od-muted)] hover:text-[var(--color-od-blue)] text-xs"
        >
          ← cd ..
        </Link>
      </div>

      <SectionPrompt command={`cat blog/${slug}.md`} />

      <div className="pl-4">
        <h1 className="text-[var(--color-od-yellow)] text-xl font-bold mb-2 leading-snug">
          {frontmatter.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-xs text-[var(--color-od-muted)]">
          <span>{formattedDate}</span>
          <span>·</span>
          <span>{readingTime}</span>
        </div>

        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {frontmatter.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}

        <BlogPostContent source={content} />
      </div>
    </TerminalWindow>
  );
}
