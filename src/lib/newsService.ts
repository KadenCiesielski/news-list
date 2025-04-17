import {
  createApi,
  fetchBaseQuery,
  fakeBaseQuery,
} from "@reduxjs/toolkit/query/react";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export const newsService = createApi({
  reducerPath: "newsService",
  baseQuery: fetchBaseQuery({ baseUrl: "https://newsapi.org/v2/" }),
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: (topic: string) =>
        `top-headlines?country=us&category=${topic}&pageSize=10&apiKey=${NEWS_API_KEY}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => response.articles,
    }),
  }),
});

export const saveArticleService = createApi({
  reducerPath: "saveArticleService",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    saveArticles: builder.mutation({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryFn: async (articles: any) => {
        try {
          localStorage.setItem("news-articles", JSON.stringify(articles));
          return { data: articles };
        } catch (err) {
          return { error: { status: 500, data: err } };
        }
      },
    }),
  }),
});

export const { useGetArticlesQuery } = newsService;
export const { useSaveArticlesMutation } = saveArticleService;
