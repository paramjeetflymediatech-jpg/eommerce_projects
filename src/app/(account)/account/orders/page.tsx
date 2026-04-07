"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import ReviewModal from "@/components/reviews/ReviewModal";

const STATUS_STYLE: Record<string, { color: string; background: string }> = {
  PENDING:    { color: "#8E8E93", background: "#F1F1F2" },
  PROCESSING: { color: "#007AFF", background: "#E5F1FF" },
  SHIPPED:    { color: "#AF52DE", background: "#F6ECFB" },
  DELIVERED:  { color: "#34C759", background: "#ECF9F0" },
  CANCELLED:  { color: "#FF3B30", background: "#FFEBEA" },
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => { setOrders(data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>My Orders</h2>
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
          <Link href="/products" style={{ background: "#000", color: "#fff", textDecoration: "none", padding: "12px 28px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            BROWSE PRODUCTS
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
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    padding: "3px 10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#888" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p style={{ margin: "2px 0 0", fontWeight: 800, fontSize: "1rem" }}>
                    {formatPrice(Number(order.total))}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div style={{ borderTop: "1px solid #f9f9f9", paddingTop: 16 }}>
                  {order.items.map((item: any) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: "1px solid #fafafa" }}>
                      <div style={{ width: 50, height: 50, background: "#f5f5f5", flexShrink: 0, overflow: "hidden" }}>
                        {item.product?.images?.[0] && (
                          <img src={item.product.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.productName || item.product?.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#888" }}>
                          Qty: {item.quantity} × {formatPrice(Number(item.priceAtPurchase))}
                        </p>
                      </div>
                      {/* REVIEW BUTTON */}
                      {order.status === "DELIVERED" && (
                        <button 
                          onClick={() => setSelectedProduct({ 
                            id: item.productId, 
                            name: item.productName || item.product?.name,
                            images: item.product?.images || ["/placeholder-product.jpg"]
                          })}
                          style={styles.reviewBtn}
                        >
                          Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f9f9f9" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Deliver to</p>
                  <p style={{ fontSize: "0.8rem", color: "#555", margin: 0, fontWeight: 500 }}>
                    {order.shippingAddress.name} — {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
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
    fontSize: "0.6rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    padding: "8px 16px",
    cursor: "pointer",
    transition: "background 0.2s ease, color 0.2s ease",
  }
};
