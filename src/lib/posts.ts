import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post, PostMeta, PostFrontmatter } from '@/types';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
}

/** gray-matter parses YAML dates as Date objects; convert to ISO date string */
function normaliseDate(raw: unknown): string {
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  return String(raw);
}

export function getAllPostsMeta(): PostMeta[] {
  const files = getPostFiles();

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
    const { data, content } = matter(fileContent);
    const rt = readingTime(content);

    return {
      ...(data as Omit<PostFrontmatter, 'slug' | 'date'>),
      date: normaliseDate(data.date),
      slug,
      readingTime: rt.text,
    } as PostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const rt = readingTime(content);

  return {
    frontmatter: {
      ...(data as Omit<PostFrontmatter, 'slug' | 'date'>),
      date: normaliseDate(data.date),
      slug,
    },
    content,
    readingTime: rt.text,
  };
}

export function getAllSlugs(): string[] {
  return getPostFiles().map((f) => f.replace(/\.md$/, ''));
}
