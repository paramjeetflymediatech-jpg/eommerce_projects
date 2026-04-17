import type { Metadata } from "next";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import Image from "next/image";

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

import ProductListingContent from "@/components/products/ProductListingContent";

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

  // Find active category recursive helper
  const findCategory = (cats: any[], id: string): any => {
    for (const cat of cats) {
      if (String(cat.id) === id) return cat;
      if (cat.children) {
        const found = findCategory(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeCategory = searchParams.category ? findCategory(categories, searchParams.category) : null;
  const pageTitle = searchParams.search
    ? `Results for "${searchParams.search}"`
    : searchParams.featured === "true"
      ? "Architectural Series"
      : activeCategory ? activeCategory.name : "The Collection";

  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        {/* Page Header / Banner */}
        {activeCategory?.banner ? (
          <div className="category-banner" style={styles.banner}>
            <Image
              src={activeCategory.banner}
              alt={activeCategory.name}
              fill
              priority
              style={{ objectFit: "contain", zIndex: 0 }}
            />
            {/* Overlay for text readability */}
            
            {/* <div style={styles.bannerContent}>
              <h1 style={styles.bannerTitle}>{activeCategory.name}</h1>
              <p style={styles.bannerSubtitle}>{pagination?.total || 0} Products</p>
            </div> */}
          </div>
        ) : (
          <header style={styles.header}>
            <div style={styles.headerTitleArea}>
              <h1 style={styles.title}>{pageTitle}</h1>
              <p style={styles.subtitle}>{pagination?.total || 0} pieces available</p>
            </div>
          </header>
        )}

        <ProductListingContent
          products={products}
          categories={categories}
          searchParams={searchParams}
          pagination={pagination}
        />
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
    padding: "clamp(24px, 5vw, 48px) 0",
    maxWidth: "1600px",
    margin: "0 auto",
    width: "92%",
  },
  header: {
    marginBottom: "clamp(32px, 6vw, 64px)",
    borderBottom: "1px solid #f5f5f5",
    paddingBottom: "40px",
  },
  headerTitleArea: {
    maxWidth: "800px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
    fontWeight: 400,
    color: "#000",
    marginBottom: "16px",
    letterSpacing: "normal",
    textTransform: "none",
    lineHeight: 1,
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "#999",
    fontWeight: 700,
    letterSpacing: "normal",
  },

  banner: {
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "60px",
    borderRadius: "8px",
    overflow: "hidden",
    position: "relative",
    
  },
  bannerOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },

  bannerContent: {
    textAlign: "center",
    color: "#fff",
    zIndex: 10,
  },
  bannerTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: 400,
    marginBottom: "12px",
    lineHeight: 1,
  },
  bannerSubtitle: {
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
  }
};
