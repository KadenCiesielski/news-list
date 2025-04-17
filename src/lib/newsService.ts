import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export async function fetchTopHeadlines(
  query = "technology"
): Promise<Article[]> {
  const res = await fetch(
    `${API_BASE}/top-headlines?q=${encodeURIComponent(
      query
    )}&language=en&pageSize=20`,
    {
      headers: {
        "X-Api-Key": process.env.NEWS_API_KEY!,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch news:", res.statusText);
    throw new Error("Failed to fetch news");
  }

  const data = await res.json();
  return data.articles as Article[];
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      headers.set("X-Api-Key", process.env.NEWS_API_KEY!); // Add the API key header
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getArticles: builder.query<Article[], string>({
      query: (query) => `/top-headlines?q=${query}&language=en&pageSize=20`,
    }),
    saveArticles: builder.mutation<void, Article[]>({
      query: (articles) => ({
        url: "/save-articles", // Define backend endpoint here
        method: "POST",
        body: articles,
      }),
    }),
  }),
});

export const { useGetArticlesQuery, useSaveArticlesMutation } = newsApi;
