const API_BASE = "https://newsapi.org/v2";

export interface Article {
  title: string;
  author: string;
  publishedAt: string;
  description: string;
  source: {
    name: string;
  };
  url: string;
  urlToImage?: string;
}

export async function fetchTopHeadlines(query = "technology"): Promise<Article[]> {
  const res = await fetch(`${API_BASE}/top-headlines?q=${encodeURIComponent(query)}&language=en&pageSize=20`, {
    headers: {
      "X-Api-Key": process.env.NEWS_API_KEY!,
    },
    next: { revalidate: 3600 }, 
  });

  if (!res.ok) {
    console.error("Failed to fetch news:", res.statusText);
    throw new Error("Failed to fetch news");
  }

  const data = await res.json();
  return data.articles as Article[];
}