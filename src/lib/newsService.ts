import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsService = createApi({
  reducerPath: "newsService",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: () => "news", // this maps to /api/news
    }),
  }),
});

export const { useGetArticlesQuery } = newsService;