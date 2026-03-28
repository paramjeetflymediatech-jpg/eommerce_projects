import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ProductCard from "@/components/products/ProductCard";
import AddToCartSection from "./AddToCartSection";
import { formatPrice, calculateDiscount } from "@/lib/utils";

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

  if (!data) return { title: "Product Not Found" };
  const { product } = data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const ogImage = product.images?.[0] ? (product.images[0].startsWith("http") ? product.images[0] : `${appUrl}${product.images[0]}`) : undefined;
  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
    openGraph: { title: product.name, description: product.shortDescription || product.description?.slice(0, 160), images: ogImage ? [{ url: ogImage }] : [], type: "website" },
    twitter: { card: "summary_large_image", title: product.name },
  };
}

export default async function ProductDetailPage(props: { params: PageParams }) {
  const params = await props.params;
  const data = await getProduct(params.slug);
  if (!data) notFound();
  const { product, related } = data;
  const discount = calculateDiscount(product.price, product.comparePrice);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={[{ name: "Home", url: appUrl }, { name: "Products", url: `${appUrl}/products` }, ...(product.category ? [{ name: product.category.name, url: `${appUrl}/categories/${product.category.slug}` }] : []), { name: product.name, url: `${appUrl}/products/${product.slug}` }]} />

      <div className="container-app" style={{ padding: "40px 24px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", gap: 8, marginBottom: 32, fontSize: "0.875rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Products</Link>
          {product.category && (<><span>/</span><Link href={`/categories/${product.category.slug}`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>{product.category.name}</Link></>)}
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginBottom: 80 }}>
          {/* Images */}
          <div>
            <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: 20, background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              {product.images?.[0] ? (
                <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" priority />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "4rem" }}>📦</div>
              )}
              {discount > 0 && <span className="badge badge-danger" style={{ position: "absolute", top: 20, left: 20, fontSize: "0.9rem", padding: "6px 14px" }}>-{discount}% OFF</span>}
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                {product.images.slice(0, 5).map((img: string, i: number) => (
                  <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 12, overflow: "hidden", border: "2px solid var(--border)", cursor: "pointer" }}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="72px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Link href={`/categories/${product.category.slug}`} style={{ textDecoration: "none" }}>
                <span className="badge badge-primary" style={{ marginBottom: 16 }}>{product.category.name}</span>
              </Link>
            )}
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>{product.name}</h1>

            {product.reviewCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div className="stars" style={{ fontSize: "1rem" }}>{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</div>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24 }}>
              <span className="price" style={{ fontSize: "2.2rem" }}>{formatPrice(product.price)}</span>
              {product.comparePrice > product.price && (
                <span className="price-compare" style={{ fontSize: "1.2rem" }}>{formatPrice(product.comparePrice)}</span>
              )}
              {discount > 0 && <span className="price-discount" style={{ fontSize: "1rem" }}>Save {discount}%</span>}
            </div>

            {/* Description */}
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 32, fontSize: "1rem" }}>
              {product.shortDescription || product.description?.slice(0, 200)}
            </p>

            {/* Stock */}
            <div style={{ marginBottom: 24 }}>
              {product.stock > 10 ? (
                <span className="badge badge-success">✓ In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="badge badge-warning">⚠ Only {product.stock} left!</span>
              ) : (
                <span className="badge badge-danger">✗ Out of Stock</span>
              )}
            </div>

            {/* Add to Cart (Client Component) */}
            <AddToCartSection product={product} />

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.tags.map((tag: string) => (
                  <span key={tag} style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "var(--text-muted)", padding: "4px 12px", borderRadius: 99, fontSize: "0.8rem" }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full Description */}
        <div className="card" style={{ padding: 40, marginBottom: 64 }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 24 }}>Product Description</h2>
          <div style={{ color: "var(--text-secondary)", lineHeight: 1.9 }} dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br/>") }} />
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: 32 }}>Customer Reviews ({product.reviewCount})</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {product.reviews.map((review: { id: number; rating: number; title?: string; comment: string; createdAt: string; user: { name: string; avatar?: string } }) => (
                <div key={review.id} className="card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white" }}>{review.user.name[0]}</div>
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: 2 }}>{review.user.name}</p>
                        <div className="stars" style={{ fontSize: "0.85rem" }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  {review.title && <h4 style={{ fontWeight: 600, marginBottom: 8 }}>{review.title}</h4>}
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related?.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.8rem", marginBottom: 32 }}>Related Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
              {related.map((p: { id: number; name: string; slug: string; price: number; comparePrice?: number; images: string[]; rating: number; reviewCount: number; stock: number }) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
