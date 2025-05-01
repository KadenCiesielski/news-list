import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=10&apiKey=${apiKey}`
    );

    if (!res.ok) {
      console.error("NewsAPI error:", await res.text());
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
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
    console.error("GET /api/news error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("newsdb");
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await db.collection("articles").deleteMany({});
    await db.collection("articles").insertMany(body);

    return NextResponse.json({ message: "Articles saved" });
  } catch (error) {
    console.error("POST /api/news error:", error);
    return NextResponse.json({ error: "Failed to save articles" }, { status: 500 });
  }
}