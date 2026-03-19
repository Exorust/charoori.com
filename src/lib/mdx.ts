import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPlugin = any;

const prettyCodeOptions: PrettyCodeOptions = {
  theme: 'one-dark-pro',
  keepBackground: true,
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
};

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm] as AnyPlugin[],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor'],
            ariaHidden: true,
            tabIndex: -1,
          },
        },
      ],
    ] as AnyPlugin[],
  },
};
