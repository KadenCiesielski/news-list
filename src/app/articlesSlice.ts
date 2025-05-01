import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("articles");
  return data ? JSON.parse(data) : null;
};

export interface Article {
  title: string;
  author: string;
  description: string;
  publishedAt: string;
  source: { name: string };
  url: string;
}

interface ArticlesState {
  articles: Article[];
}

const initialState: ArticlesState = {
  articles: [],
};

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    updateArticle: (
      state,
      action: PayloadAction<{ index: number; field: "title" | "author"; value: string }>
    ) => {
      const { index, field, value } = action.payload;
      state.articles[index][field] = value;
    },
  },
});

export const { setArticles, updateArticle } = articlesSlice.actions;
export default articlesSlice.reducer;