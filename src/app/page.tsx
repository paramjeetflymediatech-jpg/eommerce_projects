import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import FallbackImage from "@/components/common/FallbackImage";
import ProductCard from "@/components/products/ProductCard";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Aion Luxury — The Atelier of Modern Elegance",
  description: "Explore the Parisian Art de Vivre with Aion Luxury's curated couture and high-end ready-to-wear collections.",
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
      <style dangerouslySetInnerHTML={{
        __html: `
        body { background-color: #fff !important; }
        @media (max-width: 1024px) {
          .hero-video-grid {
            display: block !important;
          }
          .hero-video-item.hero-side-image {
            display: none !important;
          }
          .hero-video-item.hero-center-image {
            height: 100vh !important;
            width: 100% !important;
            border: none !important;
          }
          .hero-video-item.hero-center-image img {
            opacity: 0.95 !important;
          }
        }
      `}} />
      <section className="dvh-hero animate-fade" style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>

        <div className="hero-video-grid flex flex-col md:flex-row h-screen" style={{ width: "100%", overflow: "hidden" }}>
          {[
            "/1.png",
            "/2.png",
            "/3.png",
          ].map((src, i) => (
            <div key={i} 
              className={`hero-video-item relative ${i !== 1 ? 'hero-side-image' : 'hero-center-image'}`} 
              style={{
                flexBasis: i === 1 ? "100%" : "33.3333%",
                height: "100%",
                overflow: "hidden",
                background: "#000",
                zIndex: 1
              }}
            >

              {/* Image */}
              <img
                src={src}
                alt={`hero-${i}`}
                className={`w-full h-full object-cover transition-opacity duration-700 ${i === 1 ? 'opacity-95 md:opacity-50' : 'opacity-50'}`}
                style={{
                  width: "110%",
                  height: "100%",
                  position: "absolute",
                  left: "-5%",
                  top: 0,
                  display: "block",
                  transform: "scale(1.1)",
                  maxWidth: "none"
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

            </div>
          ))}
        </div>

        <div className="container-app" style={{ position: "relative", textAlign: "center", color: "#fff", zIndex: 2, padding: "0 24px" }}>
          <h1 className="animate-fade" style={{
            fontSize: "clamp(2.5rem, 12vw, 6rem)",
            marginBottom: 24,
            textTransform: "uppercase",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 0.95
          }}>
            The French <br className="show-mobile" /> Art de Vivre
          </h1>
          <p className="animate-fade" style={{
            fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginBottom: 48,
            fontWeight: 400,
            opacity: 0.8
          }}>
            Iconic Designs. Exceptional Craftsmanship. Since 1960.
          </p>
          <div className="animate-fade" style={{ animationDelay: "0.4s" }}>
            <Link href="/products" className="btn" style={{
              padding: "20px 56px",
              background: "#fff",
              color: "#000",
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              border: "none !important",
              outline: "none !important",
              boxShadow: "none !important",
              textDecoration: "none !important",
              borderRadius: 0,
              display: "inline-block"
            }}>
              SHOP COLLECTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid - Responsive Luxury */}
      {categories.length > 0 && (
        <section className="section-padding" style={{ background: "#ffffff" }}>
          <div className="container-app">
            <div className="grid-luxury">
              {categories.slice(0, 4).map((cat: any, index: number) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="hover-zoom-container" style={{ position: "relative", height: "clamp(450px, 70vh, 750px)", overflow: "hidden", textDecoration: "none" }}>
                  <FallbackImage
                    src={cat.image || `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80`}
                    alt={cat.name}
                    fill
                    className="hover-zoom"
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)", display: "flex", alignItems: "flex-end", padding: "clamp(32px, 6vw, 80px)" }}>
                    <div style={{ color: "#fff" }}>
                      <p className="text-tracked" style={{ fontSize: "0.6rem", fontWeight: 700, marginBottom: 8, opacity: 0.7 }}>Discovery</p>
                      <h3 style={{ fontSize: "1.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curated Essentials (Featured Products) */}
      {featured.length > 0 && (
        <section className="section-padding" style={{ background: "#ffffff" }}>
          <div className="container-app">
            <div style={{ textAlign: "center", marginBottom: "clamp(64px, 10vw, 100px)" }}>
              <h2 style={{ marginBottom: 16 }}>Curated Essentials</h2>
              <p className="text-tracked" style={{ fontSize: "0.7rem", color: "#888", fontWeight: 700, opacity: 0.6 }}>Exclusive Design Selections</p>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
              gap: "clamp(32px, 5vw, 64px)"
            }}>
              {featured.slice(0, 3).map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals - Seasonal Drop */}
      {newArrivals.length > 0 && (
        <section style={{ padding: "clamp(60px, 10vw, 120px) 0", background: "#ffffff", borderTop: "1px solid #eee" }}>
          <div className="container-app">
            <div style={{ textAlign: "center", marginBottom: "clamp(40px, 8vw, 80px)" }}>
              <h2 style={{ fontFamily: "Lora, serif", marginBottom: 16 }}>The New Arrivals</h2>
              <div style={{ width: 60, height: 1, background: "#000", margin: "0 auto" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "clamp(24px, 4vw, 48px)" }}>
              {newArrivals.slice(0, 4).map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
