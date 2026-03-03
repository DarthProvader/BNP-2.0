import { getArticles, getAllTags } from "@/lib/mdx";
import PageClient from "@/components/themes/brutalist-dark/ListingPage";

export const metadata = {
  title: "BEROU NÁM PRÁCI — AI žere svět",
  description: "AI žere svět. My o tom píšeme.",
};

export default function Home() {
  const articles = getArticles();
  const allTags = getAllTags();
  return <PageClient articles={articles} allTags={allTags} basePath="" />;
}
