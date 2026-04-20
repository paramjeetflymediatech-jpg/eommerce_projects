import React from "react";
import Link from "next/link";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.layout}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container-app ${styles.heroGrid}`}>
          <div className={styles.heroTextSide}>
            <h1 className={styles.heroTitle}>A New Era <br/> Of Attire</h1>
            <p className={styles.heroSubtitle}>AION LUXURY: REDEFINING THE MODERN WARDROBE SINCE 2024</p>
          </div>
          <div className={styles.heroImageSide}>
            <img 
              src="/images/story-hero.png" 
              alt="Luxury Fashion Hero" 
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.section}>
        <div className={`container-app ${styles.grid}`}>
          <div className={styles.textSide}>
            <span className={styles.overline}>Our Philosophy</span>
            <h2 className={styles.heading}>Tailored Integrity. Minimalist Soul.</h2>
            <p className={styles.paragraph}>
              At Aion Luxury, we believe that the garments we wear define our presence in the world. 
              Our collection is curated for those who seek more than just clothing—they seek a legacy of style.
            </p>
            <p className={styles.paragraph}>
              Each piece is selected for its architectural silhouette, premium textiles, and the silent strength it brings to a person. 
              We don't follow trends; we observe the timeless.
            </p>
          </div>
          <div className={styles.imageSide}>
             <img 
               src="/images/fashion/hero.png" 
               alt="Aesthetic Fashion" 
               className={styles.image}
             />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.section} style={{ background: "#000", color: "#fff" }}>
        <div className="container-app">
          <div className={styles.valuesHeader}>
            <h2 className={styles.heading} style={{ color: "#fff" }}>Why Aion Luxury?</h2>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>01. CURATION</h3>
              <p className={styles.valueDesc}>Every garment is hand-picked by our stylists to meet the highest standards of architectural tailoring and premium natural fibres.</p>
            </div>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>02. SUSTAINABILITY</h3>
              <p className={styles.valueDesc}>We partner with ethical manufacturers who prioritize the environment as much as they do elegance.</p>
            </div>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>03. SERVICE</h3>
              <p className={styles.valueDesc}>A white-glove experience from the first click to the final fitting in your wardrobe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container-app">
          <h2 className={styles.ctaHeading}>Experience the Difference</h2>
          <Link href="/products" className={styles.ctaBtn}>Explore Collection</Link>
        </div>
      </section>
    </div>
  );
}

