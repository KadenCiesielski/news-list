'use client';

import React, { useEffect, useState } from 'react';

type Article = {
  title: string;
  author: string;
  publishedAt: string;
  description: string;
  source: { name: string };
  url: string;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setArticles(data.articles);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const updateField = (
    index: number,
    field: keyof Article,
    value: string
  ) => {
    const updated = [...articles];
    updated[index] = { ...updated[index], [field]: value };
    setArticles(updated);
  };

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Top Headlines</h1>
      {articles.map((article, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-4 mb-6 space-y-2 border border-gray-200"
        >
          <div>
            <label className="text-sm text-gray-600">Title:</label>
            <input
              className="w-full border px-2 py-1 rounded mt-1"
              value={article.title}
              onChange={(e) =>
                updateField(index, 'title', e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Byline / Author:</label>
            <input
              className="w-full border px-2 py-1 rounded mt-1"
              value={article.author || ''}
              onChange={(e) =>
                updateField(index, 'author', e.target.value)
              }
            />
          </div>

          <p className="text-sm text-gray-500">
            Published: {new Date(article.publishedAt).toLocaleString()}
          </p>

          <p className="text-gray-700">{article.description}</p>

          <p className="text-sm">
            Source: <strong>{article.source.name}</strong>
          </p>

          <a
            href={article.url}
            target="_blank"
            className="text-blue-600 underline text-sm"
            rel="noopener noreferrer"
          >
            Read full article →
          </a>
        </div>
      ))}
    </div>
  );
}