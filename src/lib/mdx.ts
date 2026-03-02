import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article, Source, AIComment } from "./mockData";

const contentDir = path.join(process.cwd(), "content", "articles");

interface MDXFrontmatter {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  readTime: number;
  excerpt: string;
  sources: Source[];
  aiComments: AIComment[];
}

function readMDXFile(filePath: string): { frontmatter: MDXFrontmatter; content: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as MDXFrontmatter,
    content: content.trim(),
  };
}

function buildArticle(slug: string): Article | null {
  const csFile = path.join(contentDir, "cs", `${slug}.mdx`);
  const enFile = path.join(contentDir, "en", `${slug}.mdx`);

  let cs;
  try {
    cs = readMDXFile(csFile);
  } catch {
    return null;
  }

  let en = null;
  try {
    en = readMDXFile(enFile);
  } catch {
    // EN version is optional
  }

  return {
    slug: cs.frontmatter.slug,
    title: cs.frontmatter.title,
    titleEn: en?.frontmatter.title ?? cs.frontmatter.title,
    date: cs.frontmatter.date,
    tags: cs.frontmatter.tags,
    excerpt: cs.frontmatter.excerpt,
    excerptEn: en?.frontmatter.excerpt ?? cs.frontmatter.excerpt,
    content: cs.content,
    contentEn: en?.content ?? cs.content,
    sources: cs.frontmatter.sources ?? [],
    aiComments: cs.frontmatter.aiComments ?? [],
    readTime: cs.frontmatter.readTime,
  };
}

// Module-level cache — populated once per process (build or server start)
let _articles: Article[] | null = null;

function loadArticles(): Article[] {
  if (_articles) return _articles;
  const csDir = path.join(contentDir, "cs");
  if (!fs.existsSync(csDir)) return [];
  const slugs = fs
    .readdirSync(csDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
  _articles = slugs
    .map(buildArticle)
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return _articles;
}

export function getArticles(): Article[] {
  return loadArticles();
}

export function getArticleBySlug(slug: string): Article | null {
  return loadArticles().find((a) => a.slug === slug) ?? null;
}

export function getAllTags(): string[] {
  return [...new Set(loadArticles().flatMap((a) => a.tags))];
}

export function getArticleSlugs(): string[] {
  return loadArticles().map((a) => a.slug);
}

// Re-export types for convenience
export type { Article, Source, AIComment } from "./mockData";
