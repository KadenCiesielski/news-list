import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY;

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

    const data = await res.json();

    const articles = data.articles.map((a: any) => ({
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