import type { Metadata } from "next";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full catalog of premium products. Filter by category, price, and rating.",
};

interface SearchParams { category?: string; sort?: string; page?: string; search?: string; minPrice?: string; maxPrice?: string; featured?: string; }

async function getProducts(params: SearchParams) {
  const query = new URLSearchParams({ page: params.page || "1", limit: "12", ...(params.category && { category: params.category }), ...(params.sort && { sort: params.sort }), ...(params.search && { search: params.search }), ...(params.minPrice && { minPrice: params.minPrice }), ...(params.maxPrice && { maxPrice: params.maxPrice }), ...(params.featured && { featured: params.featured }), }).toString();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?${query}`, { next: { revalidate: 30 } });
    if (!res.ok) return { products: [], pagination: null };
    return res.json();
  } catch { return { products: [], pagination: null }; }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return { categories: [] };
    return res.json();
  } catch { return { categories: [] }; }
}

export default async function ProductsPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const [{ products, pagination }, { categories }] = await Promise.all([getProducts(searchParams), getCategories()]);
  const page = parseInt(searchParams.page || "1");
  const sortOptions = [{ value: "createdAt_desc", label: "Newest" }, { value: "price_asc", label: "Price: Low to High" }, { value: "price_desc", label: "Price: High to Low" }, { value: "rating_desc", label: "Highest Rated" }];

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: 8 }}>{searchParams.search ? `Results for "${searchParams.search}"` : searchParams.featured === "true" ? "⭐ Featured Products" : "All Products"}</h1>
        <p style={{ color: "var(--text-secondary)" }}>{pagination?.total || 0} products found</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32 }}>
        {/* Sidebar Filters */}
        <aside>
          <div className="card" style={{ padding: 24, position: "sticky", top: 88 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, padding: "0 0 12px", borderBottom: "1px solid var(--border)" }}>🔍 Filters</h2>

            {/* Categories */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Category</h3>
              <Link href="/products" style={{ display: "block", padding: "8px 12px", borderRadius: 8, textDecoration: "none", background: !searchParams.category ? "rgba(99,102,241,0.15)" : "transparent", color: !searchParams.category ? "var(--primary-light)" : "var(--text-secondary)", marginBottom: 4, fontSize: "0.9rem", fontWeight: !searchParams.category ? 600 : 400 }}>All Categories</Link>
              {categories?.map((cat: { id: number; name: string; slug: string }) => (
                <Link key={cat.id} href={`/products?category=${cat.id}`} style={{ display: "block", padding: "8px 12px", borderRadius: 8, textDecoration: "none", background: searchParams.category === String(cat.id) ? "rgba(99,102,241,0.15)" : "transparent", color: searchParams.category === String(cat.id) ? "var(--primary-light)" : "var(--text-secondary)", marginBottom: 4, fontSize: "0.9rem", fontWeight: searchParams.category === String(cat.id) ? 600 : 400 }}>{cat.name}</Link>
              ))}
            </div>

            {/* Sort */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Sort By</h3>
              {sortOptions.map(({ value, label }) => (
                <Link key={value} href={`/products?${new URLSearchParams({ ...searchParams, sort: value }).toString()}`} style={{ display: "block", padding: "8px 12px", borderRadius: 8, textDecoration: "none", background: (searchParams.sort || "createdAt_desc") === value ? "rgba(99,102,241,0.15)" : "transparent", color: (searchParams.sort || "createdAt_desc") === value ? "var(--primary-light)" : "var(--text-secondary)", marginBottom: 4, fontSize: "0.9rem" }}>{label}</Link>
              ))}
            </div>

            {/* Price Range */}
            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Price Range</h3>
              <form action="/products" method="GET" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input name="minPrice" type="number" placeholder="Min" defaultValue={searchParams.minPrice} className="input" style={{ padding: "8px 10px", fontSize: "0.85rem" }} />
                <span style={{ color: "var(--text-muted)" }}>–</span>
                <input name="maxPrice" type="number" placeholder="Max" defaultValue={searchParams.maxPrice} className="input" style={{ padding: "8px 10px", fontSize: "0.85rem" }} />
                <button type="submit" className="btn btn-primary btn-sm">Go</button>
              </form>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div>
          {products?.length > 0 ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                {products.map((p: { id: number; name: string; slug: string; price: number; comparePrice?: number; images: string[]; rating: number; reviewCount: number; stock: number; isFeatured?: boolean; category?: { name: string; slug: string } }) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 48 }}>
                  {pagination.hasPrevPage && (
                    <Link href={`/products?${new URLSearchParams({ ...searchParams, page: String(page - 1) }).toString()}`} className="btn btn-secondary btn-sm">← Prev</Link>
                  )}
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={`/products?${new URLSearchParams({ ...searchParams, page: String(p) }).toString()}`} className="btn btn-sm" style={{ background: page === p ? "var(--gradient-primary)" : "rgba(255,255,255,0.05)", color: page === p ? "white" : "var(--text-secondary)", border: "1px solid var(--border)" }}>{p}</Link>
                  ))}
                  {pagination.hasNextPage && (
                    <Link href={`/products?${new URLSearchParams({ ...searchParams, page: String(page + 1) }).toString()}`} className="btn btn-secondary btn-sm">Next →</Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>📦</div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>No products found</h2>
              <p style={{ marginBottom: 24 }}>Try adjusting your filters</p>
              <Link href="/products" className="btn btn-primary">Clear Filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
