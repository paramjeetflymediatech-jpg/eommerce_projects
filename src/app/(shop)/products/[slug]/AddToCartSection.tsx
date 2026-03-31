"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useNotificationStore } from "@/store/notificationStore";

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
  const [mounted, setMounted] = useState(false);
  
  const currentItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const currentTotal = currentItems.reduce((acc, i) => acc + i.quantity, 0);
  const maxAllowed = 2 - currentTotal;
  const isLimitReached = currentTotal >= 2;

  useEffect(() => {
    setMounted(true);
    if (maxAllowed < quantity && maxAllowed > 0) setQuantity(maxAllowed);
    else if (isLimitReached) setQuantity(1);
  }, [maxAllowed, isLimitReached, quantity]);

  const handleAddToCart = () => {
    if (quantity > maxAllowed) {
      useNotificationStore.getState().showNotification("Exceeded maximum cart limit: 2 items per order.", "error");
      return;
    }
    addItem({ id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug, stock: product.stock }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  return (
    <div>
      {/* Quantity */}
      <div className="quantity-selector-group" style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
        <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "#888" }}>Quantity</span>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid #eee", height: "48px" }}>
          <button 
            disabled={quantity <= 1 || isLimitReached}
            onClick={() => setQuantity(Math.max(1, quantity - 1))} 
            style={{ width: "48px", height: "100%", background: "none", border: "none", cursor: quantity <= 1 ? "not-allowed" : "pointer", fontSize: "1.2rem", color: quantity <= 1 ? "#ccc" : "#000" }}
          >
            —
          </button>
          <span style={{ minWidth: "40px", textAlign: "center", fontWeight: 700, fontSize: "0.9rem", fontFamily: "monospace", opacity: isLimitReached ? 0.3 : 1 }}>{quantity}</span>
          <button 
            disabled={quantity >= maxAllowed || product.stock <= quantity} 
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
            style={{ width: "48px", height: "100%", background: "none", border: "none", cursor: (quantity >= maxAllowed || product.stock <= quantity) ? "not-allowed" : "pointer", fontSize: "1.2rem", color: (quantity >= maxAllowed || product.stock <= quantity) ? "#ccc" : "#000" }}
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-actions-group" style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLimitReached}
          style={{ 
            flex: 1, 
            height: "56px", 
            background: (product.stock === 0 || isLimitReached) ? "#eee" : "#000", 
            color: (product.stock === 0 || isLimitReached) ? "#aaa" : "#fff", 
            border: "none", 
            cursor: (product.stock === 0 || isLimitReached) ? "not-allowed" : "pointer",
            fontSize: "0.7rem", 
            fontWeight: 800, 
            textTransform: "uppercase", 
            letterSpacing: "0.2em",
            transition: "all 0.3s"
          }}
        >
          {added ? "Item Added" : product.stock === 0 ? "Sold Out" : "Add to Architecture"}
        </button>
        <button
          onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug })}
          style={{ 
            width: "56px", 
            height: "56px", 
            background: "#fff", 
            border: "1px solid #000", 
            cursor: "pointer", 
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            transition: "all 0.3s"
          }}
          title={mounted ? (isWishlisted ? "Remove from List" : "Add to List") : "Add to List"}
        >
          {mounted ? (isWishlisted ? "●" : "○") : "○"}
        </button>
      </div>
    </div>
  );
}
