"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/products/ProductCard";

export default function AccountWishlistPage() {
  const items = useWishlistStore((s: any) => s.items);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <h2 style={s.title}>Your Wishlist</h2>
      <p style={s.desc}>Review and shop the items you&apos;ve saved for future consideration.</p>

      {items.length === 0 ? (
        <div style={s.empty}>
           <p style={s.emptyMsg}>Your wishlist is currently empty.</p>
           <Link href="/products" style={s.cta}>Discover New Designs</Link>
        </div>
      ) : (
        <div style={s.grid}>
          {items.map((item: any) => (
            <ProductCard 
              key={item.id} 
              product={{
                ...item,
                rating: 0,
                reviewCount: 0,
                stock: 99, // default to in stock for wishlist display
                isFeatured: false
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  title: { fontSize: "1.8rem", fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 8 },
  desc: { fontSize: "0.9rem", color: "#888", fontWeight: 300, marginBottom: 48 },
  empty: { textAlign: "center", padding: "80px 0", border: "1px dashed #ddd" },
  emptyMsg: { fontSize: "0.95rem", color: "#888", marginBottom: 24 },
  cta: { 
    display: "inline-block", padding: "14px 40px", background: "#000", color: "#fff", 
    textDecoration: "none", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" 
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 32 }
};
