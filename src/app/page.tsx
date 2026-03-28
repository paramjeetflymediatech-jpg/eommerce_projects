import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ShopNest — Premium Online Store",
  description: "Discover thousands of premium products at unbeatable prices. Fast shipping, easy returns, and exceptional quality.",
};

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?featured=true&limit=8`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch { return []; }
}

async function getNewArrivals() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?sort=createdAt_desc&limit=4`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [featured, categories, newArrivals] = await Promise.all([getFeaturedProducts(), getCategories(), getNewArrivals()]);

  return (
    <>
      <OrganizationJsonLd />

      {/* Hero */}
      <section style={{ background: "var(--gradient-hero)", padding: "100px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(244,63,94,0.1) 0%, transparent 70%)" }} />
        <div className="container-app" style={{ position: "relative", textAlign: "center" }}>
          <div className="badge badge-primary" style={{ marginBottom: 24, fontSize: "0.85rem", padding: "6px 16px" }}>
            ✨ New Arrivals Every Week
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, background: "linear-gradient(135deg, #fff 30%, var(--primary-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Discover Premium<br />Products for Every Need
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Shop thousands of curated products with fast shipping, easy returns, and unbeatable prices.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop Now →
            </Link>
            <Link href="/categories" className="btn btn-secondary btn-lg">
              Browse Categories
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {[["50K+", "Products"], ["99K+", "Happy Customers"], ["4.9★", "Average Rating"], ["24h", "Fast Shipping"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-light)" }}>{val}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container-app">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: "2.5rem", marginBottom: 12 }}>Shop by Category</h2>
              <p style={{ color: "var(--text-secondary)" }}>Find exactly what you're looking for</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 20 }}>
              {categories.slice(0, 8).map((cat: { id: number; name: string; slug: string; image?: string }) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ padding: 24, textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} width={60} height={60} style={{ borderRadius: 12, objectFit: "cover" }} />
                      ) : "🛍️"}
                    </div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section" style={{ background: "var(--bg-card)" }}>
          <div className="container-app">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <div>
                <h2 style={{ fontSize: "2rem", marginBottom: 8 }}>⭐ Featured Products</h2>
                <p style={{ color: "var(--text-secondary)" }}>Handpicked products just for you</p>
              </div>
              <Link href="/products?featured=true" className="btn btn-secondary btn-sm">View All →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
              {featured.map((p: { id: number; name: string; slug: string; price: number; comparePrice?: number; images: string[]; rating: number; reviewCount: number; stock: number; isFeatured?: boolean; category?: { name: string; slug: string } }) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="section">
        <div className="container-app">
          <div style={{
            background: "var(--gradient-primary)", borderRadius: 24, padding: "64px 48px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: -40, top: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div>
              <p className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: 16 }}>🔥 Limited Time</p>
              <h2 style={{ fontSize: "2.5rem", color: "white", marginBottom: 12 }}>Up to 50% Off</h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}>On selected products this week only</p>
            </div>
            <Link href="/products?sale=true" className="btn" style={{ background: "white", color: "var(--primary-dark)", padding: "16px 36px", borderRadius: 14, fontWeight: 700, fontSize: "1rem" }}>
              Shop Sale →
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container-app">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <div>
                <h2 style={{ fontSize: "2rem", marginBottom: 8 }}>🆕 New Arrivals</h2>
                <p style={{ color: "var(--text-secondary)" }}>Fresh products added this week</p>
              </div>
              <Link href="/products?sort=createdAt_desc" className="btn btn-secondary btn-sm">View All →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
              {newArrivals.map((p: { id: number; name: string; slug: string; price: number; comparePrice?: number; images: string[]; rating: number; reviewCount: number; stock: number; isFeatured?: boolean; category?: { name: string; slug: string } }) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section" style={{ background: "var(--bg-card)" }}>
        <div className="container-app">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {[
              { icon: "🚚", title: "Free Shipping", desc: "On all orders over $50" },
              { icon: "🔄", title: "Easy Returns", desc: "30-day hassle-free returns" },
              { icon: "🔒", title: "Secure Payment", desc: "256-bit SSL encryption" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help you" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ textAlign: "center", padding: 32 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>{title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
