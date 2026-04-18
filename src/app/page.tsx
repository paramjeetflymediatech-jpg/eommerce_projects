import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import CategorySlider from "@/components/products/CategorySlider";
import ProductSlider from "@/components/products/ProductSlider";
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?sort=createdAt_desc&limit=8`, { next: { revalidate: 60 } });
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
            padding: 0 !important;
            transform: scale(1) !important;
          }
          .brand-value-image-container {
            height: clamp(500px, 90vh, 900px) !important;
          }
        }
        @media (max-width: 640px) {
          .brand-value-image-container {
            height: 450px !important;
          }
        }
        @media (min-width: 1280px) {
          .categories-desc {
            max-width: 1250px !important;
            font-size: 0.95rem !important;
            line-height: 1.8 !important;
          }
        }
        .hero-btn {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .hero-btn:hover {
          background: #fff !important;
          color: #000 !important;
          border-color: #fff !important;
          opacity: 1 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
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
                zIndex: 1,
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
                  maxWidth: "none",
                  padding: "24px"
                }}
              />

              {/* Enhanced Dark Overlay for Maximum Readability */}
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1 }} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" style={{ zIndex: 1 }} />

            </div>
          ))}
        </div>

        <div className="container-app" style={{ position: "relative", textAlign: "center", color: "#fff", zIndex: 10, padding: "0 24px" }}>
          <h1 style={{
            fontSize: "clamp(1.8rem, 6vw, 2.1rem)",
            marginBottom: 24,
            lineHeight: 1.2,
            fontWeight: 600,
            // textShadow: "0 2px 10px rgba(0,0,0,0.5)" 
          }}>
            Elevate Everyday Comfort with Aion Luxury
          </h1>
          <p style={{
            fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
            color: "#fff",
            marginBottom: 32,
            lineHeight: 1.6,
            fontWeight: 400,
            maxWidth: "700px",
            margin: "0 auto 32px",
            textShadow: "0 1px 5px rgba(0,0,0,0.5)"
          }}>
            Discover premium essentials designed for comfort and style. From everyday lowers to performance thermals, Aion Luxury brings refined quality, modern fits, and all-season comfort to your wardrobe.
          </p>
          <div className="animate-fade" style={{ animationDelay: "0.4s" }}>
            <Link href="/products" className="btn hero-btn" style={{
              padding: "16px 48px",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              outline: "none",
              textDecoration: "none",
              opacity: 0.9,
              borderRadius: 0,
              display: "inline-block",
              textTransform: "uppercase",
              fontWeight: 600
            }}>
              Shop Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Slider - Responsive Luxury */}
      {categories.length > 0 && (
        <section className="section-padding" style={{ background: "#ffffff", paddingBottom: "clamp(40px, 6vw, 64px)" }}>
          <div className="container-app">
            <div style={{ textAlign: "center", marginBottom: "clamp(40px, 8vw, 60px)" }}>
              <h2 style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                lineHeight: 1.2,
                // marginBottom: 20,
                letterSpacing: "-0.02em"
              }}>
                Redefining Everyday Essentials
              </h2>
              <p style={{
                fontSize: "1rem",
                color: "#666",
                maxWidth: "1050px",
                margin: "0 auto",
                lineHeight: 1.7,
                fontWeight: 300,
                textAlign: "justify"
              }} className="categories-desc">
                At Aion Luxury, we believe that everyday wear should never feel ordinary. Our collection is thoughtfully crafted to deliver unmatched comfort, durability, and effortless style. Whether it’s breathable T-shirts for daily wear, versatile lowers for relaxed movement, or high-performance thermals designed for warmth, each piece is made with precision and premium fabrics. We focus on modern silhouettes, long-lasting quality, and a perfect fit for every body type. Designed for men, women, and kids, Aion Luxury ensures that your essentials feel as good as they look—every single day, in every season.
              </p>
            </div>
            <CategorySlider categories={categories} />
          </div>
        </section>
      )}

      {/* Brand Story: Art de Vivre */}
      <section style={{ padding: "40px 0" }}>
        <div className="container-app">
          <div className="grid-editorial-2">
            <div style={{ animation: "fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1)", width: "100%" }}>
              <div style={{ position: "relative", height: "clamp(350px, 50vw, 520px)", width: "100%", overflow: "hidden" }}>
                <Image
                  src="/images/fashion/coats.png"
                  alt="Luxury Fashion"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div style={{ padding: "0 4px" }}>
              <p className="text-tracked" style={{ fontSize: "0.65rem", color: "#888", marginBottom: 16, fontWeight: 700 }}>Function & Form</p>
              <h2 style={{ marginBottom: 24, lineHeight: 1.1, fontSize: "clamp(2rem, 5vw, 2.5rem)" }}>Comfort Meets Performance</h2>
              <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: 1.7, marginBottom: 32, fontWeight: 400, maxWidth: "540px", textAlign: "justify" }}>
                Aion Luxury combines innovation with timeless design to create apparel that adapts to your lifestyle. Our thermals provide superior insulation without bulk, while our T-shirts and lowers offer breathable comfort for all-day wear. Each product undergoes strict quality checks to ensure softness, durability, and performance. Whether you’re lounging at home, stepping out casually, or layering for colder days, our clothing supports your movement and enhances your confidence. With attention to detail and a commitment to excellence, Aion Luxury delivers clothing that works as hard as you do—without compromising on style or comfort.
              </p>
              <Link href="/about" className="btn btn-secondary" style={{ padding: "14px 40px" }}>
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* <section className="section-padding" style={{ background: "#ffffff" }}> */}
      <div className="container-app">
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <p className="text-tracked" style={{ fontSize: "0.7rem", color: "#523d3dff", marginBottom: 16, fontWeight: 700 }}>Material Excellence</p>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, marginBottom: 24 }}>Premium Quality Fabrics</h2>
          <p style={{ fontSize: "0.95rem", color: "#666", maxWidth: 800, margin: "0 auto", fontWeight: 400, marginBottom: 24 }}>
            We use carefully selected fabrics that feel soft on the skin while ensuring durability and long-lasting wear. Every stitch reflects our commitment to excellence, giving you products that maintain their shape, comfort, and performance even after repeated use.
          </p>
        </div>

        <div className="grid-editorial-3">
          <div className="editorial-item hover-zoom-container">
            <Image
              src="/images/lifestyle/0C8A8609.jpg"
              alt="Parisian Style"
              fill
              className="hover-zoom"
              style={{ objectFit: "cover", objectPosition: "center top" }}
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
              style={{ objectFit: "cover", objectPosition: "center top" }}
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
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            {/* <div style={{ position: "absolute", bottom: 32, left: 32, color: "#fff", zIndex: 2 }}>
                <p className="text-tracked" style={{ fontSize: "0.85rem", fontWeight: 800 }}>03 / The Craft</p>
              </div> */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)" }} />
          </div>
        </div>
      </div>
      {/* </section> */}

      {/* Featured Gallery */}
      {featured.length > 0 && (
        <section className="section-padding" style={{ background: "#ffffff" }}>

          <div className="container-app">
            <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 40px" }}>
              <h2 style={{ marginBottom: 20 }}>Designed for Every Season</h2>
              <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.7, fontWeight: 300, textAlign: "justify", marginBottom: 40 }}>
                From lightweight T-shirts for warm days to insulating thermals for winter, our collection is built to support you year-round. Aion Luxury ensures you stay comfortable, no matter the temperature or occasion.
              </p>
            </div>
            {/* <div style={{ textAlign: "center", marginBottom: "clamp(64px, 10vw, 100px)" }}>
              <h2 style={{ marginBottom: 16 }}>Curated Essentials</h2>
              <p className="text-tracked" style={{ fontSize: "0.7rem", color: "#888", fontWeight: 700, opacity: 0.6 }}>Exclusive Design Selections</p>
            </div> */}

            <ProductSlider products={featured} />
          </div>
        </section>
      )}

      {/* Multi-Section Brand & Product Area */}
      {newArrivals.length > 0 && (
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", background: "#ffffff", borderTop: "1px solid #eee" }}>
          <div className="container-app">
            {/* 1. Brand Message: Perfect Fit */}
            <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto clamp(40px, 10vw, 10px)" }}>
              <h2 style={{ marginBottom: 20, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>Perfect Fit for Everyone</h2>
              <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.7, fontWeight: 300 }}>
                Our range is tailored to suit men, women, and kids with precision fits and modern designs. We focus on flexibility, comfort, and style, ensuring every piece feels made just for you.
              </p>
            </div>

            {/* 2. Products: New Arrivals */}
            {/* <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 60px)" }}>
              <h2 style={{ fontFamily: "Lora, serif", marginBottom: 16 }}>The New Arrivals</h2>
              <div style={{ width: 60, height: 1, background: "#000", margin: "0 auto" }} />
            </div> */}

            <ProductSlider products={newArrivals} />
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
              <div className="brand-value-image-container" style={{ position: "relative", height: "clamp(400px, 80vh, 650px)", width: "100%", zIndex: 2 }}>
                <Image
                  src="/images/fashion/hero.png"
                  alt="Lookbook 01"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div style={{ paddingRight: "4vw" }}>
              <p className="text-tracked" style={{ fontSize: "0.75rem", color: "#888", marginBottom: 24, fontWeight: 700 }}>Brand Value</p>
              <h2 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", marginBottom: 32, letterSpacing: "-0.04em" }}>
                Why Choose Aion Luxury
              </h2>
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#444", marginBottom: 40, fontWeight: 300, maxWidth: "500px", textAlign: "justify" }}>
                Aion Luxury stands apart by combining premium craftsmanship with everyday practicality. Our focus on quality materials, refined design, and customer satisfaction ensures that every product delivers value beyond expectations. We prioritize comfort without compromising on style, offering versatile pieces that seamlessly fit into your lifestyle. With a wide range of options for men, women, and kids, we bring convenience and consistency to your wardrobe. Our commitment to innovation, durability, and affordability makes Aion Luxury your trusted choice for essentials that last longer and feel better—every time you wear them.
              </p>
              <Link href="/products" style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "normal",
                color: "#000",
                textDecoration: "underline",
                textUnderlineOffset: "8px"
              }}>
                Shop Our Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Collections Gallery - Fashion Pivot */}
      <section className="section-padding" style={{ background: "#ffffff" }}>
        <div className="container-app">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ marginBottom: 24, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>Shop Smart, Dress Better</h2>
            <p style={{ fontSize: "1.05rem", color: "#666", maxWidth: "800px", margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
              Upgrade your wardrobe with essentials that blend luxury and practicality. Aion Luxury makes it easy to find stylish, comfortable, and reliable clothing for every day. Experience the difference today.
            </p>
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
