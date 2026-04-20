import type { YouTubeVideo } from "@/lib/mdx";

// Ručně kurátorovaný seznam — evergreen obsah, návody, základy.
// Zobrazuje se v sekci "Vybraná videa" nad live RSS feedem.
export const PINNED_VIDEOS: YouTubeVideo[] = [
  {
    title: "AI jednoduše: Jak s ní pracovat lépe než 90 % lidí?",
    url: "https://www.youtube.com/watch?v=YEytocL25Kk",
    published: "2025-11-21T00:00:00Z",
    author: "David Grudl",
    thumbnail: "https://img.youtube.com/vi/YEytocL25Kk/mqdefault.jpg",
  },
  {
    title: "Deep Dive into LLMs like ChatGPT",
    url: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
    published: "2025-02-17T00:00:00Z",
    author: "Andrej Karpathy",
    thumbnail: "https://img.youtube.com/vi/7xTGNNLPyMI/mqdefault.jpg",
  },
  {
    title: "co dělá umělá inteligence s naším mozkem?",
    url: "https://www.youtube.com/watch?v=kOWVJWMwKDo",
    published: "",
    author: "segment",
    thumbnail: "https://img.youtube.com/vi/kOWVJWMwKDo/mqdefault.jpg",
  },
];
