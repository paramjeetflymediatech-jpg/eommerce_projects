"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";

interface SearchParams {
  category?: string;
  sort?: string;
  page?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
}

interface ProductListingContentProps {
  products: any[];
  categories: any[];
  searchParams: SearchParams;
  pagination: any;
}

function SidebarCategory({ cat, activeId, level = 0, onSelect }: { cat: any; activeId?: string; level?: number; onSelect?: () => void }) {
  const isActive = activeId === String(cat.id);

  return (
    <div style={{ marginLeft: level > 0 ? "16px" : 0, marginBottom: "8px" }}>
      <Link
        href={`/products?category=${cat.id}`}
        onClick={onSelect}
        style={{
          padding: "10px 0",
          textDecoration: "none",
          color: "#000",
          fontSize: level === 0 ? "0.9rem" : "0.8rem",
          letterSpacing: "normal",
          marginBottom: "4px",
          transition: "all 0.3s ease",
          width: "fit-content",
          fontWeight: isActive ? 700 : 400,
          borderBottom: isActive ? "1px solid #000" : "1px solid transparent",
          textTransform: "none",
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
            <SidebarCategory key={child.id} cat={child} activeId={activeId} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductListingContent({ products, categories, searchParams, pagination }: ProductListingContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const page = parseInt(searchParams.page || "1");

  const sortOptions = [
    { value: "createdAt_desc", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating_desc", label: "Highest Rated" }
  ];

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const closeFilter = () => setIsFilterOpen(false);

  return (
    <>
      {/* Mobile Filter Toggle Bar */}
      <div className="mobile-filter-bar" style={{
        display: "none",
        position: "sticky",
        top: "64px",
        background: "#fff",
        zIndex: 50,
        padding: "12px 0",
        borderBottom: "1px solid #eee",
        marginBottom: "24px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <button 
            onClick={toggleFilter}
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="8" x2="14" y2="8"></line><line x1="18" y1="16" x2="22" y2="16"></line></svg>
            Filter & Sort
          </button>
          <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 500 }}>{pagination?.total || 0} pieces</span>
        </div>
      </div>

      <div className="products-content-grid">
        {/* Sidebar Filters */}
        <aside className={`products-sidebar ${isFilterOpen ? 'active' : ''}`}>
          <div className="products-sidebar-inner">
            <div className="sidebar-header-mobile" style={{ display: "none", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Refine Selection</h2>
              <button onClick={closeFilter} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <div className="products-sidebar-sticky">
              <h2 className="sidebar-heading-desktop" style={{ fontSize: "0.85rem", fontWeight: 700, color: "#888", letterSpacing: "normal", marginBottom: "40px" }}>Catalog Filters</h2>

              <div className="products-filters-container">
                {/* Categories */}
                <div style={{ marginBottom: "48px" }}>
                  <h3 className="sidebar-section-heading" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#000", letterSpacing: "normal", marginBottom: "24px", opacity: 0.6 }}>Discipline</h3>
                  <Link
                    href="/products"
                    onClick={closeFilter}
                    style={{
                      display: "block",
                      padding: "10px 0",
                      textDecoration: "none",
                      color: "#000",
                      fontSize: "0.9rem",
                      letterSpacing: "normal",
                      transition: "all 0.3s ease",
                      width: "fit-content",
                      fontWeight: !searchParams.category ? 700 : 400,
                      borderBottom: !searchParams.category ? "1px solid #000" : "1px solid transparent",
                      marginBottom: "12px"
                    }}
                  >
                    All Pieces
                  </Link>

                  {categories?.map((cat: any) => (
                    <SidebarCategory key={cat.id} cat={cat} activeId={searchParams.category} level={0} onSelect={closeFilter} />
                  ))}
                </div>

                {/* Sort By */}
                <div style={{ marginBottom: "48px" }}>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#000", letterSpacing: "normal", marginBottom: "24px", opacity: 0.6 }}>Sort By</h3>
                  {sortOptions.map(({ value, label }) => (
                    <Link
                      key={value}
                      href={`/products?${new URLSearchParams({ ...searchParams, sort: value }).toString()}`}
                      onClick={closeFilter}
                      style={{
                        display: "block",
                        padding: "10px 0",
                        textDecoration: "none",
                        color: "#000",
                        fontSize: "0.9rem",
                        letterSpacing: "normal",
                        marginBottom: "4px",
                        transition: "all 0.3s ease",
                        width: "fit-content",
                        fontWeight: (searchParams.sort || "createdAt_desc") === value ? 700 : 400,
                        borderBottom: (searchParams.sort || "createdAt_desc") === value ? "1px solid #000" : "1px solid transparent"
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                {/* Price Range */}
                <div style={{ marginBottom: "48px" }}>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#000", letterSpacing: "normal", marginBottom: "24px", opacity: 0.6 }}>Price Range</h3>
                  <form action="/products" method="GET" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "240px" }}>
                    {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
                    {searchParams.sort && <input type="hidden" name="sort" value={searchParams.sort} />}
                    {searchParams.search && <input type="hidden" name="search" value={searchParams.search} />}
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input name="minPrice" type="number" placeholder="Min" defaultValue={searchParams.minPrice} style={{ width: "100%", padding: "12px 0", border: "none", borderBottom: "1px solid #eee", fontSize: "0.8rem", fontWeight: 600, outline: "none", background: "transparent", letterSpacing: "0.1em" }} />
                      <span style={{ color: "#ddd", fontSize: "0.8rem" }}>—</span>
                      <input name="maxPrice" type="number" placeholder="Max" defaultValue={searchParams.maxPrice} style={{ width: "100%", padding: "12px 0", border: "none", borderBottom: "1px solid #eee", fontSize: "0.8rem", fontWeight: 600, outline: "none", background: "transparent", letterSpacing: "0.1em" }} />
                    </div>
                    <button type="submit" onClick={closeFilter} style={{ background: "#000", color: "#fff", border: "none", padding: "14px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "normal", cursor: "pointer", width: "100%", transition: "background 0.3s ease" }}>Apply</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="products-grid-container">
          {products?.length > 0 ? (
            <>
              <div className="products-grid-responsive" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(48px, 5vw, 80px) clamp(16px, 3vw, 32px)" }}>
                {products.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(24px, 5vw, 60px)", marginTop: "clamp(60px, 10vw, 100px)", borderTop: "1px solid #f5f5f5", paddingTop: "60px", flexWrap: "wrap" }}>
                  {pagination.hasPrevPage && (
                    <Link
                      href={`/products?${new URLSearchParams({ ...searchParams, page: String(page - 1) }).toString()}`}
                      style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", textDecoration: "none", color: "#000", padding: "12px 0" }}
                    >
                      Prev
                    </Link>
                  )}
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/products?${new URLSearchParams({ ...searchParams, page: String(p) }).toString()}`}
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        padding: "12px 5px",
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
                      style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", textDecoration: "none", color: "#000", padding: "12px 0" }}
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "clamp(100px, 15vw, 180px) 0" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: "#000", marginBottom: "24px", letterSpacing: "normal" }}>No pieces found</h2>
              <p style={{ fontSize: "1rem", color: "#777", marginBottom: "48px", letterSpacing: "0.02em", fontWeight: 300 }}>Try adjusting your filters to reset the view.</p>
              <Link href="/products" style={{ display: "inline-block", background: "#000", padding: "20px 56px", color: "#fff", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", transition: "opacity 0.3s ease" }}>Clear All Filters</Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .mobile-filter-bar {
            display: block !important;
          }
          
          .sidebar-heading-desktop {
            display: none !important;
          }

          .sidebar-header-mobile {
             display: flex !important;
          }

          .products-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: #fff !important;
            z-index: 2000 !important;
            padding: 24px !important;
            transform: translateX(-100%) !important;
            transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1) !important;
            overflow-y: auto !important;
            display: block !important;
          }

          .products-sidebar.active {
            transform: translateX(0) !important;
          }

          .products-content-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </>
  );
}
