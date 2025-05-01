import { NextResponse } from "next/server";

// Define types for the response structure
interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: {
    title: string;
    author: string;
    description: string;
    publishedAt: string;
    source: { name: string };
    url: string;
  }[];
}

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.error("No API key found.");
      return NextResponse.json({ error: "No API key provided" }, { status: 500 });
    }

    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=10&apiKey=${apiKey}`
    );

    if (!res.ok) {
      console.error("NewsAPI response failed:", await res.text());
      return NextResponse.json(
        { error: "Failed to fetch news from NewsAPI" },
        { status: 500 }
      );
    }

    const data: NewsAPIResponse = await res.json(); // Type the response

    const articles = data.articles.map((a) => ({
      title: a.title,
      author: a.author,
      description: a.description,
      publishedAt: a.publishedAt,
      source: { name: a.source.name },
      url: a.url,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}