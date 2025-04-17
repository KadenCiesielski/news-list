"use client";

import React, { useEffect, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const saved = localStorage.getItem("savedArticles");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setArticles(parsed);
            return;
          }
        }

        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          console.error("Invalid data from API:", data);
        }
      } catch (error) {
        console.error("Failed to load articles:", error);
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
    localStorage.setItem("savedArticles", JSON.stringify(articles));
    alert("Changes saved!");
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortOption === "newest") {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else if (sortOption === "oldest") {
      return (
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
    } else if (sortOption === "source-az") {
      return a.source.name.localeCompare(b.source.name);
    } else if (sortOption === "source-za") {
      return b.source.name.localeCompare(a.source.name);
    }
    return 0;
  });

  if (loading) return <p>Loading articles...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>News Articles</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ padding: "10px", flex: 1 }}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="newest">Sort by Date (Newest)</option>
          <option value="oldest">Sort by Date (Oldest)</option>
          <option value="source-az">Sort by Source (A–Z)</option>
          <option value="source-za">Sort by Source (Z–A)</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <button
          onClick={() => {
            const confirmSave = window.confirm(
              "Are you sure you want to save your changes?"
            );
            if (confirmSave) {
              localStorage.setItem("savedArticles", JSON.stringify(articles));
              alert("Changes saved!");
            }
          }}
          style={{ padding: "10px 20px" }}
        >
          Save Changes
        </button>

        <button
          onClick={() => {
            const confirmClear = window.confirm(
              "Are you sure you want to clear all saved articles?"
            );
            if (confirmClear) {
              localStorage.removeItem("savedArticles");
              alert("Saved articles cleared!");
              window.location.reload();
            }
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
          }}
        >
          Clear Saved Articles
        </button>
      </div>

      {sortedArticles.length > 0 ? (
        sortedArticles.map((article, index) => (
          <div
            key={index}
            style={{
              marginBottom: "30px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <input
              type="text"
              value={article.title}
              onChange={(e) => updateField(index, "title", e.target.value)}
              style={{ fontSize: "18px", fontWeight: "bold", width: "100%" }}
            />
            <input
              type="text"
              value={article.author || ""}
              onChange={(e) => updateField(index, "author", e.target.value)}
              placeholder="Author"
              style={{ width: "100%", marginTop: "5px", marginBottom: "10px" }}
            />

            {/* New: Source and Date */}
            <p style={{ margin: "5px 0", color: "#555" }}>
              <strong>Source:</strong> {article.source.name || "Unknown Source"}
            </p>
            <p style={{ margin: "5px 0", color: "#555" }}>
              <strong>Published:</strong>{" "}
              {new Date(article.publishedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

            <p>{article.description}</p>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#007BFF",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              Click Here To Open The Full Article
            </a>
          </div>
        ))
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
}
