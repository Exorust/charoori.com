import fs from "fs";
import path from "path";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "posts");

export type Post = { slug: string; title: string; date: string; description: string; body: string };

// ponytail: flat "key: value" frontmatter only. Swap in gray-matter if posts need lists or nested YAML.
export function parse(raw: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  for (const line of (m?.[1] ?? "").split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: m ? m[2] : raw };
}

export function getPost(slug: string): Post {
  const { meta, body } = parse(fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8"));
  return { slug, title: meta.title ?? slug, date: meta.date ?? "", description: meta.description ?? "", body };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => getPost(f.replace(/\.md$/, "")))
    .filter((p) => p.date)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const html = (md: string) => marked.parse(md, { async: false }) as string;
