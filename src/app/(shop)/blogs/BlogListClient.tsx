"use client";
import { useState } from "react";
import Link from "next/link";

export default function BlogListClient({ blogs }: { blogs: any[] }) {
  const [visibleCount, setVisibleCount] = useState(8);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (blogs.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
        No articles found. Please check back later.
      </div>
    );
  }

  return (
    <div>
      <div className="blog-grid">
        {blogs.slice(0, visibleCount).map((b) => (
          <Link
            key={b.id}
            href={`/blogs/${b.slug}`}
            className="blog-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <div style={{ width: "100%", height: "200px", backgroundColor: "transparent", padding: "10px" }}>
              {b.image ? (
                <img
                  src={b.image}
                  alt={b.title}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
                  No Image
                </div>
              )}
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                {new Date(b.updatedAt || b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 12px", lineHeight: 1.4, color: "#111" }}>
                {b.title}
              </h3>
              <div
                style={{
                  color: "#666",
                  lineHeight: 1.5,
                  fontSize: "0.9rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {b.content?.replace(/<[^>]+>/g, "").substring(0, 120)}...
              </div>
              <div style={{ marginTop: "16px", color: "#000", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                Read Article →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < blogs.length && (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <button
            onClick={handleViewMore}
            style={{
              padding: "14px 40px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#000")}
          >
            View More
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
        }
        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
        `
      }} />
    </div>
  );
}
