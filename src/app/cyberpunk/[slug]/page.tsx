import React from "react";
import { getArticleBySlug, getArticleSlugs } from "@/lib/mdx";
import { notFound } from "next/navigation";
import PageClient from "./page-client";
import { generateArticleMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export const generateMetadata = generateArticleMetadata;

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <PageClient article={article} />;
}
