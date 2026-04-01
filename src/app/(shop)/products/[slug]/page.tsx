import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ProductCard from "@/components/products/ProductCard";
import AddToCartSection from "./AddToCartSection";
import { formatPrice } from "@/lib/utils";

interface Props { params: { slug: string } }

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: PageParams }): Promise<Metadata> {
  const params = await props.params;
  const data = await getProduct(params.slug);
  if (!data) return { title: "Piece Not Found" };
  const { product } = data;
  return {
    title: `${product.name} — ShopNest`,
    description: product.shortDescription || product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage(props: { params: PageParams }) {
  const params = await props.params;
  const data = await getProduct(params.slug);
  if (!data) notFound();
  
  const { product, related } = data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div style={styles.outer}>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: appUrl }, 
        { name: "Collection", url: `${appUrl}/products` }, 
        { name: product.name, url: `${appUrl}/products/${product.slug}` }
      ]} />

      <div style={styles.container}>
        {/* Navigation / Breadcrumb */}
        <nav style={styles.breadcrumb}>
          <Link href="/products" style={styles.breadcrumbLink}>THE COLLECTION</Link>
          <span style={styles.separator}>/</span>
          <span style={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <div className="product-detail-grid" style={styles.mainGrid}>
          {/* Left: Imagery */}
          <div className="product-image-column" style={styles.imageColumn}>
            <div style={styles.mainImageWrapper}>
              {product.images?.[0] ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill 
                  style={styles.image} 
                  sizes="(max-width: 1000px) 100vw, 60vw" 
                  priority 
                />
              ) : (
                <div style={styles.placeholder}>PIECE PREVIEW UNAVAILABLE</div>
              )}
            </div>
            
            {product.images?.length > 1 && (
              <div style={styles.thumbnailGrid}>
                {product.images.map((img: string, i: number) => (
                  <div key={i} style={styles.thumbnailWrapper}>
                    <Image src={img} alt={`${product.name} view ${i}`} fill style={styles.image} sizes="150px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="product-details-column" style={styles.detailsColumn}>
            <div className="product-sticky-details" style={styles.stickyDetails}>
              <header style={styles.header}>
                {product.category && (
                  <span style={styles.categoryLabel}>{product.category.name}</span>
                )}
                <h1 style={styles.title}>{product.name}</h1>
                <div style={styles.priceArea}>
                  <span style={styles.price}>{formatPrice(product.price)}</span>
                </div>
              </header>

              <div style={styles.descriptionArea}>
                <p style={styles.shortDesc}>{product.shortDescription || "A testament to minimalist architectural design."}</p>
              </div>

              <div style={styles.actionArea}>
                <AddToCartSection product={product} />
              </div>

              <div style={styles.stockStatus}>
                <div style={{ ...styles.statusIndicator, background: product.stock > 0 ? "#000" : "#eee" }} />
                <span style={styles.statusText}>
                  {product.stock > 0 ? `In Stock — Available for Delivery` : "Temporarily Out of Stock"}
                </span>
              </div>

              <div style={styles.accordion}>
                <details style={styles.details} open>
                  <summary style={styles.summary}>Product Description</summary>
                  <div style={styles.fullDesc} dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br/>") }} />
                </details>
                <details style={styles.details}>
                  <summary style={styles.summary}>Shipping & Authentication</summary>
                  <p style={styles.detailsContent}>This piece is subject to professional handling and white-glove delivery within 14-21 days of purchase. Each architectural component is authenticated by ShopNest.</p>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Related Pieces */}
        {related?.length > 0 && (
          <section style={styles.relatedSection}>
            <h2 style={styles.relatedHeading}>YOU MIGHT ALSO LIKE</h2>
            <div className="products-grid-responsive" style={styles.productGrid}>
              {related.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  outer: { background: "#fff", minHeight: "100vh" },
  container: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "clamp(60px, 10vw, 120px) 0",
    width: "92%",
  },
  breadcrumb: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "clamp(40px, 6vw, 80px)",
    flexWrap: "wrap",
  },
  breadcrumbLink: {
    fontSize: "0.6rem",
    fontWeight: 800,
    textDecoration: "none",
    color: "#ccc",
    letterSpacing: "0.2em",
  },
  separator: { color: "#eee", fontSize: "0.7rem" },
  breadcrumbCurrent: {
    fontSize: "0.6rem",
    fontWeight: 800,
    color: "#000",
    letterSpacing: "0.2em",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))",
    gap: "clamp(48px, 8vw, 120px)",
    alignItems: "start",
  },
  imageColumn: { display: "flex", flexDirection: "column", gap: "24px" },
  mainImageWrapper: {
    position: "relative",
    aspectRatio: "4/5",
    background: "#f9f9f9",
    overflow: "hidden",
  },
  image: { objectFit: "cover" },
  placeholder: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.6rem",
    fontWeight: 800,
    letterSpacing: "0.2em",
    color: "#ccc",
  },
  thumbnailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px",
  },
  thumbnailWrapper: {
    position: "relative",
    aspectRatio: "1",
    background: "#f9f9f9",
    cursor: "pointer",
    border: "1px solid #f0f0f0",
  },
  detailsColumn: { position: "relative" },
  stickyDetails: { position: "sticky", top: "120px" },
  header: { marginBottom: "40px" },
  categoryLabel: {
    fontSize: "0.6rem",
    fontWeight: 800,
    color: "#ccc",
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    display: "block",
    marginBottom: "16px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(2.4rem, 5vw, 4rem)",
    fontWeight: 400,
    textTransform: "uppercase",
    lineHeight: 1,
    marginBottom: "32px",
    letterSpacing: "-0.03em",
  },
  priceArea: { borderBottom: "1px solid #f5f5f5", paddingBottom: "32px" },
  price: { fontSize: "1.6rem", fontWeight: 700, letterSpacing: "0.05em" },
  descriptionArea: { margin: "48px 0" },
  shortDesc: {
    fontSize: "1.15rem",
    color: "#444",
    lineHeight: 1.7,
    borderLeft: "2px solid #000",
    paddingLeft: "28px",
    fontWeight: 300,
    maxWidth: "480px",
  },
  actionArea: { marginBottom: "48px" },
  stockStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "80px",
  },
  statusIndicator: { width: "8px", height: "8px" },
  statusText: { fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#666" },
  accordion: { borderTop: "1px solid #f5f5f5" },
  details: { borderBottom: "1px solid #f5f5f5" },
  summary: {
    listStyle: "none",
    padding: "24px 0",
    fontSize: "0.65rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
  },
  fullDesc: {
    fontSize: "0.95rem",
    lineHeight: 1.9,
    color: "#666",
    paddingBottom: "40px",
    fontWeight: 300,
  },
  detailsContent: {
    fontSize: "0.95rem",
    lineHeight: 1.9,
    color: "#666",
    paddingBottom: "40px",
    fontWeight: 300,
  },
  relatedSection: { marginTop: "clamp(120px, 15vw, 200px)", borderTop: "1px solid #f5f5f5", paddingTop: "100px" },
  relatedHeading: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
    fontWeight: 400,
    textTransform: "uppercase",
    marginBottom: "80px",
    textAlign: "center",
    letterSpacing: "0.05em",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
    gap: "clamp(64px, 8vw, 100px) clamp(24px, 4vw, 48px)",
  },
};
