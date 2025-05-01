"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setArticles, updateArticle } from "@/app/articlesSlice";

export default function Page() {
  const dispatch = useDispatch();
  const articles = useSelector((state: RootState) => state.articles.articles);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        dispatch(setArticles(data));
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [dispatch]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articles),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Articles saved!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(filter.toLowerCase()) ||
      a.author?.toLowerCase().includes(filter.toLowerCase())
  );

  
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">News List</h1>

      <input
        className="p-2 border w-full mb-4"
        type="text"
        placeholder="Filter by title or author..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {filteredArticles.map((article, idx) => (
            <div key={idx} className="border rounded-xl p-4 shadow">
              <div className="mb-2">
                <label className="block text-sm font-medium">Title</label>
                <input
                  className="p-2 border w-full"
                  value={article.title}
                  onChange={(e) =>
                    dispatch(updateArticle({ index: idx, field: "title", value: e.target.value }))
                  }
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Author</label>
                <input
                  className="p-2 border w-full"
                  value={article.author || ""}
                  onChange={(e) =>
                    dispatch(updateArticle({ index: idx, field: "author", value: e.target.value }))
                  }
                />
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Published: {new Date(article.publishedAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm"
              >
                Read full article
              </a>
            </div>
          ))}
        </div>
      )}

      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </main>
  );
}