import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = "newsdb";
const collectionName = "articles";

let cachedClient: MongoClient | null = null;

async function getCollection() {
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  const db = cachedClient.db(dbName);
  return db.collection(collectionName);
}

export async function GET() {
  try {
    const collection = await getCollection();
    const savedArticles = await collection.find({}).toArray();

    if (savedArticles.length > 0) {
      return NextResponse.json(savedArticles);
    }

    const apiKey = process.env.NEWS_API_KEY;
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=10&apiKey=${apiKey}`
    );

    if (!res.ok) {
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
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const collection = await getCollection();
    const newArticles = await req.json();

    await collection.deleteMany({});
    await collection.insertMany(newArticles);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to save articles" }, { status: 500 });
  }
}