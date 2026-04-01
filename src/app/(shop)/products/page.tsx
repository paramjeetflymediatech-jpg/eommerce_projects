import type { Metadata } from "next";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full catalog of premium products. Filter by category, price, and rating.",
};

interface SearchParams { 
  category?: string; 
  sort?: string; 
  page?: string; 
  search?: string; 
  minPrice?: string; 
  maxPrice?: string; 
  featured?: string; 
}

function SidebarCategory({ cat, activeId, level = 0 }: { cat: any; activeId?: string; level?: number }) {
  const isActive = activeId === String(cat.id);
  
  return (
    <div style={{ marginLeft: level > 0 ? "16px" : 0, marginBottom: "8px" }}>
      <Link 
        href={`/products?category=${cat.id}`} 
        style={{ 
          ...styles.filterLink, 
          fontWeight: isActive ? 700 : 400,
          borderBottom: isActive ? "1px solid #000" : "1px solid transparent",
          fontSize: level === 0 ? "0.8rem" : "0.7rem",
          color: level > 0 && !isActive ? "#888" : "#000",
          textTransform: level === 0 ? "uppercase" : "none" as const,
          letterSpacing: level === 0 ? "0.15em" : "0.1em",
          display: "flex",
          alignItems: "center"
        }}
      >
        {level > 0 && <span style={{ marginRight: "6px", opacity: 0.3 }}>—</span>}
        {cat.name}
      </Link>
      
      {cat.children && cat.children.length > 0 && (
        <div style={{ marginTop: "4px" }}>
          {cat.children.map((child: any) => (
            <SidebarCategory key={child.id} cat={child} activeId={activeId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

async function getProducts(params: SearchParams) {
  const query = new URLSearchParams({ 
    page: params.page || "1", 
    limit: "12", 
    ...(params.category && { category: params.category }), 
    ...(params.sort && { sort: params.sort }), 
    ...(params.search && { search: params.search }), 
    ...(params.minPrice && { minPrice: params.minPrice }), 
    ...(params.maxPrice && { maxPrice: params.maxPrice }), 
    ...(params.featured && { featured: params.featured }), 
  }).toString();
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?${query}`, { next: { revalidate: 30 } });
    if (!res.ok) return { products: [], pagination: null };
    return res.json();
  } catch { 
    return { products: [], pagination: null }; 
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return { categories: [] };
    return res.json();
  } catch { 
    return { categories: [] }; 
  }
}

export default async function ProductsPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const [{ products, pagination }, { categories }] = await Promise.all([
    getProducts(searchParams), 
    getCategories()
  ]);
  
  const page = parseInt(searchParams.page || "1");
  const sortOptions = [
    { value: "createdAt_desc", label: "Newest" }, 
    { value: "price_asc", label: "Price: Low to High" }, 
    { value: "price_desc", label: "Price: High to Low" }, 
    { value: "rating_desc", label: "Highest Rated" }
  ];

  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        {/* Page Header */}
        <header style={styles.header}>
          <div style={styles.headerTitleArea}>
            <h1 style={styles.title}>
              {searchParams.search 
                ? `Results for "${searchParams.search}"` 
                : searchParams.featured === "true" 
                  ? "Architectural Series" 
                  : "The Collection"}
            </h1>
            <p style={styles.subtitle}>{pagination?.total || 0} PIECES AVAILABLE</p>
          </div>
        </header>

        <div className="products-content-grid">
          {/* Sidebar Filters */}
          <aside className="products-sidebar">
            <div className="products-sidebar-sticky">
              <h2 style={styles.sidebarHeading}>Catalog Filters</h2>

              <div className="products-filters-container">
                {/* Categories */}
                <div style={styles.filterSection}>
                  <h3 style={styles.filterLabel}>Discipline</h3>
                  <Link 
                    href="/products" 
                    style={{ 
                      ...styles.filterLink, 
                      fontWeight: !searchParams.category ? 700 : 400,
                      borderBottom: !searchParams.category ? "1px solid #000" : "1px solid transparent",
                      marginBottom: "16px"
                    }}
                  >
                    ALL PIECES
                  </Link>
                  
                  {categories?.map((cat: any) => (
                    <SidebarCategory key={cat.id} cat={cat} activeId={searchParams.category} level={0} />
                  ))}
                </div>

                {/* Sort By */}
                <div style={styles.filterSection}>
                  <h3 style={styles.filterLabel}>Sort By</h3>
                  {sortOptions.map(({ value, label }) => (
                    <Link 
                      key={value} 
                      href={`/products?${new URLSearchParams({ ...searchParams, sort: value }).toString()}`} 
                      style={{ 
                        ...styles.filterLink, 
                        fontWeight: (searchParams.sort || "createdAt_desc") === value ? 700 : 400,
                        borderBottom: (searchParams.sort || "createdAt_desc") === value ? "1px solid #000" : "1px solid transparent"
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                {/* Price Range */}
                <div style={styles.filterSection}>
                  <h3 style={styles.filterLabel}>Price Range</h3>
                  <form action="/products" method="GET" style={styles.priceForm}>
                    <div style={styles.priceInputGroup}>
                      <input name="minPrice" type="number" placeholder="MIN" defaultValue={searchParams.minPrice} style={styles.priceInput} />
                      <span style={styles.priceSeparator}>—</span>
                      <input name="maxPrice" type="number" placeholder="MAX" defaultValue={searchParams.maxPrice} style={styles.priceInput} />
                    </div>
                    <button type="submit" style={styles.priceGo}>Apply</button>
                  </form>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div style={styles.mainContent}>
            {products?.length > 0 ? (
              <>
                <div className="products-grid-responsive" style={styles.productGrid}>
                  {products.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div style={styles.pagination}>
                    {pagination.hasPrevPage && (
                      <Link 
                        href={`/products?${new URLSearchParams({ ...searchParams, page: String(page - 1) }).toString()}`} 
                        style={styles.pageBtn}
                      >
                        PREV
                      </Link>
                    )}
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                      <Link 
                        key={p} 
                        href={`/products?${new URLSearchParams({ ...searchParams, page: String(p) }).toString()}`} 
                        style={{ 
                          ...styles.pageNumber, 
                          color: page === p ? "#000" : "#ccc",
                          textDecoration: page === p ? "underline" : "none" 
                        }}
                      >
                        {p}
                      </Link>
                    ))}
                    {pagination.hasNextPage && (
                      <Link 
                        href={`/products?${new URLSearchParams({ ...searchParams, page: String(page + 1) }).toString()}`} 
                        style={styles.pageBtn}
                      >
                        NEXT
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div style={styles.empty}>
                <h2 style={styles.emptyTitle}>NO PIECES FOUND</h2>
                <p style={styles.emptyDesc}>Try adjusting your filters to reset the view.</p>
                <Link href="/products" style={styles.clearBtn}>Clear All Filters</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  outer: {
    background: "#fff",
    minHeight: "100vh",
  },
  container: {
    padding: "clamp(60px, 10vw, 120px) 0",
    maxWidth: "1600px",
    margin: "0 auto",
    width: "92%",
  },
  header: {
    marginBottom: "clamp(60px, 8vw, 100px)",
    borderBottom: "1px solid #f5f5f5",
    paddingBottom: "40px",
  },
  headerTitleArea: {
    maxWidth: "800px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
    fontWeight: 400,
    color: "#000",
    marginBottom: "16px",
    letterSpacing: "-0.03em",
    textTransform: "uppercase",
    lineHeight: 1,
  },
  subtitle: {
    fontSize: "0.65rem",
    color: "#999",
    fontWeight: 800,
    letterSpacing: "0.45em",
    textTransform: "uppercase",
  },
  sidebarHeading: {
    fontSize: "0.6rem",
    fontWeight: 900,
    color: "#ddd",
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    marginBottom: "40px",
  },
  filterSection: {
    marginBottom: "48px",
  },
  filterLabel: {
    fontSize: "0.55rem",
    fontWeight: 800,
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    marginBottom: "24px",
    opacity: 0.4,
  },
  filterLink: {
    display: "block",
    padding: "10px 0",
    textDecoration: "none",
    color: "#000",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "4px",
    transition: "all 0.3s ease",
    width: "fit-content",
  },
  priceForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "240px",
  },
  priceInputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  priceInput: {
    width: "100%",
    padding: "12px 0",
    border: "none",
    borderBottom: "1px solid #eee",
    fontSize: "0.8rem",
    fontWeight: 600,
    outline: "none",
    background: "transparent",
    letterSpacing: "0.1em",
  },
  priceSeparator: { color: "#ddd", fontSize: "0.8rem" },
  priceGo: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "14px",
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    cursor: "pointer",
    width: "100%",
    transition: "background 0.3s ease",
  },
  mainContent: {
    flex: 1,
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
    gap: "clamp(64px, 6vw, 100px) clamp(24px, 4vw, 48px)",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "clamp(24px, 5vw, 60px)",
    marginTop: "clamp(80px, 12vw, 140px)",
    borderTop: "1px solid #f5f5f5",
    paddingTop: "60px",
    flexWrap: "wrap",
  },
  pageBtn: {
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "0.3em",
    textDecoration: "none",
    color: "#000",
    padding: "12px 0",
  },
  pageNumber: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    padding: "12px 5px",
  },
  empty: {
    textAlign: "center",
    padding: "clamp(100px, 15vw, 180px) 0",
  },
  emptyTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
    fontWeight: 400,
    color: "#000",
    marginBottom: "24px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  emptyDesc: {
    fontSize: "1rem",
    color: "#777",
    marginBottom: "48px",
    letterSpacing: "0.02em",
    fontWeight: 300,
  },
  clearBtn: {
    display: "inline-block",
    background: "#000",
    padding: "20px 56px",
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    transition: "opacity 0.3s ease",
  },
};
