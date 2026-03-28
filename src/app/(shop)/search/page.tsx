import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";

interface Props { searchParams: { q?: string } }

export const metadata: Metadata = {
  title: "Search",
  description: "Search for products in our store.",
};

async function searchProducts(q: string) {
  if (!q || q.length < 2) return { results: [], query: q, count: 0 };
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/search?q=${encodeURIComponent(q)}`, { next: { revalidate: 0 } });
    if (!res.ok) return { results: [], query: q, count: 0 };
    return res.json();
  } catch { return { results: [], query: q, count: 0 }; }
}

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function SearchPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const { results, count } = await searchProducts(q);

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
          {q ? `🔍 Results for "${q}"` : "Search Products"}
        </h1>
        {q && <p style={{ color: "var(--text-secondary)" }}>{count} product{count !== 1 ? "s" : ""} found</p>}
      </div>

      {/* Search Box */}
      <form action="/search" method="GET" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", gap: 0, maxWidth: 560 }}>
          <input name="q" type="search" defaultValue={q} className="input" placeholder="Search for products..." style={{ borderRadius: "12px 0 0 12px", fontSize: "1rem" }} />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: "0 12px 12px 0", padding: "12px 24px" }}>Search</button>
        </div>
      </form>

      {q && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>No results found</h2>
          <p style={{ marginBottom: 24 }}>Try different keywords or browse our categories</p>
          <Link href="/products" className="btn btn-primary">Browse All Products</Link>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {results.map((p: { id: number; name: string; slug: string; price: number; comparePrice?: number; images: string[]; rating: number; reviewCount: number; stock: number; isFeatured?: boolean; category?: { name: string; slug: string } }) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!q && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: "1.1rem" }}>Type something to search for products</p>
        </div>
      )}
    </div>
  );
}
