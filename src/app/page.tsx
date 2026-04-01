import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ShopNest — Premium Online Store",
  description: "Experience the French Art de Vivre with ShopNest's curated luxury furniture and decor collections.",
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
      <section className="dvh-hero" style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
        {/* Responsive Horizontal/Vertical Video Grid */}
        <div className="hero-video-grid">
          {[
            "/12766274_2160_3840_30fps.mp4",
            "/14807010_3840_2160_25fps.mp4",
            "/15483565_2160_3840_60fps.mp4"
          ].map((src, i) => (
            <div key={i} className="hero-video-item">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="video-background"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
              >
                <source src={src} type="video/mp4" />
              </video>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
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
            <Link href="/products" className="btn btn-primary" style={{ 
              padding: "20px 56px", 
              background: "#fff", 
              color: "#000",
              fontSize: "0.7rem",
              letterSpacing: "0.25em"
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
                  <Image 
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

      {/* Brand Story: Art de Vivre */}
      <section className="section-padding" style={{ background: "#f9f9f9" }}>
        <div className="container-app">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(48px, 10vw, 140px)", alignItems: "center" }}>
            <div style={{ position: "relative", height: "clamp(450px, 75vh, 850px)", animation: "fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <Image 
                src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80" 
                alt="Luxury Living" 
                fill 
                style={{ objectFit: "cover" }} 
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div style={{ padding: "0 4px" }}>
              <p className="text-tracked" style={{ fontSize: "0.75rem", color: "#888", marginBottom: 24, fontWeight: 700 }}>Heritage & Craft</p>
              <h2 style={{ marginBottom: 32, lineHeight: 1, fontSize: "clamp(2.4rem, 6vw, 4.2rem)" }}>Sophistication In Every Detail.</h2>
              <p style={{ fontSize: "1.1rem", color: "#444", lineHeight: 1.8, marginBottom: 48, fontWeight: 300, maxWidth: "540px" }}>
                For over sixty years, ShopNest has been the standard-bearer of French luxury. Each piece is a masterclass in architectural balance, blending timeless aesthetics with the functional needs of the modern home.
              </p>
              <Link href="/about" className="btn btn-secondary" style={{ padding: "18px 48px" }}>
                OUR STORY
              </Link>
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
              <h2 style={{ fontFamily: "Lora, serif", marginBottom: 16 }}>Seasonal Arrivals</h2>
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
      <section style={{ padding: "clamp(80px, 12vw, 140px) 0", background: "#000", color: "#fff" }}>
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
      </section>

      {/* Signature Collections Gallery */}
      <section className="section-padding" style={{ background: "#ffffff" }}>
        <div className="container-app">
          <div style={{ textAlign: "left", marginBottom: 64 }}>
            <p className="text-tracked" style={{ fontSize: "0.75rem", color: "#888", marginBottom: 16 }}>Collections</p>
            <h2>Signature Aesthetics.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 16 }}>
            <div style={{ position: "relative", height: 500 }}>
              <Image src="https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg" alt="Living Room" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
              <div style={{ position: "absolute", bottom: 40, left: 40, color: "#fff" }}>
                <p className="text-tracked" style={{ fontSize: "0.7rem", fontWeight: 700 }}>01 / THE LIVING SPACE</p>
              </div>
            </div>
            <div style={{ position: "relative", height: 500 }}>
              <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80" alt="Dining Room" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
              <div style={{ position: "absolute", bottom: 40, left: 40, color: "#fff" }}>
                <p className="text-tracked" style={{ fontSize: "0.7rem", fontWeight: 700 }}>02 / THE DINING ROOM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Marquee */}
      <section style={{ padding: "80px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", background: "#fafafa" }}>
        <div className="container-app">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 1, flexWrap: "wrap", gap: 64 }}>
            {["VOGUE", "ARCHITECTURAL DIGEST", "ELLE DECOR", "THE NEW YORK TIMES", "WALLPAPER*"].map((brand) => (
              <span key={brand} style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.4em", color: "#000" }}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Designers Section */}
      <section className="section-padding" style={{ background: "#000", color: "#fff" }}>
        <div className="container-app">
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <p className="text-tracked" style={{ fontSize: "0.75rem", color: "#888", marginBottom: 16 }}>The Collaborators</p>
            <h2 style={{ color: "#fff" }}>Visionary Designers</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "clamp(32px, 5vw, 64px)" }}>
            {[
              { name: "Sacha Lakic", role: "Speed & Fluidity", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" },
              { name: "Kenzo Takada", role: "Floral Fusion", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" },
              { name: "Marcel Wanders", role: "Modern Baroque", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80" },
            ].map((designer) => (
              <div key={designer.name} style={{ textAlign: "center" }}>
                <div className="grayscale-hover-container" style={{ position: "relative", width: "100%", aspectRatio: "4/5", marginBottom: 24, overflow: "hidden" }}>
                  <Image src={designer.img} alt={designer.name} fill className="grayscale-hover" style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 33vw" />
                </div>
                <h4 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: 8 }}>{designer.name}</h4>
                <p className="text-tracked" style={{ fontSize: "0.65rem", color: "#888" }}>{designer.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding" style={{ background: "#ffffff", borderBottom: "1px solid #eee" }}>
        <div className="container-app" style={{ textAlign: "center", maxWidth: 640 }}>
          <h2 style={{ marginBottom: 24 }}>The Inner Circle</h2>
          <p style={{ color: "#666", marginBottom: 48, fontWeight: 300 }}>
            Join our exclusive community to receive invitations to private previews and the latest news from the world of ShopNest.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderBottom: "1px solid #000" }}>
            <input type="email" placeholder="YOUR EMAIL ADDRESS" style={{ flex: "1 1 200px", border: "none", padding: "16px 0", fontSize: "0.75rem", letterSpacing: "0.1em", outline: "none", textTransform: "uppercase", minWidth: 0 }} />
            <button className="btn btn-ghost" style={{ padding: "16px 0 16px 24px", fontSize: "0.7rem", flexShrink: 0 }}>SUBSCRIBE</button>
          </div>
        </div>
      </section>
    </>
  );
}
