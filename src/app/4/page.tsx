import { getArticles, getAllTags } from "@/lib/mdx";
import PageClient from "./page-client";

export const metadata = {
  title: "BEROU NAM PRACI — DIVISION OF AI INTELLIGENCE",
  description:
    "CLASSIFIED. Division of AI Intelligence briefing. Distribution limited.",
};

export default function Page() {
  const articles = getArticles();
  const allTags = getAllTags();
  return <PageClient articles={articles} allTags={allTags} />;
}
