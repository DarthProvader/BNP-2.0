import { getArticles, getAllTags } from "@/lib/mdx";
import PageClient from "./page-client";

export default function Page() {
  const articles = getArticles();
  const allTags = getAllTags();
  return <PageClient articles={articles} allTags={allTags} />;
}
