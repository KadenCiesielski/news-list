import { configureStore } from "@reduxjs/toolkit";
import { newsApi } from "@/lib/newsService"; // RTK Query service for API

export const store = configureStore({
  reducer: {
    [newsApi.reducerPath]: newsApi.reducer, // Integrate RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newsApi.middleware), // Add middleware for caching, refetching, etc.
});