import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/mdx";

export async function generateArticleMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — BEROU NÁM PRÁCI`,
    description: article.excerpt,
  };
}
