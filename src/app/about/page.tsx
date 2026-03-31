import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={s.layout}>
      {/* Hero Section */}
      <section style={s.hero}>
        <div className="container-app" style={s.heroContainer}>
          <h1 style={s.heroTitle}>A New Era <br/> Of Living</h1>
          <p style={s.heroSubtitle}>SHOPNEST: REDEFINING MODERN SPACES SINCE 2024</p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={s.section}>
        <div className="container-app" style={s.grid}>
          <div style={s.textSide}>
            <span style={s.overline}>Our Philosophy</span>
            <h2 style={s.heading}>Architectural Integrity. Minimalist Soul.</h2>
            <p style={s.paragraph}>
              At ShopNest, we believe that the objects we surround ourselves with define our clarity of mind. 
              Our collection is curated for those who seek more than just furniture—they seek a legacy of design.
            </p>
            <p style={s.paragraph}>
              Each piece is selected for its architectural presence, clean lines, and the silent strength it brings to a room. 
              We don't follow trends; we observe the timeless.
            </p>
          </div>
          <div style={s.imageSide}>
             <img 
               src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80" 
               alt="Aesthetic Living" 
               style={s.image}
             />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ ...s.section, background: "#000", color: "#fff" }}>
        <div className="container-app">
          <div style={s.valuesHeader}>
            <h2 style={{ ...s.heading, color: "#fff" }}>Why ShopNest?</h2>
          </div>
          <div style={s.valuesGrid}>
            <div style={s.valueCard}>
              <h3 style={s.valueTitle}>01. CURATION</h3>
              <p style={s.valueDesc}>Every product is hand-picked by our curators to meet the highest standards of architectural design and premium craftsmanship.</p>
            </div>
            <div style={s.valueCard}>
              <h3 style={s.valueTitle}>02. SUSTAINABILITY</h3>
              <p style={s.valueDesc}>We partner with ethical manufacturers who prioritize the environment as much as they do elegance.</p>
            </div>
            <div style={s.valueCard}>
              <h3 style={s.valueTitle}>03. SERVICE</h3>
              <p style={s.valueDesc}>A white-glove experience from the first click to the final delivery in your sanctuary.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={s.ctaSection}>
        <div className="container-app" style={{ textAlign: "center" }}>
          <h2 style={s.ctaHeading}>Experience the Difference</h2>
          <Link href="/products" className="btn" style={s.ctaBtn}>Explore Collection</Link>
        </div>
      </section>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  layout: { background: "#fff", paddingTop: 80 },
  hero: { 
    height: "60vh", background: "#f9f9f7", display: "flex", 
    alignItems: "center", borderBottom: "1px solid #eee" 
  },
  heroContainer: { textAlign: "left" },
  heroTitle: { fontSize: "clamp(3rem, 10vw, 6rem)", color: "#000", fontWeight: 400, margin: 0, lineHeight: 0.9 },
  heroSubtitle: { 
    fontSize: "0.75rem", color: "#888", fontWeight: 700, 
    letterSpacing: "0.4em", marginTop: 24, textTransform: "uppercase" 
  },
  section: { padding: "clamp(80px, 15vw, 160px) 0" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "center" },
  textSide: { display: "flex", flexDirection: "column", gap: 32 },
  overline: { fontSize: "0.7rem", color: "#bbb", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" },
  heading: { fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#000", margin: 0, fontWeight: 500, lineHeight: 1.1 },
  paragraph: { fontSize: "1.1rem", color: "#555", fontWeight: 300, lineHeight: 1.8, maxWidth: 500 },
  imageSide: { height: 600, overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  valuesHeader: { marginBottom: 80, textAlign: "center" },
  valuesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 },
  valueCard: { border: "1px solid #333", padding: 40 },
  valueTitle: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", marginBottom: 24 },
  valueDesc: { fontSize: "0.9rem", color: "#ccc", fontWeight: 300, lineHeight: 1.6 },
  ctaSection: { padding: "160px 0", background: "#f9f9f7" },
  ctaHeading: { fontSize: "2.5rem", color: "#000", marginBottom: 40, fontWeight: 400 },
  ctaBtn: { padding: "18px 48px", background: "#000", color: "#fff", textDecoration: "none" }
};
