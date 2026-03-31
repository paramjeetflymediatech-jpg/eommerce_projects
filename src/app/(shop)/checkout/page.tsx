"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1: Cart, 2: Information, 3: Shipping, 4: Payment
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  
  const [form, setForm] = useState({ 
    name: "", email: "", street: "", city: "", state: "", zip: "", country: "US", phone: "" 
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({ 
        ...prev, 
        name: session.user?.name || prev.name, 
        email: session.user?.email || prev.email 
      }));
    }
  }, [session]);

  useEffect(() => {
    if (mounted && items.length === 0 && !loading) {
      router.push("/cart");
    }
  }, [mounted, items, loading, router]);

  if (!mounted || (items.length === 0 && !loading)) return null;

  const subtotal = getTotal();
  const shipping = subtotal >= 2500 ? 0 : 50;
  const duties = subtotal * 0.02; // Placeholder 2%
  const taxes = subtotal * 0.05;  // Placeholder 5%
  const grandTotal = subtotal + shipping + duties + taxes - discountAmount;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          shippingAddress: { ...form },
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

  const StepHeader = ({ num, title, subtitle, isCompleted }: { num: number, title: string, subtitle?: string, isCompleted: boolean }) => (
    <div style={{ 
      background: activeStep === num ? "#000" : "#fff",
      color: activeStep === num ? "#fff" : "#000",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      border: "1px solid #eee",
      borderBottom: "none",
      cursor: isCompleted ? "pointer" : "default"
    }} onClick={() => isCompleted && setActiveStep(num)}>
      <span style={{ 
        width: 24, height: 24, 
        background: isCompleted ? "#000" : (activeStep === num ? "#fff" : "#f0f0f0"), 
        color: isCompleted ? "#fff" : (activeStep === num ? "#000" : "#999"),
        display: "flex", alignItems: "center", justifyContent: "center", 
        fontSize: "0.7rem", fontWeight: 800
      }}>
        {isCompleted ? "✓" : num}
      </span>
      <div style={{ flex: 1 }}>
        <h3 style={styles.stepTitle}>{title}</h3>
        {isCompleted && subtitle && <p style={styles.stepSubtitle}>{subtitle}</p>}
      </div>
      {isCompleted && <button style={{ ...styles.changeBtn, color: activeStep === num ? "#fff" : "#000" }}>CHANGE</button>}
    </div>
  );

  return (
    <div style={{ background: "#f8f8f8", minHeight: "100vh", paddingTop: "120px", paddingBottom: "100px" }}>
      <div className="container-app" style={{ maxWidth: "1200px" }}>
        
        <div style={styles.checkoutLayout}>
          
          {/* Steps Container */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            
            {/* 1. CART REVIEW */}
            <section>
              <StepHeader num={1} title="Cart Review" subtitle={`${items.length} Items Selected`} isCompleted={activeStep > 1} />
              {activeStep === 1 && (
                <div style={styles.stepContent}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {items.map((item) => (
                      <div key={item.product.id} style={styles.cartItemRow}>
                        <img src={item.product.images?.[0] || ""} alt="" style={styles.cartImg} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, margin: "0 0 6px" }}>{item.product.name}</h4>
                          <p style={{ fontSize: "0.8rem", color: "#888" }}>Quantity: {item.quantity}</p>
                          <span style={{ fontSize: "1rem", fontWeight: 800 }}>{formatPrice(item.product.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: "32px", padding: "16px 40px" }} onClick={() => setActiveStep(2)}>CONTINUE TO INFO</button>
                </div>
              )}
            </section>

            {/* 2. INFORMATION */}
            <section>
              <StepHeader num={2} title="Information" subtitle={form.name ? `${form.name} (${form.email})` : ""} isCompleted={activeStep > 2} />
              {activeStep === 2 && (
                <div style={styles.stepContent}>
                  <div style={styles.formGrid}>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={styles.label}>Full Name</label>
                      <input required style={styles.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
                    </div>
                    <div>
                      <label style={styles.label}>Email Address</label>
                      <input required style={styles.input} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
                    </div>
                    <div>
                      <label style={styles.label}>Phone Number</label>
                      <input required style={styles.input} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 234 567 890" />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={styles.label}>Shipping Address</label>
                      <textarea required style={{ ...styles.input, height: "80px", resize: "none" }} value={form.street} onChange={e => setForm({...form, street: e.target.value})} placeholder="Suite 500, 123 Main St" />
                    </div>
                    <div>
                      <label style={styles.label}>City</label>
                      <input required style={styles.input} value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="New York" />
                    </div>
                    <div>
                      <label style={styles.label}>State / Zip</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input required style={styles.input} value={form.state} onChange={e => setForm({...form, state: e.target.value})} placeholder="NY" />
                        <input required style={styles.input} value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} placeholder="10001" />
                      </div>
                    </div>
                  </div>
                  {!session && (
                    <p style={{ marginTop: 20, fontSize: "0.8rem", color: "#888" }}>
                      Already have an account? <Link href="/login" style={{ color: "#000", fontWeight: 600 }}>Sign In</Link>
                    </p>
                  )}
                  <button className="btn btn-primary" style={{ marginTop: "32px", padding: "16px 40px" }} onClick={() => form.name && form.email && setActiveStep(3)}>CONTINUE TO SHIPPING</button>
                </div>
              )}
            </section>

            {/* 3. SHIPPING */}
            <section>
              <StepHeader num={3} title="Shipping" subtitle={activeStep > 3 ? "Standard Delivery (Verified)" : ""} isCompleted={activeStep > 3} />
              {activeStep === 3 && (
                <div style={styles.stepContent}>
                  <div style={styles.shippingChoice}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <input type="radio" checked readOnly style={{ accentColor: "#000" }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>Standard Delivery</h4>
                        <p style={{ fontSize: "0.8rem", color: "#888", margin: "4px 0 0" }}>Estimated arrival in 3-5 business days</p>
                      </div>
                      <span style={{ fontWeight: 700 }}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: "32px", padding: "16px 40px" }} onClick={() => setActiveStep(4)}>CONTINUE TO PAYMENT</button>
                </div>
              )}
            </section>

            {/* 4. PAYMENT */}
            <section>
              <StepHeader num={4} title="Payment" isCompleted={activeStep > 4} />
              {activeStep === 4 && (
                <div style={styles.stepContent}>
                  <div style={styles.paymentBox}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <input type="radio" checked readOnly style={{ width: 18, height: 18, accentColor: "#000" }} />
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Debit/Credit Card (via Stripe)</span>
                    </div>
                    <p style={{ marginLeft: 30, fontSize: "0.8rem", color: "#888", marginTop: 8 }}>Secure, encrypted payment processing.</p>
                  </div>
                  
                  <button 
                    disabled={loading}
                    className="btn btn-primary" 
                    style={{ width: "100%", padding: "20px" }} 
                    onClick={handlePlaceOrder}
                  >
                    {loading ? "PROCESSING..." : `PAY ${formatPrice(grandTotal)}`}
                  </button>
                </div>
              )}
            </section>

          </div>

          {/* Pricing Summary Side */}
          <div style={styles.priceColumn}>
            <div style={styles.priceCard}>
              <h3 style={styles.priceHeader}>Order Summary</h3>
              
              {/* Discount Input */}
              <div style={{ marginBottom: 24 }}>
                <label style={styles.label}>Discount Code / Gift Card</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input 
                    style={styles.input} 
                    value={discountCode} 
                    onChange={e => setDiscountCode(e.target.value)} 
                    placeholder="Enter code" 
                  />
                  <button style={styles.applyBtn} onClick={() => setDiscountAmount(0)}>APPLY</button>
                </div>
              </div>

              <div style={styles.priceRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? "#2D9E67" : "inherit" }}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Estimated Duties</span>
                <span>{formatPrice(duties)}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Estimated Taxes</span>
                <span>{formatPrice(taxes)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ ...styles.priceRow, color: "#2D9E67" }}>
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div style={styles.totalRow}>
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            
            <p style={styles.secureText}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#888"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              Payment is 256-bit SSL encrypted.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  checkoutLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "16px",
    alignItems: "start",
  },
  stepTitle: { fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, fontFamily: "var(--font-sans)" },
  stepSubtitle: { margin: "4px 0 0", fontSize: "0.75rem", opacity: 0.7, fontWeight: 400 },
  changeBtn: { background: "none", border: "1px solid #000", padding: "6px 14px", fontSize: "0.6rem", fontWeight: 700, cursor: "pointer" },
  stepContent: { background: "#fff", padding: "32px 32px 40px 68px", border: "1px solid #eee", borderTop: "none" },
  cartItemRow: { display: "flex", gap: "20px", paddingBottom: "20px", borderBottom: "1px solid #f8f8f8" },
  cartImg: { width: "70px", height: "90px", objectFit: "cover" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  label: { display: "block", fontSize: "0.65rem", fontWeight: 700, marginBottom: "8px", color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" },
  input: { width: "100%", padding: "12px", border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" },
  shippingChoice: { padding: "24px", border: "2px solid #000", background: "#fcfcfc" },
  paymentBox: { padding: "20px", border: "1px solid #eee", background: "#f9f9f9", marginBottom: "24px" },
  priceColumn: { position: "sticky", top: "120px" },
  priceCard: { background: "#fff", padding: "32px", border: "1px solid #eee" },
  priceHeader: { fontSize: "0.8rem", fontWeight: 800, color: "#000", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "32px" },
  priceRow: { display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "16px", color: "#666" },
  totalRow: { display: "flex", justifyContent: "space-between", borderTop: "1px solid #000", marginTop: "24px", paddingTop: "24px", fontWeight: 800, fontSize: "1.2rem", color: "#000" },
  applyBtn: { background: "#000", color: "#fff", border: "none", padding: "0 20px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" },
  secureText: { marginTop: "20px", fontSize: "0.7rem", color: "#999", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" },
};
