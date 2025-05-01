import { NextResponse } from "next/server";

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

interface Article {
  title: string;
  author: string;
  description: string;
  publishedAt: string;
  source: { name: string };
  url: string;
}

// In-memory storage
let savedArticles: Article[] = [];
let originalArticles: Article[] = [];

export async function GET() {
  try {
    if (savedArticles.length > 0) {
      return NextResponse.json(savedArticles);
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.error("No API key found.");
      return NextResponse.json({ error: "No API key provided" }, { status: 500 });
    }

    const res = await fetch(
      `https://newsapi.org/v2/everything?q=technology&sortBy=publishedAt&pageSize=20`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!res.ok) {
      console.error("NewsAPI response failed:", await res.text());
      return NextResponse.json({ error: "Failed to fetch news from NewsAPI" }, { status: 500 });
    }

    const data: NewsAPIResponse = await res.json();

    const articles = data.articles.map((a) => ({
      title: a.title,
      author: a.author,
      description: a.description,
      publishedAt: a.publishedAt,
      source: { name: a.source.name },
      url: a.url,
    }));

    // Save originals only once
    if (originalArticles.length === 0) {
      originalArticles = articles;
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    savedArticles = body;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Save Error:", error);
    return NextResponse.json({ error: "Failed to save articles" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Restore savedArticles from originalArticles
    savedArticles = [...originalArticles];
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Undo Error:", error);
    return NextResponse.json({ error: "Failed to undo changes" }, { status: 500 });
  }
}