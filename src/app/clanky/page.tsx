import { getArticles, getAllTags } from "@/lib/mdx";
import AllArticlesPage from "@/components/themes/brutalist-dark/AllArticlesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Všechny články — BEROU NÁM PRÁCI",
  description: "Kompletní seznam všech článků o umělé inteligenci.",
};

export default function Page() {
  const articles = getArticles();
  const allTags = getAllTags();
  return <AllArticlesPage articles={articles} allTags={allTags} />;
}
