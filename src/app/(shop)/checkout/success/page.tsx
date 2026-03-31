"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderData, setOrderData] = useState<{ email?: string; orderId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/stripe/session?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => { setOrderData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  return (
    <div style={{
      background: "#f1f3f6",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: "80px",
      paddingBottom: "80px",
      padding: "80px 16px",
    }}>
      <div style={{
        background: "#fff",
        maxWidth: "540px",
        width: "100%",
        padding: "60px 48px",
        textAlign: "center",
        border: "1px solid #eee",
      }}>
        {/* Animated checkmark */}
        <div style={{
          width: 80, height: 80,
          border: "2px solid #000",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 32px",
          animation: "popIn 0.5s cubic-bezier(0.19,1,0.22,1) forwards",
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "16px" }}>
          Order Confirmed
        </p>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
          fontWeight: 400,
          margin: "0 0 24px",
          lineHeight: 1.2,
        }}>
          Thank You for Your Order
        </h1>
        <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "32px" }}>
          Your order has been placed successfully and is now being processed. A confirmation has been sent to your email.
        </p>

        {loading && (
          <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "32px" }}>Fetching order details…</p>
        )}

        {!loading && orderData?.email && (
          <div style={{
            background: "#f8f8f8",
            padding: "20px 24px",
            marginBottom: "32px",
            textAlign: "left",
            border: "1px solid #f0f0f0",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Order ID</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, fontFamily: "monospace" }}>
                {sessionId?.slice(-12).toUpperCase()}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Confirmation sent to</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{orderData.email}</span>
            </div>
          </div>
        )}

        {!loading && !orderData?.email && sessionId && (
          <div style={{
            background: "#f8f8f8",
            padding: "20px 24px",
            marginBottom: "32px",
            border: "1px solid #f0f0f0",
          }}>
            <p style={{ fontSize: "0.8rem", color: "#888", margin: 0, fontFamily: "monospace" }}>
              Session: …{sessionId.slice(-16)}
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/products" className="btn btn-primary" style={{ width: "100%", padding: "16px" }}>
            CONTINUE SHOPPING
          </Link>
          <Link href="/" className="btn btn-secondary" style={{ width: "100%", padding: "16px" }}>
            BACK TO HOME
          </Link>
        </div>

        <p style={{ marginTop: "32px", fontSize: "0.72rem", color: "#bbb", letterSpacing: "0.05em" }}>
          Questions? Contact us at <span style={{ color: "#000" }}>support@shopnest.com</span>
        </p>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
