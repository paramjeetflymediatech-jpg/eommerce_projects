import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FallbackImage from "@/components/common/FallbackImage";
import ProductCard from "@/components/products/ProductCard";

interface Props { params: { slug: string } }

async function getCategory(slug: string) {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, { next: { revalidate: 300 } }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?sort=createdAt_desc&limit=24`, { next: { revalidate: 60 } }),
    ]);
    const { categories } = await catRes.json();
    const category = categories?.find((c: { slug: string }) => c.slug === slug);
    if (!category) return null;
    const { products } = await prodRes.json();
    const filtered = products?.filter((p: { categoryId: number }) => p.categoryId === category.id) || [];
    return { category, products: filtered };
  } catch { return null; }
}

type CategoryParams = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: CategoryParams }): Promise<Metadata> {
  const params = await props.params;
  const data = await getCategory(params.slug);
  if (!data) return { title: "Category Not Found" };
  return { title: data.category.name, description: data.category.description || `Shop our ${data.category.name} collection.` };
}

export default async function CategoryPage(props: { params: CategoryParams }) {
  const params = await props.params;
  const data = await getCategory(params.slug);
  if (!data) notFound();
  const { category, products } = data;

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <nav style={{ display: "flex", gap: 8, marginBottom: 32, fontSize: "0.875rem", color: "var(--text-muted)" }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/categories" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Categories</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{category.name}</span>
      </nav>

      {category.image && (
        <div style={{ position: "relative", height: 280, borderRadius: 24, overflow: "hidden", marginBottom: 48, background: "var(--bg-elevated)" }}>
          <FallbackImage src={category.image} alt={category.name} fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7), transparent)", display: "flex", alignItems: "center", padding: 48 }}>
            <div>
              <h1 style={{ fontSize: "3rem", marginBottom: 12 }}>{category.name}</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 400 }}>{category.description}</p>
              <p style={{ marginTop: 16, color: "var(--primary-light)", fontWeight: 600 }}>{products.length} Products</p>
            </div>
          </div>
        </div>
      )}

      {!category.image && (
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: 8 }}>{category.name}</h1>
          {category.description && <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{category.description}</p>}
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{products.length} Products</p>
        </div>
      )}

      {products.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {products.map((p: { id: number; name: string; slug: string; price: number; comparePrice?: number; images: string[]; rating: number; reviewCount: number; stock: number; isFeatured?: boolean; category?: { name: string; slug: string } }) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>📦</div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>No products yet</h2>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Browse All Products</Link>
        </div>
      )}
    </div>
  );
}
