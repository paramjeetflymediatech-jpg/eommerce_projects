"use client";
import { useState, useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container-app" style={{ padding: "100px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 20 }}>🤍 Loading Wishlist...</h1>
      </div>
    );
  }

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>🤍 Wishlist</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "4rem", marginBottom: 20 }}>🤍</div>
          <h2 style={{ fontSize: "1.8rem", marginBottom: 12 }}>Your wishlist is empty</h2>
          <p style={{ marginBottom: 32 }}>Save products you love to your wishlist.</p>
          <Link href="/products" className="btn btn-primary btn-lg">Discover Products →</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {items.map((item) => (
            <ProductCard key={item.id} product={{ ...item, rating: 0, reviewCount: 0, stock: 99 }} />
          ))}
        </div>
      )}
    </div>
  );
}
