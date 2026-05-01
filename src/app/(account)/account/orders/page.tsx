"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import ReviewModal from "@/components/reviews/ReviewModal";

const STATUS_STYLE: Record<string, { color: string; background: string }> = {
  PENDING: { color: "#8E8E93", background: "#F1F1F2" },
  PROCESSING: { color: "#007AFF", background: "#E5F1FF" },
  SHIPPED: { color: "#AF52DE", background: "#F6ECFB" },
  DELIVERED: { color: "#34C759", background: "#ECF9F0" },
  CANCELLED: { color: "#FF3B30", background: "#FFEBEA" },
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => { setOrders(data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Calculate pricing for a single order details view
  const getSubtotal = (order: any) => {
    return order.items?.reduce((sum: number, item: any) => sum + (Number(item.priceAtPurchase) * item.quantity), 0) || Number(order.total);
  };

  return (
    <div>
      {/* ── Order Details View ── */}
      {selectedOrder ? (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
          <button
            onClick={() => setSelectedOrder(null)}
            style={styles.backBtn}
          >
            ← Back to Orders
          </button>

          <div style={styles.detailContainer}>
            <div style={styles.detailHeader}>
              <div>
                <h2 style={styles.detailId}>Order #{String(selectedOrder.id).padStart(6, "0")}</h2>
                <p style={styles.detailDate}>
                  {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(selectedOrder.createdAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span style={{
                ...STATUS_STYLE[selectedOrder.status],
                fontSize: "0.8rem",
                fontWeight: 700,
                padding: "6px 12px",
                letterSpacing: "normal",
                borderRadius: "4px"
              }}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).toLowerCase()}
              </span>
            </div>

            <div style={styles.detailGrid}>
              {/* Delivery Details */}
              <div style={styles.detailBox}>
                <h3 style={styles.boxTitle}>Delivery Details</h3>
                <p style={styles.boxText}>
                  <strong>{selectedOrder.shippingAddress?.name}</strong><br />
                  {selectedOrder.shippingAddress?.street}<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}<br />
                  {selectedOrder.shippingAddress?.country}<br />
                  Phone: {selectedOrder.shippingAddress?.phone}
                </p>
                {selectedOrder.trackingId && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed #eee" }}>
                    <p style={styles.boxText}>
                      <strong>Carrier:</strong> {selectedOrder.carrier || "Standard Shipping"}<br />
                      <strong>Tracking ID:</strong> {selectedOrder.trackingId}
                    </p>
                    <Link href={`/track?id=${selectedOrder.trackingId}`} style={styles.inlineLink}>View Live Tracking</Link>
                  </div>
                )}
              </div>

              {/* Pricing Details */}
              <div style={styles.detailBox}>
                <h3 style={styles.boxTitle}>Price Summary</h3>
                <div style={styles.priceRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal(selectedOrder))}</span>
                </div>
                <div style={styles.priceRow}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div style={{ ...styles.priceRow, ...styles.priceTotal }}>
                  <span>Grand Total</span>
                  <span>{formatPrice(Number(selectedOrder.total))}</span>
                </div>
              </div>
            </div>

            <div style={styles.itemsSection}>
              <h3 style={styles.boxTitle}>Order Items</h3>
              {selectedOrder.items?.map((item: any) => (
                <div key={item.id} style={styles.itemRow}>
                  <div style={styles.itemImgBox}>
                    {item.product?.images?.[0] && (
                      <img src={item.product.images[0]} alt="" style={styles.itemImg} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={styles.itemName}>{item.productName || item.product?.name}</p>
                    <p style={styles.itemVariant}>
                      {item.variantColor || item.variantSize ? `Variant: ${item.variantColor || ""} ${item.variantSize || ""}` : ""}
                    </p>
                    <p style={styles.itemPricing}>
                      Qty: {item.quantity} × {formatPrice(Number(item.priceAtPurchase))}
                    </p>
                  </div>
                  {/* Review Button inside Details View */}
                  {selectedOrder.status === "DELIVERED" && (
                    <button
                      onClick={() => setSelectedProduct({
                        id: item.productId,
                        name: item.productName || item.product?.name,
                        images: item.product?.images || ["/placeholder-product.jpg"]
                      })}
                      style={styles.reviewBtn}
                    >
                      Write Review
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={styles.detailActions}>
              <Link href={`/orders/${selectedOrder.id}/invoice`} target="_blank" style={styles.downloadBtn}>
                Download Invoice
              </Link>
              <Link href="/products" style={styles.shopMoreBtn}>
                Shop more from AION LUXURY
              </Link>
            </div>

          </div>
        </div>
      ) : (
        /* ── Orders List View ── */
        <>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0 0 4px", letterSpacing: "normal" }}>My Orders</h2>
            <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
          </div>

          {loading ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#888", fontSize: "0.85rem" }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", border: "1px dashed #eee" }}>
              <p style={{ fontSize: "2rem", marginBottom: 12 }}>▤</p>
              <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>No orders yet</p>
              <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: 24 }}>Start shopping to see your orders here.</p>
              <Link href="/products" style={{ background: "#000", color: "#fff", textDecoration: "none", padding: "12px 28px", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal" }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orders.map((order: any) => (
                <div key={order.id} style={{ background: "#fff", border: "1px solid #eee", padding: "24px" }}>
                  {/* Order Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "0.9rem" }}>
                        #{String(order.id).padStart(6, "0")}
                      </span>
                      <span style={{
                        ...STATUS_STYLE[order.status],
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "3px 10px",
                        letterSpacing: "normal",
                      }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <button onClick={() => setSelectedOrder(order)} style={styles.viewDetailsBtn}>
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Order Summary Line */}
                  <div style={{ borderTop: "1px solid #f9f9f9", paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>
                        {order.items?.length || 0} items — Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: "1rem" }}>
                        {formatPrice(Number(order.total))}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  reviewBtn: {
    background: "#fff",
    border: "1px solid #000",
    color: "#000",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "normal",
    padding: "8px 16px",
    cursor: "pointer",
    transition: "background 0.2s ease, color 0.2s ease",
    whiteSpace: "nowrap"
  },
  viewDetailsBtn: {
    background: "transparent",
    border: "1px solid #000",
    color: "#000",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "normal",
    padding: "8px 16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: "0.85rem",
    color: "#666",
    fontWeight: 600,
    cursor: "pointer",
    padding: "0 0 20px 0",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  detailContainer: {
    background: "#fff",
    border: "1px solid #eee",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "32px",
    borderBottom: "1px solid #f5f5f5",
    flexWrap: "wrap",
    gap: "16px"
  },
  detailId: {
    fontSize: "1.4rem",
    fontWeight: 700,
    margin: "0 0 8px 0",
    fontFamily: "var(--font-serif)",
  },
  detailDate: {
    fontSize: "0.85rem",
    color: "#888",
    margin: 0,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "0",
  },
  detailBox: {
    padding: "32px",
    borderBottom: "1px solid #f5f5f5",
    borderRight: "1px solid #f5f5f5",
  },
  boxTitle: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#aaa",
    letterSpacing: "normal",
    margin: "0 0 24px 0",
  },
  boxText: {
    fontSize: "0.9rem",
    lineHeight: 1.6,
    color: "#333",
    margin: 0,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "12px",
  },
  priceTotal: {
    borderTop: "1px solid #eee",
    paddingTop: "16px",
    marginTop: "16px",
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#000",
  },
  inlineLink: {
    display: "inline-block",
    marginTop: "12px",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#007AFF",
    textDecoration: "none",
  },
  itemsSection: {
    padding: "32px",
    borderBottom: "1px solid #f5f5f5",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "16px 0",
    borderBottom: "1px solid #f9f9f9",
    flexWrap: "wrap",
  },
  itemImgBox: {
    width: "70px",
    height: "70px",
    background: "#f9f9f9",
    flexShrink: 0,
  },
  itemImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  itemName: {
    fontSize: "0.95rem",
    fontWeight: 700,
    margin: "0 0 4px 0",
  },
  itemPricing: {
    fontSize: "0.85rem",
    color: "#666",
    margin: 0,
  },
  itemVariant: {
    fontSize: "0.75rem",
    color: "#aaa",
    margin: "0 0 4px 0",
    textTransform: "capitalize"
  },
  detailActions: {
    padding: "32px",
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    background: "#fafafa"
  },
  downloadBtn: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#fff",
    color: "#000",
    border: "1px solid #000",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    textDecoration: "none",
    textAlign: "center",
  },
  shopMoreBtn: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#000",
    color: "#fff",
    border: "1px solid #000",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    textDecoration: "none",
    textAlign: "center",
  }
};
