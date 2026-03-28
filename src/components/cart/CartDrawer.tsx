"use client";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={closeCart} />
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: "min(420px, 100vw)",
        background: "var(--bg-elevated)", borderLeft: "1px solid var(--border)",
        zIndex: 50, display: "flex", flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        animation: "slideInRight 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            🛒 Cart <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>({items.length} items)</span>
          </h2>
          <button onClick={closeCart} className="btn btn-ghost" style={{ padding: "8px", fontSize: "1.3rem" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🛒</div>
              <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>Your cart is empty</p>
              <p style={{ fontSize: "0.9rem", marginBottom: 24 }}>Add some products to get started</p>
              <button onClick={closeCart} className="btn btn-primary btn-sm">Continue Shopping</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map((item) => (
                <div key={item.product.id} style={{
                  display: "flex", gap: 16, padding: 16,
                  background: "var(--bg-card)", borderRadius: 14,
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ position: "relative", width: 80, height: 80, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "var(--bg-elevated)" }}>
                    {item.product.images?.[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: "cover" }} sizes="80px" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/products/${item.product.slug}`} onClick={closeCart} style={{ textDecoration: "none" }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.product.name}
                      </h4>
                    </Link>
                    <p style={{ color: "var(--primary-light)", fontWeight: 700, marginBottom: 12 }}>
                      {formatPrice(item.product.price)}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Quantity */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-elevated)", borderRadius: 8, padding: "4px 8px" }}>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>−</button>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>+</button>
                      </div>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        = {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button onClick={() => removeItem(item.product.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--error)", cursor: "pointer", fontSize: "1rem" }}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "24px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <button className="btn btn-primary" style={{ width: "100%", fontSize: "1rem", padding: "16px" }}>
                Proceed to Checkout →
              </button>
            </Link>
            <button onClick={closeCart} className="btn btn-ghost" style={{ width: "100%", marginTop: 12, fontSize: "0.9rem" }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
