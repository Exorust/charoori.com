import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxOptions } from '@/lib/mdx';

interface BlogPostContentProps {
  source: string;
}

export default function BlogPostContent({ source }: BlogPostContentProps) {
  return (
    <div className="prose prose-sm max-w-none">
      <MDXRemote source={source} options={mdxOptions} />
    </div>
  );
}
