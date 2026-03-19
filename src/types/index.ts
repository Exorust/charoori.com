export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export interface PostMeta extends PostFrontmatter {
  readingTime: string;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  status: 'active' | 'wip' | 'archived';
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;
  description?: string;
  techStack?: string[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface AboutData {
  name: string;
  headline: string;
  bio: string[];
  links: SocialLink[];
}
