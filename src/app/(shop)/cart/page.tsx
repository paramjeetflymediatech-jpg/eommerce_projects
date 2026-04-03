"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = getTotal();

  if (!mounted) {
    return (
      <div className="container-app" style={{ padding: "100px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: 20 }}>🛒 Loading your cart...</h1>
      </div>
    );
  }

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2.2rem", marginBottom: 8 }}>🛒 Shopping Cart</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>{items.length} item{items.length !== 1 ? "s" : ""}</p>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <div style={{ fontSize: "4rem", marginBottom: 20 }}>🛒</div>
          <h2 style={{ fontSize: "1.8rem", marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Looks like you haven't added anything yet.</p>
          <Link href="/products" className="btn btn-primary btn-lg">Start Shopping →</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 40 }}>
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={clearCart} className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }}>🗑 Clear Cart</button>
            </div>
            {items.map((item) => (
              <div key={item.product.id} className="card" style={{ padding: 24, display: "flex", gap: 20 }}>
                <Link href={`/products/${item.product.slug}`}>
                  <div style={{ position: "relative", width: 100, height: 100, borderRadius: 12, overflow: "hidden", background: "var(--bg-elevated)", flexShrink: 0 }}>
                    {item.product.images?.[0] && <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: "cover" }} sizes="100px" />}
                  </div>
                </Link>
                <div style={{ flex: 1 }}>
                  <Link href={`/products/${item.product.slug}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>{item.product.name}</h3>
                  </Link>
                  <p style={{ color: "var(--primary-light)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 16 }}>{formatPrice(item.product.price)}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 0, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                      <button onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity - 1)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "8px 14px", fontWeight: 700 }}>−</button>
                      <span style={{ minWidth: 36, textAlign: "center", fontWeight: 600 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity + 1)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "8px 14px", fontWeight: 700 }}>+</button>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>= {formatPrice(item.product.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.product.id, item.variant?.id)} className="btn btn-ghost btn-sm" style={{ marginLeft: "auto", color: "var(--error)" }}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="card" style={{ padding: 32, position: "sticky", top: 88 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>Order Summary</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal ({items.length} items)</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                  <span style={{ color: "var(--success)", fontWeight: 600 }}>{total >= 50 ? "FREE" : formatPrice(9.99)}</span>
                </div>
                <hr className="divider" style={{ margin: 0 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: "1.3rem" }}>{formatPrice(total >= 50 ? total : total + 9.99)}</span>
                </div>
              </div>
              {total < 50 && <p style={{ fontSize: "0.8rem", color: "var(--success)", marginBottom: 20, textAlign: "center" }}>🎉 Add {formatPrice(50 - total)} more for free shipping!</p>}
              <Link href="/checkout">
                <button className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1rem", marginBottom: 12 }}>Proceed to Checkout →</button>
              </Link>
              <Link href="/products">
                <button className="btn btn-ghost" style={{ width: "100%", fontSize: "0.9rem" }}>Continue Shopping</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
