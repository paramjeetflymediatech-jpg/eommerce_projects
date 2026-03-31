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
    padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
  },
  breadcrumb: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "60px",
  },
  breadcrumbLink: {
    fontSize: "0.55rem",
    fontWeight: 800,
    textDecoration: "none",
    color: "#ccc",
    letterSpacing: "0.2em",
  },
  separator: { color: "#eee", fontSize: "0.7rem" },
  breadcrumbCurrent: {
    fontSize: "0.55rem",
    fontWeight: 800,
    color: "#000",
    letterSpacing: "0.2em",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "clamp(40px, 8vw, 120px)",
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
    letterSpacing: "0.2em",
    display: "block",
    marginBottom: "12px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(2rem, 4vw, 3.5rem)",
    fontWeight: 400,
    textTransform: "uppercase",
    lineHeight: 1.1,
    marginBottom: "24px",
    letterSpacing: "-0.01em",
  },
  priceArea: { borderBottom: "1px solid #f0f0f0", paddingBottom: "24px" },
  price: { fontSize: "1.5rem", fontWeight: 700, letterSpacing: "0.05em" },
  descriptionArea: { margin: "40px 0" },
  shortDesc: {
    fontSize: "1.1rem",
    color: "#444",
    lineHeight: 1.6,
    borderLeft: "2px solid #000",
    paddingLeft: "24px",
    fontWeight: 300,
  },
  actionArea: { marginBottom: "40px" },
  stockStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "60px",
  },
  statusIndicator: { width: "8px", height: "8px" },
  statusText: { fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" },
  accordion: { borderTop: "1px solid #f0f0f0" },
  details: { borderBottom: "1px solid #f0f0f0" },
  summary: {
    listStyle: "none",
    padding: "24px 0",
    fontSize: "0.65rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
  },
  fullDesc: {
    fontSize: "0.9rem",
    lineHeight: 1.8,
    color: "#666",
    paddingBottom: "32px",
  },
  detailsContent: {
    fontSize: "0.9rem",
    lineHeight: 1.8,
    color: "#666",
    paddingBottom: "32px",
  },
  relatedSection: { marginTop: "160px", borderTop: "1px solid #f0f0f0", paddingTop: "80px" },
  relatedHeading: {
    fontFamily: "var(--font-serif)",
    fontSize: "2rem",
    fontWeight: 400,
    textTransform: "uppercase",
    marginBottom: "60px",
    textAlign: "center",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "60px 30px",
  },
};
