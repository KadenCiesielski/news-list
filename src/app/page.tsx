"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setArticles, updateArticle } from "@/app/articlesSlice";

const ARTICLES_PER_PAGE = 5;

type SortOption =
  | "date_desc"
  | "date_asc"
  | "title_asc"
  | "title_desc"
  | "author_asc"
  | "author_desc"
  | "source_asc"
  | "source_desc";

export default function Page() {
  const dispatch = useDispatch();
  const articles = useSelector((state: RootState) => state.articles.articles);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<SortOption>("date_desc");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        dispatch(setArticles(data));
        localStorage.setItem("originalArticles", JSON.stringify(data));
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
      localStorage.setItem("savedArticles", JSON.stringify(articles));
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

  const handleUndo = async () => {
    try {
      const res = await fetch("/api/news", { method: "DELETE" });
      if (res.ok) {
        localStorage.removeItem("savedArticles");
        location.reload();
      } else {
        alert("Failed to undo changes.");
      }
    } catch (err) {
      console.error("Undo error:", err);
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(filter.toLowerCase()) ||
      a.author?.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const getString = (value?: string | null) => (value || "").toLowerCase();
    switch (sort) {
      case "date_desc":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case "date_asc":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case "title_asc":
        return getString(a.title).localeCompare(getString(b.title));
      case "title_desc":
        return getString(b.title).localeCompare(getString(a.title));
      case "author_asc":
        return getString(a.author).localeCompare(getString(b.author));
      case "author_desc":
        return getString(b.author).localeCompare(getString(a.author));
      case "source_asc":
        return getString(a.source?.name).localeCompare(getString(b.source?.name));
      case "source_desc":
        return getString(b.source?.name).localeCompare(getString(a.source?.name));
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedArticles.length / ARTICLES_PER_PAGE);
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = sortedArticles.slice(startIdx, startIdx + ARTICLES_PER_PAGE);

  return (
    <main className="p-4 max-w-4xl mx-auto relative" style={{ fontSize: "1.12rem" }}>
      <h1 className="text-2xl font-bold mb-4">News List</h1>

      {/* Search and Sort */}
      <div className="flex justify-between items-center gap-4 mb-4 flex-wrap">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="p-2 border w-72"
            type="text"
            placeholder="Filter by title or author..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="p-2 border w-64"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="date_desc">Sort by Date (New to Old)</option>
            <option value="date_asc">Sort by Date (Old to New)</option>
            <option value="title_asc">Sort by Title (A–Z)</option>
            <option value="title_desc">Sort by Title (Z–A)</option>
            <option value="author_asc">Sort by Author (A–Z)</option>
            <option value="author_desc">Sort by Author (Z–A)</option>
            <option value="source_asc">Sort by Source (A–Z)</option>
            <option value="source_desc">Sort by Source (Z–A)</option>
          </select>
        </div>

        {/* Save/Undo Buttons */}
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleUndo}
          >
            Undo Saved Changes
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {paginatedArticles.map((article, idx) => {
            const actualIndex = startIdx + idx;
            return (
              <div key={actualIndex} className="border rounded-xl p-4 shadow space-y-2">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1"><b>Title</b></label>
                  <input
                    className="p-2 border w-full font-bold text-3xl"
                    value={article.title}
                    onChange={(e) =>
                      dispatch(updateArticle({ index: actualIndex, field: "title", value: e.target.value }))
                    }
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium mb-1"><b>Author</b></label>
                  <input
                    className="p-2 border w-full italic text-xl"
                    value={article.author || ""}
                    onChange={(e) =>
                      dispatch(updateArticle({ index: actualIndex, field: "author", value: e.target.value }))
                    }
                  />
                </div>

                {/* Publish Date */}
                <p className="underline text-2xl text-gray-600">
                  Published: {new Date(article.publishedAt).toLocaleString()}
                </p>

                {/* Description */}
                <p className="text-2xl text-gray-700">{article.description}</p>

                {/* Link */}
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

                {/* Source */}
                <p className="text-gray-500 italic text-sm">Source: {article.source?.name}</p>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}