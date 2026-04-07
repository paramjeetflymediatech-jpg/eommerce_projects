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
        setError(data.error || "Order not found. Please check your Reference ID.");
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
          <p style={styles.subtitle}>Enter your order reference ID to see current status and tracking info.</p>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Order ID / Reference Number"
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
                    <p style={styles.refLabel}>Order Reference</p>
                    <h2 style={styles.refValue}>#{order.id.toString().padStart(6, "0")}</h2>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={styles.refLabel}>Status</p>
                    <h2 style={{ ...styles.statusValue, color: getStatusColor(order.status) }}>{order.status}</h2>
                  </div>
               </div>

               {/* Timeline */}
               <div style={styles.timeline}>
                  {steps.map((step, i) => (
                    <div key={step} style={{ ...styles.step, opacity: i <= currentStepIndex ? 1 : 0.3 }}>
                      <div style={{ 
                        ...styles.dot, 
                        background: i <= currentStepIndex ? getStatusColor(step) : "#eee",
                        boxShadow: i === currentStepIndex ? `0 0 0 4px ${getStatusColor(step)}20` : "none"
                      }} />
                      <span style={styles.stepLabel}>{step}</span>
                    </div>
                  ))}
                  <div style={styles.timelineLine}>
                    <div style={{ 
                      ...styles.timelineProgress, 
                      width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                      background: getStatusColor(order.status)
                    }} />
                  </div>
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
                      <span>{item.product?.name}</span>
                      <span>x {item.quantity}</span>
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
    <Suspense fallback={<div>Loading...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "#8E8E93";
    case "PROCESSING": return "#007AFF";
    case "SHIPPED": return "#AF52DE";
    case "DELIVERED": return "#34C759";
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
    maxWidth: "600px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "48px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "2.8rem",
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
    border: "1px solid #000",
    borderRadius: "0",
    fontSize: "1rem",
    outline: "none",
    letterSpacing: "0.02em",
  },
  button: {
    padding: "16px 24px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "0",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  error: {
    padding: "16px",
    background: "#fff5f5",
    color: "#e53e3e",
    fontSize: "0.9rem",
    textAlign: "center",
    border: "1px solid #feb2b2",
    marginBottom: "40px",
  },
  result: {
    marginTop: "40px",
    animation: "fadeIn 0.5s ease-out",
  },
  orderCard: {
    border: "1px solid #000",
    padding: "40px",
    background: "#fff",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "48px",
  },
  refLabel: {
    fontSize: "0.7rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#aaa",
    marginBottom: "4px",
  },
  refValue: {
    fontSize: "1.2rem",
    fontWeight: 700,
    fontFamily: "monospace",
    margin: 0,
  },
  statusValue: {
    fontSize: "1.1rem",
    fontWeight: 800,
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  timeline: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "64px",
    padding: "0 10px",
  },
  timelineLine: {
    position: "absolute",
    top: "10px",
    left: "20px",
    right: "20px",
    height: "2px",
    background: "#eee",
    zIndex: 1,
  },
  timelineProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    transition: "width 0.8s ease",
    zIndex: 2,
  },
  step: {
    position: "relative",
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  dot: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  },
  stepLabel: {
    fontSize: "0.6rem",
    fontWeight: 800,
    letterSpacing: "0.1em",
    whiteSpace: "nowrap",
  },
  trackingInfo: {
    background: "#f9fafb",
    padding: "24px",
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
    marginBottom: "40px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  infoLabel: {
    fontSize: "0.75rem",
    color: "#666",
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
    fontSize: "0.75rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#aaa",
    marginBottom: "16px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: "0.9rem",
    color: "#444",
  }
};
