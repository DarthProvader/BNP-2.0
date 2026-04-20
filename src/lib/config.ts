import fs from "fs";
import path from "path";
import { parse } from "yaml";
import type { YouTubeChannel } from "./mdx";

interface ChannelConfig {
  name: string;
  slug: string;
  feed_url: string;
  tags?: string[];
  show_on_homepage?: boolean;
}

interface PipelineConfig {
  youtube: ChannelConfig[];
  podcasts: ChannelConfig[];
  blogs: ChannelConfig[];
}

let _config: PipelineConfig | null = null;

function loadConfig(): PipelineConfig {
  if (_config) return _config;
  const yamlPath = path.join(process.cwd(), "scripts", "config.yaml");
  const raw = fs.readFileSync(yamlPath, "utf-8");
  _config = parse(raw) as PipelineConfig;
  return _config;
}

export function getHomepageYouTubeChannels(): YouTubeChannel[] {
  return loadConfig()
    .youtube.filter((c) => c.show_on_homepage)
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      feedUrl: c.feed_url,
    }));
}
