import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ShopNest — The Atelier of Modern Elegance",
  description: "Explore the Parisian Art de Vivre with ShopNest's curated couture and high-end ready-to-wear collections.",
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
            width: 100% !important;
            left: 0 !important;
            transform: scale(1) !important;
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
          <div className="animate-fade" style={{ animationDelay: "0.4s" }}>
            <Link href="/products" className="btn" style={{
              padding: "16px 48px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontSize: "0.85rem",
              letterSpacing: "normal",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              outline: "none",
              boxShadow: "none",
              textDecoration: "none",
              opacity: 0.9,
              borderRadius: 0,
              display: "inline-block"
            }}>
              Shop Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid - Responsive Luxury */}
      {categories.length > 0 && (
        <section className="section-padding" style={{ background: "#ffffff" }}>
          <div className="container-app">
            <div className="grid-luxury">
              {categories.map((cat: any, index: number) => (
                <Link key={cat.id} href={`/products?category=${cat.id}`} className="hover-zoom-container" style={{ position: "relative", height: "clamp(450px, 70vh, 750px)", overflow: "hidden", textDecoration: "none" }}>
                  <Image
                    src={cat.image || ``}
                    alt={cat.name}
                    fill
                    className="hover-zoom"
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)", display: "flex", alignItems: "flex-end", padding: "clamp(32px, 6vw, 80px)" }}>
                    <div style={{ color: "#fff" }}>
                      <p className="text-tracked" style={{ fontSize: "0.6rem", fontWeight: 700, marginBottom: 8, opacity: 0.7 }}>Discovery</p>
                      <h3 style={{ fontSize: "1.8rem", letterSpacing: "normal" }}>{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story: Art de Vivre */}
      <section className="section-padding">
        <div className="container-app">
          <div className="grid-editorial-2">
            <div style={{ animation: "fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1)", width: "100%" }}>
              <Image
                src="/images/fashion/coats.png"
                alt="Luxury Fashion"
                width={800}
                height={1000}
                style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div style={{ padding: "0 4px" }}>
              <p className="text-tracked" style={{ fontSize: "0.65rem", color: "#888", marginBottom: 16, fontWeight: 700 }}>Heritage & Craft</p>
              <h2 style={{ marginBottom: 24, lineHeight: 1.1, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Sophistication In Every Detail.</h2>
              <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: 1.6, marginBottom: 32, fontWeight: 400, maxWidth: "540px" }}>
                Crafted with an uncompromising attention to detail, each garment reflects a dedication to precision, balance, and material integrity. Premium natural fibres are carefully selected to enhance both structure and comfort, allowing each piece to move effortlessly while maintaining its form. This commitment to quality extends beyond construction, creating a wardrobe that feels enduring rather than seasonal.

Rooted in heritage yet forward in perspective, ShopNest continues to refine the language of modern dressing—where subtle innovation meets timeless design. The result is a collection that speaks quietly but confidently, offering a refined expression of luxury that evolves with time while remaining unmistakably its own.
              </p>
              <Link href="/about" className="btn btn-secondary" style={{ padding: "14px 40px" }}>
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* French Art de Vivre - Triple Lifestyle Grid */}
      <section className="section-padding" style={{ background: "#ffffff", paddingBottom: "clamp(60px, 8vw, 100px)" }}>
        <div className="container-app">
          <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
            <p className="text-tracked" style={{ fontSize: "0.7rem", color: "#888", marginBottom: 16, fontWeight: 700 }}>Life in Style</p>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, marginBottom: 24 }}>L'Art de Vivre.</h2>
            <p style={{ fontSize: "0.95rem", color: "#666", maxWidth: 640, margin: "0 auto", fontWeight: 400 }}>
              A curated curation of the timeless Parisian lifestyle. Explore our heritage of elegance and impeccable taste.
            </p>
          </div>

          <div className="grid-editorial-3">
            <div className="editorial-item hover-zoom-container">
              <Image
                src="/images/lifestyle/0C8A8609.jpg"
                alt="Parisian Style"
                fill
                className="hover-zoom"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {/* <div style={{ position: "absolute", bottom: 32, left: 32, color: "#fff", zIndex: 2 }}>
                <p className="text-tracked" style={{ fontSize: "0.85rem", fontWeight: 800 }}>01 / The Silhouette</p>
              </div> */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)" }} />
            </div>

            <div className="editorial-item tall hover-zoom-container" style={{ zIndex: 10 }}>
              <Image
                src="/images/lifestyle/0C8A8580.jpg"
                alt="The Atelier Interior"
                fill
                className="hover-zoom"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {/* <div style={{ position: "absolute", bottom: 32, left: 32, color: "#fff", zIndex: 2 }}>
                <p className="text-tracked" style={{ fontSize: "0.85rem", fontWeight: 800 }}>02 / The Archive</p>
              </div> */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)" }} />
            </div>

            <div className="editorial-item hover-zoom-container">
              <Image
                src="/images/lifestyle/0C8A8679.jpg"
                alt="Artisanal Detail"
                fill
                className="hover-zoom"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {/* <div style={{ position: "absolute", bottom: 32, left: 32, color: "#fff", zIndex: 2 }}>
                <p className="text-tracked" style={{ fontSize: "0.85rem", fontWeight: 800 }}>03 / The Craft</p>
              </div> */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      {featured.length > 0 && (
        <section className="section-padding" style={{ background: "#ffffff" }}>
          <div className="container-app">
            <div style={{ textAlign: "center", marginBottom: "clamp(64px, 10vw, 100px)" }}>
              <h2 style={{ marginBottom: 16 }}>Curated Essentials</h2>
              <p className="text-tracked" style={{ fontSize: "0.7rem", color: "#888", fontWeight: 700, opacity: 0.6 }}>Exclusive Design Selections</p>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
              gap: "clamp(32px, 5vw, 64px)"
            }}>
              {featured.slice(0, 4).map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals - Seasonal Drop */}
      {newArrivals.length > 0 && (
        <section style={{ padding: "clamp(30px, 5vw, 60px) 0", background: "#ffffff", borderTop: "1px solid #eee" }}>
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

      {/* Services/Features - Minimalist */}
      {/* <section style={{ padding: "clamp(80px, 12vw, 140px) 0", background: "#000", color: "#fff" }}>
        <div className="container-app">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "clamp(48px, 6vw, 80px)" }}>
            {[
              { title: "Complimentary Delivery", desc: "Expert handling for your items" },
              { title: "Personalised Service", desc: "Dedicated advisors at your choice" },
              { title: "Secure Transactions", desc: "Certified payment security" },
              { title: "Worldwide Network", desc: "Present in over 50 countries" },
            ].map(({ title, desc }) => (
              <div key={title} style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, color: "#fff" }}>{title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#999", fontWeight: 400, maxWidth: "240px", margin: "0 auto" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Unique Feature: The Editorial Lookbook */}
      <section className="section-padding">
        <div className="container-app">
          <div className="grid-editorial-2">
            <div style={{ position: "relative" }}>
              <div style={{ position: "relative", height: "clamp(400px, 80vh, 750px)", width: "100%", zIndex: 2 }}>
                <Image
                  src="/images/fashion/hero.png"
                  alt="Lookbook 01"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div style={{ paddingRight: "4vw" }}>
              <p className="text-tracked" style={{ fontSize: "0.75rem", color: "#888", marginBottom: 24, fontWeight: 700 }}>Exclusive Lookbook</p>
              <h2 style={{ fontSize: "clamp(3rem, 8vw, 5rem)", lineHeight: 0.9, marginBottom: 32, letterSpacing: "-0.04em" }}>
                The Silhouette of Decembre
              </h2>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#444", marginBottom: 40, fontWeight: 300, maxWidth: "440px" }}>
                A curated selection of archival pieces and new-season ready-to-wear, thoughtfully brought together to reflect a balance of heritage and modernity. Each design is defined by architectural tailoring, where precise structure meets fluid form, creating silhouettes that feel both intentional and effortless. Crafted from premium natural fibres, the collection emphasizes quality, comfort, and longevity, offering timeless pieces that evolve with the wearer while maintaining a distinct, refined identity.              </p>
              <Link href="/products" style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "normal",
                color: "#000",
                textDecoration: "underline",
                textUnderlineOffset: "8px"
              }}>
                Explore the Lookbook
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Collections Gallery - Fashion Pivot */}
      <section className="section-padding" style={{ background: "#ffffff" }}>
        <div className="container-app">
          <div style={{ textAlign: "left", marginBottom: 64 }}>
            <p className="text-tracked" style={{ fontSize: "0.75rem", color: "#888", marginBottom: 16 }}>The Atelier</p>
            <h2>Collection Pillars.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 16 }}>
            <div style={{ position: "relative", height: 600 }}>
              <Image src="/images/categories/coats.png" alt="Outerwear" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
              <div style={{ position: "absolute", bottom: 40, left: 40, color: "#fff" }}>
                <p className="text-tracked" style={{ fontSize: "0.85rem", fontWeight: 700 }}>01 / Architectural Outerwear</p>
              </div>
            </div>
            <div style={{ position: "relative", height: 600 }}>
              <Image src="/images/fashion/accessories.png" alt="Accessories" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
              <div style={{ position: "absolute", bottom: 40, left: 40, color: "#fff" }}>
                <p className="text-tracked" style={{ fontSize: "0.85rem", fontWeight: 700 }}>02 / Curated Accessories</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
