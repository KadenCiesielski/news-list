import { configureStore } from "@reduxjs/toolkit";
import { newsService } from "@/lib/newsService";
import { saveArticleService } from "@/lib/newsService";

export const store = configureStore({
  reducer: {
    [newsService.reducerPath]: newsService.reducer,
    [saveArticleService.reducerPath]: saveArticleService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      newsService.middleware,
      saveArticleService.middleware
    ),
});