"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

function CheckoutSuccessContent() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();
    
    const fetchOrder = async () => {
      try {
        let url = "";
        if (orderId) {
          url = `/api/orders/track?id=${orderId}`;
        } else if (sessionId) {
          url = `/api/orders/track?sessionId=${sessionId}`;
        }

        if (url) {
          const res = await fetch(url);
          const data = await res.json();
          if (data.success) {
            setOrder(data.order);
          }
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, orderId, clearCart]);

  return (
    <div style={{
      background: "#f1f3f6",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 16px",
    }}>
      <div style={{
        background: "#fff",
        maxWidth: "600px",
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

        <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", color: "#888", marginBottom: "16px" }}>
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

        {!loading && order && (
          <div style={{
            background: "#f8f8f8",
            padding: "24px",
            marginBottom: "32px",
            textAlign: "left",
            border: "1px solid #f0f0f0",
          }}>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                Tracking ID (UUID)
              </span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, wordBreak: "break-all" }}>
                {order.trackingId}
              </span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  Status
                </span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                  {order.status}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  Order Date
                </span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/products" className="btn btn-primary" style={{ width: "100%", padding: "16px" }}>
            Continue Shopping
          </Link>
          <Link href="/" className="btn btn-secondary" style={{ width: "100%", padding: "16px" }}>
            Back Home
          </Link>
        </div>

        <p style={{ marginTop: "32px", fontSize: "0.72rem", color: "#bbb", letterSpacing: "0.05em" }}>
          Questions? Contact us at <span style={{ color: "#000" }}>support@aionluxury.com</span>
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
    <Suspense fallback={<div style={{ padding: 120, textAlign: "center" }}>Loading success page...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
