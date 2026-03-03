import { getArticles, getAllTags } from "@/lib/mdx";
import PageClient from "./page-client";

export const metadata = {
  title: "BEROU NAM PRACI — Manga Panel Layout",
  description:
    "AI novinky ve stylu manga panelu. Generovano AI. Kazdy den.",
};

export default function Page() {
  const articles = getArticles();
  const allTags = getAllTags();
  return <PageClient articles={articles} allTags={allTags} />;
}
