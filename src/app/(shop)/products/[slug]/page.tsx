import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ProductCard from "@/components/products/ProductCard";
import ProductDetailContent from "./ProductDetailContent";
import { formatPrice } from "@/lib/utils";
import s from "./product-detail.module.css";

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
    title: `${product.name} — Aion Luxury`,
    description: product.shortDescription || product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage(props: { 
  params: PageParams;
  searchParams: Promise<{ variant?: string }>;
}) {
  const params = await props.params;
  const { variant } = await props.searchParams;
  const data = await getProduct(params.slug);
  if (!data) notFound();
  
  const { product, related } = data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className={s.outer}>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: appUrl }, 
        { name: "Collection", url: `${appUrl}/products` }, 
        { name: product.name, url: `${appUrl}/products/${product.slug}` }
      ]} />

      <div className={s.container}>
        {/* Navigation / Breadcrumb */}
        <nav className={s.breadcrumb}>
          <Link href="/products" className={s.breadcrumbLink}>The Collection</Link>
          <span className={s.separator}>/</span>
          <span className={s.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <ProductDetailContent 
          product={product} 
          initialVariantId={variant} 
        />

        {/* Related Pieces */}
        {related?.length > 0 && (
          <section className={s.relatedSection}>
            <h2 className={s.relatedHeading}>You might also like</h2>
            <div className={`${s.productGrid} products-grid-responsive`}>
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


