'use client';

import { useEffect, useState } from 'react';

type Article = {
  title: string;
  author: string;
  publishedAt: string;
  description: string;
  url: string;
  source: { name: string };
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
        );
        const data = await response.json();
        if (data.articles) {
          setArticles(data.articles);
        } else {
          setError('No articles found.');
        }
      } catch (err) {
        setError('Error fetching news.');
        console.error(err);
      }
    };

    fetchNews();
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📰 Top Headlines</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-1">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-1">
              By {article.author || 'Unknown'} •{' '}
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-2">{article.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              Source: {article.source.name}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Read full article →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}