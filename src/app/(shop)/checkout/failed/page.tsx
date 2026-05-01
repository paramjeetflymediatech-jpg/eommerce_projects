"use client";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div style={{
      background: "#f1f3f6",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        background: "#fff",
        maxWidth: "600px",
        width: "100%",
        padding: "60px 48px",
        textAlign: "center",
        border: "1px solid #eee",
        borderRadius: "8px"
      }}>
        {/* Error icon */}
        <div style={{
          width: 80, height: 80,
          border: "2px solid #ff4d4f",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 32px",
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", color: "#ff4d4f", marginBottom: "16px", textTransform: "uppercase" }}>
          Payment Failed
        </p>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#111",
          marginBottom: "24px",
          lineHeight: 1.2
        }}>
          We couldn't process your payment
        </h1>
        <p style={{ 
          fontSize: "1rem", 
          color: "#666", 
          marginBottom: "40px",
          lineHeight: 1.6
        }}>
          Please try again with a different payment method or check your card details. If the issue persists, please contact your bank.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/checkout" style={{
            background: "#000",
            color: "#fff",
            padding: "16px 32px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "opacity 0.2s"
          }}>
            Try Again
          </Link>
          <Link href="/" style={{
            background: "transparent",
            color: "#666",
            padding: "12px 32px",
            textDecoration: "none",
            fontSize: "0.9rem"
          }}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
