"use client";
import { useState, useEffect, Suspense } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import s from "./checkout.module.css";

function CheckoutContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const failedParam = searchParams.get("failed") === "true";
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFailedPopup, setShowFailedPopup] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PHONEPE");
  
  const [form, setForm] = useState({ 
    name: session?.user?.name || "", 
    email: session?.user?.email || "", 
    street: "", city: "", state: "", zip: "", country: "IN", phone: "+91" 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (failedParam) {
      setShowFailedPopup(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [failedParam]);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [mounted, status, router]);

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
    const fetchAddresses = async () => {
      if (status === "authenticated") {
        setLoadingAddresses(true);
        try {
          const res = await fetch("/api/addresses");
          const data = await res.json();
          if (res.ok) {
            setSavedAddresses(data.addresses || []);
            // Auto-select default if form is empty
            const def = data.addresses.find((a: any) => a.isDefault);
            if (def && !form.street) {
              handleSelectAddress(def);
            }
          }
        } catch (err) {
          console.error("Failed to fetch addresses:", err);
        } finally {
          setLoadingAddresses(false);
        }
      }
    };
    fetchAddresses();
  }, [status]);

  const handleSelectAddress = (addr: any) => {
    setForm({
      name: addr.name || form.name,
      email: form.email, // keep session email
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      phone: addr.phone.startsWith("+91") ? addr.phone : "+91" + addr.phone.replace(/\D/g, '').slice(-10),
    });
    setErrors({});
  };

  useEffect(() => {
    if (mounted && items.length === 0 && !loading) {
      router.push("/cart");
    }
  }, [mounted, items, loading, router]);

  if (!mounted || (items.length === 0 && !loading)) return null;

  const subtotal = getTotal();
  const shipping = 0;
  const duties = subtotal * 0.02;
  const taxes = subtotal * 0.05;
  const grandTotal = subtotal + shipping + duties + taxes - discountAmount;

  const validateInformation = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    else if (!/^[a-zA-Z\s\-']{2,50}$/.test(form.name.trim())) newErrors.name = "Please enter a valid, real name";

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      newErrors.email = "Please enter a genuine email address";
    }

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+91\d{10}$/.test(form.phone.trim())) newErrors.phone = "Phone must be +91 followed by 10 digits";

    if (!form.street.trim()) newErrors.street = "Shipping address is required";
    else if (form.street.trim().length < 5) newErrors.street = "Please enter a complete, real address";

    if (!form.city.trim()) newErrors.city = "City is required";
    else if (!/^[a-zA-Z\s\-']{2,50}$/.test(form.city.trim())) newErrors.city = "Please enter a valid city name";

    if (!form.state.trim()) newErrors.state = "State is required";
    
    if (!form.zip.trim()) newErrors.zip = "ZIP code is required";
    else if (!/^[0-9a-zA-Z\s\-]{3,12}$/.test(form.zip.trim())) newErrors.zip = "Please enter a genuine ZIP/postal code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToShipping = () => {
    if (validateInformation()) {
      setActiveStep(3);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data);
        setDiscountAmount(data.discountAmount);
        setCouponError("");
      } else {
        setCouponError(data.error || "Invalid coupon");
        setAppliedCoupon(null);
        setDiscountAmount(0);
      }
    } catch (err) {
      setCouponError("Failed to validate coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ 
            productId: i.product.id, 
            variantId: i.variant?.id,
            quantity: i.quantity 
          })),
          shippingAddress: { ...form },
          couponCode: appliedCoupon?.code || null,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.success) {
        clearCart();
        window.location.href = `/checkout/success?orderId=${data.orderId}`;
      } else {
        alert(data.error || "Order creation failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StepHeader = ({ num, title, subtitle, isCompleted }: { num: number, title: string, subtitle?: string, isCompleted: boolean }) => (
    <div
      className={`${s.stepHeader} ${activeStep === num ? s.active : ""} ${isCompleted ? s.clickable : ""}`}
      onClick={() => isCompleted && setActiveStep(num)}
    >
      <span className={`${s.stepNum} ${isCompleted ? s.completed : activeStep === num ? s.active : ""}`}>
        {isCompleted ? "✓" : num}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className={s.stepTitle}>{title}</h3>
        {isCompleted && subtitle && <p className={s.stepSubtitle}>{subtitle}</p>}
      </div>
      {isCompleted && (
        <button className={s.changeBtn} style={{ color: activeStep === num ? "#fff" : "#000" }}>
          Change
        </button>
      )}
    </div>
  );

  return (
    <div className={s.outer}>
      {/* Failed Payment Popup */}
      {showFailedPopup && (
        <div className={s.popupOverlay}>
          <div className={s.popupContent}>
            <div className={s.popupIcon}>✕</div>
            <h2 className={s.popupTitle}>Payment Failed</h2>
            <p className={s.popupSubtitle}>We couldn't process your payment. Please try again with a different payment method.</p>
            <button className={s.popupCloseBtn} onClick={() => setShowFailedPopup(false)}>
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className={s.inner}>
        <div className={s.checkoutLayout}>

          {/* Steps Column */}
          <div className={s.stepsColumn}>

            {/* 1. CART REVIEW */}
            <section>
              <StepHeader num={1} title="Cart Review" subtitle={`${items.length} Items Selected`} isCompleted={activeStep > 1} />
              {activeStep === 1 && (
                <div className={s.stepContent}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.variant?.id ?? 'no-variant'}`} className={s.cartItemRow}>
                        <img 
                          src={item.variant?.images?.[0] || item.product.images?.[0] || ""} 
                          alt="" 
                          className={s.cartImg} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, margin: "0 0 6px" }}>{item.product.name}</h4>
                          {item.variant && (
                            <p style={{ fontSize: "0.75rem", color: "#666", marginBottom: 4 }}>
                              Size: <span style={{ fontWeight: 700, color: "#000" }}>{item.variant.size}</span>
                            </p>
                          )}
                          <p style={{ fontSize: "0.80rem", color: "#888" }}>Quantity: {item.quantity}</p>
                          <span style={{ fontSize: "1rem", fontWeight: 800 }}>
                            {formatPrice(item.variant?.price ?? item.product.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className={`btn btn-primary ${s.continueBtn}`} onClick={() => setActiveStep(2)}>
                    Continue to Info
                  </button>
                </div>
              )}
            </section>

            {/* 2. INFORMATION */}
            <section>
              <StepHeader num={2} title="Information" subtitle={form.name ? `${form.name} (${form.email})` : ""} isCompleted={activeStep > 2} />
              {activeStep === 2 && (
                <div className={s.stepContent}>
                  
                  {/* Saved Addresses Section */}
                  {savedAddresses.length > 0 && (
                    <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #f0f0f0" }}>
                      <h4 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 16, color: "#111" }}>
                        Saved Addresses Found ({savedAddresses.length})
                      </h4>
                      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                        {savedAddresses.map((addr) => (
                          <div 
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            style={{ 
                              flexShrink: 0,
                              width: 240,
                              padding: 16,
                              border: "1px solid",
                              borderColor: form.street === addr.street ? "#000" : "#eee",
                              background: form.street === addr.street ? "#fafafa" : "#fff",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              position: "relative"
                            }}
                          >
                            {form.street === addr.street && (
                              <div style={{ position: "absolute", top: 8, right: 8, color: "#2D9E67", fontWeight: 700 }}>✓</div>
                            )}
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{addr.name}</div>
                            <div style={{ color: "#666", lineHeight: 1.4, height: 44, overflow: "hidden" }}>{addr.street}</div>
                            <div style={{ color: "#666" }}>{addr.city}, {addr.state} {addr.zip}</div>
                            {addr.isDefault && <div style={{ marginTop: 8, fontSize: "0.7rem", color: "#888", fontStyle: "italic" }}>Default Address</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={s.formGrid}>
                    <div className={s.spanTwo}>
                      <label className={s.label}>Full Name <span style={{ color: "#ff4d4f" }}>*</span></label>
                      <input required maxLength={50} className={s.input} style={{ borderColor: errors.name ? "#ff4d4f" : "#e5e7eb" }} value={form.name} onChange={e => { setForm({...form, name: e.target.value}); if(errors.name) setErrors({...errors, name: ""}); }} placeholder="Eleanor Vance" />
                      {errors.name && <p className={s.errorText}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className={s.label}>Email Address <span style={{ color: "#888", fontSize: "0.8em" }}>(Optional)</span></label>
                      <input 
                        type="email" 
                        maxLength={100}
                        readOnly={!!session?.user?.email}
                        className={s.input}
                        style={{ 
                          borderColor: errors.email ? "#ff4d4f" : "#e5e7eb",
                          backgroundColor: session?.user?.email ? "#f5f5f5" : "#fff",
                          color: session?.user?.email ? "#888" : "#000"
                        }} 
                        value={form.email} 
                        onChange={e => { setForm({...form, email: e.target.value}); if(errors.email) setErrors({...errors, email: ""}); }} 
                        placeholder="" 
                      />
                      {errors.email && <p className={s.errorText}>{errors.email}</p>}
                    </div>
                    <div>
                      <label className={s.label}>Phone Number <span style={{ color: "#ff4d4f" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "0.95rem", color: "#000", fontWeight: 600 }}>+91</span>
                        <input 
                          required 
                          maxLength={10}
                          className={s.input}
                          style={{ borderColor: errors.phone ? "#ff4d4f" : "#e5e7eb", paddingLeft: "45px" }} 
                          value={form.phone.replace("+91", "")} 
                          onChange={e => { 
                            const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setForm({...form, phone: "+91" + numericValue}); 
                            if(errors.phone) setErrors({...errors, phone: ""}); 
                          }} 
                          placeholder="9876543210" 
                        />
                      </div>
                      {errors.phone && <p className={s.errorText}>{errors.phone}</p>}
                    </div>
                    <div className={s.spanTwo}>
                      <label className={s.label}>Shipping Address <span style={{ color: "#ff4d4f" }}>*</span></label>
                      <textarea required maxLength={200} className={s.input} style={{ height: "80px", resize: "none", borderColor: errors.street ? "#ff4d4f" : "#e5e7eb" }} value={form.street} onChange={e => { setForm({...form, street: e.target.value}); if(errors.street) setErrors({...errors, street: ""}); }} placeholder="Enter your address" />
                      {errors.street && <p className={s.errorText}>{errors.street}</p>}
                    </div>
                    <div>
                      <label className={s.label}>City <span style={{ color: "#ff4d4f" }}>*</span></label>
                      <input required maxLength={50} className={s.input} style={{ borderColor: errors.city ? "#ff4d4f" : "#e5e7eb" }} value={form.city} onChange={e => { setForm({...form, city: e.target.value}); if(errors.city) setErrors({...errors, city: ""}); }} placeholder="Enter your city" />
                      {errors.city && <p className={s.errorText}>{errors.city}</p>}
                    </div>
                    <div>
                      <label className={s.label}>State / Zip <span style={{ color: "#ff4d4f" }}>*</span></label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <input required maxLength={50} className={s.input} style={{ borderColor: errors.state ? "#ff4d4f" : "#e5e7eb" }} value={form.state} onChange={e => { setForm({...form, state: e.target.value}); if(errors.state) setErrors({...errors, state: ""}); }} placeholder="State" />
                          {errors.state && <p className={s.errorText}>{errors.state}</p>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <input required maxLength={20} className={s.input} style={{ borderColor: errors.zip ? "#ff4d4f" : "#e5e7eb" }} value={form.zip} onChange={e => { setForm({...form, zip: e.target.value}); if(errors.zip) setErrors({...errors, zip: ""}); }} placeholder="ZIP" />
                          {errors.zip && <p className={s.errorText}>{errors.zip}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!session && (
                    <p style={{ marginTop: 20, fontSize: "0.8rem", color: "#888" }}>
                      Already have an account? <Link href="/login" style={{ color: "#000", fontWeight: 600 }}>Sign In</Link>
                    </p>
                  )}
                  <button className={`btn btn-primary ${s.continueBtn}`} onClick={handleContinueToShipping}>
                    Continue to Shipping
                  </button>
                </div>
              )}
            </section>

            {/* 3. SHIPPING */}
            <section>
              <StepHeader num={3} title="Shipping" subtitle={activeStep > 3 ? "Standard Delivery (Verified)" : ""} isCompleted={activeStep > 3} />
              {activeStep === 3 && (
                <div className={s.stepContent}>
                  <div className={s.shippingChoice}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <input type="radio" checked readOnly style={{ accentColor: "#000", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>Standard Delivery</h4>
                        <p style={{ fontSize: "0.8rem", color: "#888", margin: "4px 0 0" }}>Estimated arrival in 3-5 business days</p>
                      </div>
                      <span style={{ fontWeight: 700, flexShrink: 0 }}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                    </div>
                  </div>
                  <button className={`btn btn-primary ${s.continueBtn}`} onClick={() => setActiveStep(4)}>
                    Continue to Payment
                  </button>
                </div>
              )}
            </section>

            {/* 4. PAYMENT */}
            <section>
              <StepHeader num={4} title="Payment" isCompleted={activeStep > 4} />
              {activeStep === 4 && (
                <div className={s.stepContent}>
                  <div className={s.paymentBox} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                      <input type="radio" checked={paymentMethod === "PHONEPE"} onChange={() => setPaymentMethod("PHONEPE")} style={{ width: 18, height: 18, accentColor: "#000" }} />
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>PhonePe (UPI, Cards, NetBanking)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                      <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} style={{ width: 18, height: 18, accentColor: "#000" }} />
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Cash on Delivery (COD)</span>
                    </label>
                  </div>
                  <button 
                    disabled={loading}
                    className={`btn btn-primary ${s.payBtn}`}
                    onClick={handlePlaceOrder}
                  >
                    {loading ? "Processing..." : `Pay ${formatPrice(grandTotal)}`}
                  </button>
                </div>
              )}
            </section>

          </div>

          {/* Order Summary Side */}
          <div className={s.priceColumn}>
            <div className={s.priceCard}>
              <h3 className={s.priceHeader}>Order Summary</h3>
              
              {/* Discount Input */}
              <div style={{ marginBottom: 24 }}>
                <label className={s.label}>Discount Code / Gift Card</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input 
                    className={s.input}
                    style={{ borderColor: couponError ? "#ff4d4f" : appliedCoupon ? "#2D9E67" : "#e5e7eb" }}
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                    placeholder="Enter code" 
                    disabled={appliedCoupon || applyingCoupon}
                  />
                  {appliedCoupon ? (
                    <button 
                      className={s.applyBtn} 
                      style={{ background: "#f5f5f5", color: "#666" }}
                      onClick={() => {
                        setAppliedCoupon(null);
                        setDiscountAmount(0);
                        setCouponCode("");
                      }}
                    >
                      Remove
                    </button>
                  ) : (
                    <button 
                      className={s.applyBtn} 
                      disabled={applyingCoupon || !couponCode}
                      onClick={handleApplyCoupon}
                    >
                      {applyingCoupon ? "..." : "Apply"}
                    </button>
                  )}
                </div>
                {couponError && <p className={s.errorText} style={{ marginTop: 4 }}>{couponError}</p>}
                {appliedCoupon && <p style={{ color: "#2D9E67", fontSize: "0.75rem", fontWeight: 600, marginTop: 4 }}>✓ Coupon applied!</p>}
              </div>

              <div className={s.priceRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={s.priceRow}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? "#2D9E67" : "inherit" }}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div className={s.priceRow}>
                <span>Estimated Duties</span>
                <span>{formatPrice(duties)}</span>
              </div>
              <div className={s.priceRow}>
                <span>Estimated Taxes</span>
                <span>{formatPrice(taxes)}</span>
              </div>
              {discountAmount > 0 && (
                <div className={s.priceRow} style={{ color: "#2D9E67" }}>
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className={s.totalRow}>
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            
            <p className={s.secureText}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#888"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              Payment is 256-bit SSL encrypted.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 120, textAlign: "center" }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
