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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const saved = localStorage.getItem('savedArticles');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setArticles(parsed);
            return;
          }
        }

        const res = await fetch('/api/news');
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          console.error("Invalid data from API:", data);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const updateField = (index: number, field: keyof Article, value: string) => {
    const updated = [...articles];
    updated[index] = { ...updated[index], [field]: value };
    setArticles(updated);
  };

  const handleSave = () => {
    localStorage.setItem('savedArticles', JSON.stringify(articles));
    alert('Changes saved!');
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading articles...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>News Articles</h1>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />
      <button onClick={handleSave} style={{ marginBottom: '30px', padding: '10px 20px' }}>
        Save Changes
      </button>

      {filteredArticles.length > 0 ? (
        filteredArticles.map((article, index) => (
          <div
            key={index}
            style={{
              marginBottom: '30px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <input
              type="text"
              value={article.title}
              onChange={(e) => updateField(index, 'title', e.target.value)}
              style={{ fontSize: '18px', fontWeight: 'bold', width: '100%' }}
            />
            <input
              type="text"
              value={article.author || ''}
              onChange={(e) => updateField(index, 'author', e.target.value)}
              placeholder="Author"
              style={{ width: '100%', marginTop: '5px', marginBottom: '10px' }}
            />
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
}