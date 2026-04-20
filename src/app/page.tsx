import { getArticles, getAllTags, fetchLatestVideos } from "@/lib/mdx";
import { getHomepageYouTubeChannels } from "@/lib/config";
import { PINNED_VIDEOS } from "@/data/videos";
import PageClient from "@/components/themes/brutalist-dark/ListingPage";

export const metadata = {
  title: "BEROU NÁM PRÁCI — AI žere svět",
  description: "AI žere svět. My o tom píšeme.",
};

export default async function Home() {
  const articles = getArticles();
  const allTags = getAllTags();
  const latestVideos = await fetchLatestVideos(getHomepageYouTubeChannels(), 1);
  return (
    <PageClient
      articles={articles}
      allTags={allTags}
      basePath=""
      videos={latestVideos}
      pinnedVideos={PINNED_VIDEOS}
    />
  );
}
