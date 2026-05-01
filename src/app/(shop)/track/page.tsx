"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const [orderQuery, setOrderQuery] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/track?id=${query}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found. Please check your Tracking ID (UUID).");
        setOrder(null);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderQuery) trackOrder(orderQuery);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrder(orderQuery);
  };

  const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStepIndex = steps.indexOf(order?.status || "");

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>Track Your Order</h1>
          <p style={styles.subtitle}>Enter your Tracking ID (UUID) to see current status and tracking info.</p>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Enter your Tracking ID"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {order && (
          <div style={styles.result}>
            <div style={styles.orderCard}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.refLabel}>Order Number</p>
                  <h2 style={styles.refValue}>{order.id.toString().padStart(6, "0")}</h2>
                  <div style={{ marginTop: 12 }}>
                    <p style={styles.refLabel}>Tracking ID</p>
                    <p style={{ ...styles.refValue, fontSize: "0.85rem", opacity: 0.6 }}>{order.trackingId}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={styles.refLabel}>Status</p>
                  <h2 style={{ ...styles.statusValue, color: getStatusColor(order.status) }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                  </h2>
                </div>
              </div>

              {/* Timeline */}
              <div style={styles.timeline}>
                <div style={styles.timelineLine}>
                  <div style={{
                    ...styles.timelineProgress,
                    width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`,
                    background: getStatusColor(order.status)
                  }} />
                </div>
                {steps.map((step, i) => {
                  const isActive = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step} style={styles.step}>
                      <div style={{
                        ...styles.dot,
                        background: isActive ? getStatusColor(step) : "#e5e7eb",
                        transform: isCurrent ? "scale(1.2)" : "scale(1)",
                        boxShadow: isCurrent ? `0 0 0 6px ${getStatusColor(step)}20` : "none",
                        border: isActive ? "none" : "2px solid #e5e7eb"
                      }}>
                        {isActive && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{
                        ...styles.stepLabel,
                        color: isActive ? "#000" : "#9ca3af",
                        fontWeight: isActive ? 700 : 500
                      }}>
                        {step.charAt(0) + step.slice(1).toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {order.trackingId && (
                <div style={styles.trackingInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Carrier</span>
                    <span style={styles.infoValue}>{order.carrier || "Standard Shipping"}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Tracking Number</span>
                    <span style={styles.infoValue} className="tracking-id">{order.trackingId}</span>
                  </div>
                </div>
              )}

              <div style={styles.itemsList}>
                <p style={styles.itemsTitle}>Items Summary</p>
                {order.items?.map((item: any) => (
                  <div key={item.id} style={styles.item}>
                    <Link
                      href={`/products/${item.product?.slug}`}
                      style={{ textDecoration: "none", color: "inherit", flex: 1 }}
                    >
                      <span style={{ fontWeight: 600, color: "#000" }} className="hover-link">
                        {item.product?.name}
                      </span>
                    </Link>
                    <span style={{ color: "#666" }}>x {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 120, textAlign: "center" }}>Loading tracking...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "#000";
    case "PROCESSING": return "#000";
    case "SHIPPED": return "#000";
    case "DELIVERED": return "#000";
    case "CANCELLED": return "#FF3B30";
    default: return "#000";
  }
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "80vh",
    padding: "80px 20px",
    background: "#fff",
    fontFamily: "var(--font-sans)",
  },
  content: {
    maxWidth: "640px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "48px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(2rem, 8vw, 3rem)",
    fontWeight: 400,
    marginBottom: "16px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#666",
    lineHeight: 1.6,
  },
  form: {
    display: "flex",
    gap: "12px",
    marginBottom: "40px",
  },
  input: {
    flex: 1,
    padding: "16px 20px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    letterSpacing: "0.02em",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "16px 32px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.1s",
  },
  error: {
    padding: "16px",
    background: "#fff5f5",
    color: "#e53e3e",
    fontSize: "0.9rem",
    textAlign: "center",
    borderRadius: "8px",
    border: "1px solid #feb2b2",
    marginBottom: "40px",
  },
  result: {
    marginTop: "40px",
    animation: "fadeIn 0.5s ease-out",
  },
  orderCard: {
    border: "1px solid #e5e7eb",
    padding: "40px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "48px",
  },
  refLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  refValue: {
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "monospace",
    margin: 0,
    color: "#000",
  },
  statusValue: {
    fontSize: "1.1rem",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.01em",
  },
  timeline: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "64px",
    padding: "0 4px",
  },
  timelineLine: {
    position: "absolute",
    top: "12px",
    left: "24px",
    right: "24px",
    height: "2px",
    background: "#f3f4f6",
    zIndex: 1,
  },
  timelineProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 2,
  },
  step: {
    position: "relative",
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    width: "60px",
  },
  dot: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#fff",
  },
  stepLabel: {
    fontSize: "0.75rem",
    whiteSpace: "nowrap",
    transition: "color 0.4s",
  },
  trackingInfo: {
    background: "#f9fafb",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "40px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  infoLabel: {
    fontSize: "0.8rem",
    color: "#6b7280",
    fontWeight: 500,
  },
  infoValue: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#000",
  },
  itemsList: {
    marginTop: "24px",
  },
  itemsTitle: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: "16px",
    letterSpacing: "0.05em",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    fontSize: "0.95rem",
    color: "#1f2937",
    borderBottom: "1px solid #f3f4f6",
  }
};
