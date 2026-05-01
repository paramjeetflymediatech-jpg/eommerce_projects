"use client";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, getCount, addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  useEffect(() => {
    setMounted(true);
    fetch(`/api/products?featured=true&limit=6`)
      .then(res => res.json())
      .then(data => setRecommendations(data.products || []))
      .catch(() => {});
  }, []);

  const total = getTotal();
  const totalCount = getCount();

  if (!items) return null; 

  // Filter out items already in cart
  const suggested = recommendations.filter(p => !items.find(i => i.product.id === p.id)).slice(0, 2);

  return (
    <>
      {/* ... previous code ... */}
      <div 
        className="cart-overlay" 
        onClick={closeCart} 
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      />
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: "min(420px, 100vw)",
        background: "var(--bg-elevated)", borderLeft: "1px solid var(--border)",
        zIndex: 1001, display: "flex", flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
        pointerEvents: isOpen ? "auto" : "none",
        visibility: isOpen ? "visible" : "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.02em" }}>
            Shopping Bag <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 400 }}>({mounted ? totalCount : 0})</span>
          </h2>
          <button onClick={closeCart} className="btn-close" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "normal" }}>Close ✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {!mounted || items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 24 }}>Your bag is empty</p>
              <button onClick={closeCart} className="btn btn-primary btn-sm">Start Exploring</button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {items.map((item, idx) => (
                  <div key={`${item.product.id}-${item.variant?.id || idx}`} style={styles.cartItem}>
                    <div style={styles.imgWrapper}>
                      {(item.variant?.images?.[0] || item.product.images?.[0]) && (
                        <Image 
                          src={item.variant?.images?.[0] || item.product.images[0]} 
                          alt="" 
                          fill 
                          style={{ objectFit: "cover" }} 
                          sizes="80px" 
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/products/${item.product.slug}`} onClick={closeCart} style={{ textDecoration: "none" }}>
                        <h4 style={styles.itemName}>{item.product.name}</h4>
                      </Link>
                      {item.variant && (
                        <p style={{ fontSize: "0.75rem", color: "#666", marginBottom: 8, letterSpacing: "normal" }}>
                          Size: <span style={{ fontWeight: 600, color: "#000" }}>{item.variant.size}</span>
                          {item.variant.color && ` / Color: ${item.variant.color}`}
                        </p>
                      )}
                      <p style={{ color: "#000", fontWeight: 700, fontSize: "0.95rem", marginBottom: 12 }}>
                        {formatPrice(item.variant?.price ?? item.product.price)}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={styles.qtyControl}>
                          <button onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                          <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                        </div>
                        <button onClick={() => removeItem(item.product.id, item.variant?.id)} style={styles.removeBtn}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* YOU MIGHT ALSO LIKE */}
              {totalCount < 2 && suggested.length > 0 && (
                <div style={{ marginTop: 10, paddingBottom: 10 }}>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#888", letterSpacing: "normal", marginBottom: 24 }}>You might also like</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {suggested.map(p => (
                      <div key={p.id} style={styles.suggestedItem}>
                        <div style={{ position: "relative", width: 60, height: 75, background: "#f8f8f8" }}>
                          <Image src={p.images[0]} alt="" fill style={{ objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontSize: "0.75rem", fontWeight: 600, margin: 0 }}>{p.name}</h5>
                          <p style={{ fontSize: "0.7rem", color: "#888", marginTop: 4 }}>{formatPrice(p.price)}</p>
                        </div>
                        <button 
                          onClick={() => addItem(p, 1)}
                          style={styles.addSuggestBtn}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {mounted && items.length > 0 && (
          <div style={{ padding: "24px", borderTop: "1px solid var(--border)", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: "0.95rem", color: "#888", letterSpacing: "normal" }}>Subtotal</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <button className="btn btn-primary" style={{ width: "100%", padding: "18px", fontSize: "0.9rem", letterSpacing: "0.05em" }}>
                Order Now
              </button>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  cartItem: { display: "flex", gap: 20, padding: 20, border: "1px solid #f0f0f0" },
  imgWrapper: { position: "relative", width: 80, height: 100, background: "#f9f9f9", flexShrink: 0 },
  itemName: { fontSize: "0.95rem", fontWeight: 700, color: "#000", marginBottom: 6, letterSpacing: "normal" },
  qtyControl: { display: "flex", alignItems: "center", gap: 12, border: "1px solid #eee", padding: "4px 12px" },
  qtyBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 },
  removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "0.7rem", fontWeight: 600, padding: 0, marginLeft: "auto", letterSpacing: "normal" },
  suggestedItem: { display: "flex", alignItems: "center", gap: 16, padding: "12px", background: "#fff", border: "1px dashed #eee" },
  addSuggestBtn: { background: "none", border: "1px solid #000", fontSize: "0.7rem", fontWeight: 600, padding: "6px 12px", cursor: "pointer" },
};

