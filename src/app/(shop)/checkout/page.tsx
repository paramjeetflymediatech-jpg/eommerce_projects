"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: session?.user?.name || "", email: session?.user?.email || "", street: "", city: "", state: "", zip: "", country: "US", phone: "" });

  if (!session) {
    router.push("/login?callbackUrl=/checkout");
    return null;
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          shippingAddress: { name: form.name, street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country, phone: form.phone },
        }),
      });
      const data = await res.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { marginBottom: 16 };

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2.2rem", marginBottom: 40 }}>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }}>
          {/* Form */}
          <div>
            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 24 }}>📦 Shipping Address</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Full Name *</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" /></div>
                <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Phone *</label><input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" /></div>
              </div>
              <div style={inputStyle}><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Email *</label><input required className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" /></div>
              <div style={inputStyle}><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Street Address *</label><input required className="input" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="123 Main St" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>City *</label><input required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="New York" /></div>
                <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>State *</label><input required className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="NY" /></div>
                <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>ZIP *</label><input required className="input" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="10001" /></div>
              </div>
            </div>

            <div className="card" style={{ padding: 32, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>💳 Payment</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>You will be redirected to Stripe's secure payment page to complete your purchase.</p>
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                {["Visa", "Mastercard", "American Express", "Apple Pay"].map((m) => (
                  <span key={m} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card" style={{ padding: 28, position: "sticky", top: 88 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 24 }}>Order Summary</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                {items.map((item) => (
                  <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{item.product.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="divider" style={{ margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                <span style={{ color: "var(--success)", fontWeight: 600 }}>{total >= 50 ? "FREE" : formatPrice(9.99)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, marginBottom: 24 }}>
                <span>Total</span>
                <span>{formatPrice(total >= 50 ? total : total + 9.99)}</span>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1rem" }}>
                {loading ? "⏳ Processing..." : "Pay with Stripe →"}
              </button>
              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 12 }}>🔒 Secured by Stripe</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
