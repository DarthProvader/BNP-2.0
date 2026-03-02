import { getArticles, getAllTags } from "@/lib/mdx";
import PageClient from "./page-client";

export default function Home() {
  const articles = getArticles();
  const allTags = getAllTags();
  return <PageClient articles={articles} allTags={allTags} />;
}
