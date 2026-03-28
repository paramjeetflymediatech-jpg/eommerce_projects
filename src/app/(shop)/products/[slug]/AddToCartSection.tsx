"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  slug: string;
  stock: number;
}

export default function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug, stock: product.stock }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  return (
    <div>
      {/* Quantity */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Qty:</span>
        <div style={{ display: "flex", alignItems: "center", gap: 0, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "12px 18px", fontSize: "1.2rem", fontWeight: 700 }}>−</button>
          <span style={{ minWidth: 40, textAlign: "center", fontWeight: 600, fontSize: "1rem" }}>{quantity}</span>
          <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "12px 18px", fontSize: "1.2rem", fontWeight: 700 }}>+</button>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn btn-primary btn-lg"
          style={{ flex: 1, transition: "all 0.2s", background: added ? "linear-gradient(135deg, #10b981, #059669)" : undefined }}
        >
          {added ? "✓ Added to Cart!" : product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </button>
        <button
          onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug })}
          className="btn btn-secondary btn-lg"
          style={{ padding: "16px 20px", background: isWishlisted ? "rgba(244,63,94,0.15)" : undefined, borderColor: isWishlisted ? "var(--secondary)" : undefined }}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}
