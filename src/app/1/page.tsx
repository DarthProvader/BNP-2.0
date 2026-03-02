import { getArticles, getAllTags } from "@/lib/mdx";
import PageClient from "./page-client";

export const metadata = {
  title: "BEROU NÁM PRÁCI — Concrete Monolith",
  description: "AI blog v brutalistickém stylu. Generováno AI. Každý den.",
};

export default function Page() {
  const articles = getArticles();
  const allTags = getAllTags();
  return <PageClient articles={articles} allTags={allTags} />;
}
