import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shop by Category",
  description: "Browse our products by category to find exactly what you're looking for.",
};

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return { categories: [] };
    return res.json();
  } catch { return { categories: [] }; }
}

export default async function CategoriesPage() {
  const { categories } = await getCategories();

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: 16 }}>Explore Categories</h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto" }}>
          Find the perfect products for your lifestyle by browsing through our curated collections.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 32 }}>
        {categories?.map((cat: { id: number; name: string; slug: string; description?: string; image?: string }) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <div className="card h-full" style={{ padding: 0, overflow: "hidden", transition: "transform 0.3s ease" }}>
              <div style={{ position: "relative", height: 200, background: "var(--bg-elevated)" }}>
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill style={{ objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "3rem" }}>🛍️</div>
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", display: "flex", alignItems: "flex-end", padding: 24 }}>
                  <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700 }}>{cat.name}</h2>
                </div>
              </div>
              <div style={{ padding: 24 }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 16 }}>
                  {cat.description || `Browse all ${cat.name} products.`}
                </p>
                <span style={{ color: "var(--primary-light)", fontWeight: 600, fontSize: "0.9rem" }}>Explore Collection →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {categories?.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>📦</div>
          <h2 style={{ fontSize: "1.5rem" }}>No categories found</h2>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 24 }}>Browse All Products</Link>
        </div>
      )}
    </div>
  );
}
