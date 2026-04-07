"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const STATUS_VARIANTS: any = {
  PENDING: { color: "#8E8E93", background: "#F1F1F2" },
  PROCESSING: { color: "#007AFF", background: "#E5F1FF" },
  SHIPPED: { color: "#AF52DE", background: "#F6ECFB" },
  DELIVERED: { color: "#34C759", background: "#ECF9F0" },
  CANCELLED: { color: "#FF3B30", background: "#FFEBEA" },
};

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingTracking, setEditingTracking] = useState(false);
  const [trackingData, setTrackingData] = useState({ trackingId: "", carrier: "" });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&status=${statusFilter}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        setPagination(data.pagination || { totalPages: 1 });
      } else {
        setError(data.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const updateStatus = async (id: number, status: string, trackingInfo?: any) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, ...trackingInfo }),
      });
      if (res.ok) {
        fetchOrders();
        setEditingTracking(false);
        setSelectedOrder(null);
      }
    } catch (err) {
      alert("Failed to update order");
    }
  };

  const openTrackingModal = (order: any) => {
    setSelectedOrder(order);
    setTrackingData({ 
      trackingId: order.trackingId || "", 
      carrier: order.carrier || "" 
    });
    setEditingTracking(true);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Order Fulfilment</h1>
          <p style={styles.subtitle}>Track customer purchases and manage delivery cycles.</p>
        </div>
        <div style={styles.filters} className="admin-filter-row">
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} 
            style={styles.select}
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.tableWrapper} className="admin-table-wrap">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Reference</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={styles.loading}>Processing...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={styles.empty}>No orders detected in the system.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.ref}>#{order.id.toString().padStart(6, "0")}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.userName}>{order.user?.name || "Guest"}</div>
                    <div style={styles.userEmail}>{order.user?.email}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.itemsText}>
                      {order.items?.length || 0} ITEMS
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.total}>${Number(order.total).toFixed(2)}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.badge, 
                      ...STATUS_VARIANTS[order.status] 
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={styles.statusSelect}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button 
                         onClick={() => openTrackingModal(order)}
                         style={styles.trackBtn}
                         title="Manage Tracking"
                      >
                        🚚
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="admin-card-list" style={{ flexDirection: "column", display: "none" }}>
        {!loading && orders.map((order) => (
          <div key={order.id} className="admin-card-item">
            <div className="admin-card-row">
              <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "0.9rem" }}>#{order.id.toString().padStart(6, "0")}</span>
              <span style={{ 
                padding: "3px 10px", fontSize: "0.65rem", fontWeight: 800,
                ...STATUS_VARIANTS[order.status]
              }}>{order.status}</span>
            </div>
            <div className="admin-card-row">
              <span className="admin-card-label">Customer</span>
              <span className="admin-card-value">{order.user?.name || "Guest"}</span>
            </div>
            <div className="admin-card-row">
              <span className="admin-card-label">Total</span>
              <span className="admin-card-value" style={{ fontWeight: 800 }}>${Number(order.total).toFixed(2)}</span>
            </div>
            <div className="admin-card-row">
              <span className="admin-card-label">Date</span>
              <span className="admin-card-value">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="admin-card-row">
              <span className="admin-card-label">Update Status</span>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                style={{ border: "1px solid #eee", padding: "6px 10px", fontSize: "0.75rem", background: "#fff", outline: "none" }}
              >
                {["PENDING","PROCESSING","SHIPPED","DELIVERED","CANCELLED"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {loading && <div style={{ textAlign: "center", padding: 40, color: "#888", fontSize: "0.85rem" }}>Processing...</div>}
        {!loading && orders.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#ccc", fontSize: "0.85rem" }}>No orders detected.</div>}
      </div>

      <div style={styles.pagination}>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
          style={styles.pageBtn}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>PAGE {page} OF {pagination.totalPages}</span>
        <button 
          onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} 
          disabled={page === pagination.totalPages}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>

      {/* Tracking Modal */}
      {editingTracking && selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Order Logstics</h2>
            <p style={styles.modalSubtitle}>Update tracking information for order #{selectedOrder.id.toString().padStart(6, "0")}</p>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Carrier Name</label>
              <input 
                style={styles.input}
                placeholder="e.g. FedEx, BlueDart"
                value={trackingData.carrier}
                onChange={(e) => setTrackingData({...trackingData, carrier: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tracking ID</label>
              <input 
                style={styles.input}
                placeholder="Enter tracking number"
                value={trackingData.trackingId}
                onChange={(e) => setTrackingData({...trackingData, trackingId: e.target.value})}
              />
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setEditingTracking(false)} style={styles.cancelBtn}>Cancel</button>
              <button 
                onClick={() => updateStatus(selectedOrder.id, selectedOrder.status, trackingData)} 
                style={styles.saveBtn}
              >
                Save Tracking & Notify Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "clamp(24px, 5vw, 60px)",
    maxWidth: "1440px",
    margin: "0 auto",
    fontFamily: "var(--font-sans)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "48px",
    flexWrap: "wrap",
    gap: "24px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "2.4rem",
    fontWeight: 400,
    color: "#000",
    marginBottom: "12px",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: "0.8rem",
    color: "#888",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  filters: {
    flex: 1,
    maxWidth: "280px",
  },
  select: {
    width: "100%",
    padding: "14px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #e0e0e0",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    outline: "none",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  error: {
    padding: "16px",
    background: "#000",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    marginBottom: "32px",
    textTransform: "uppercase",
  },
  tableWrapper: {
    overflowX: "auto",
    background: "#fff",
    borderTop: "1px solid #000",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "24px 16px",
    fontSize: "0.65rem",
    fontWeight: 800,
    color: "#999",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    borderBottom: "1px solid #f2f2f2",
  },
  tr: {
    borderBottom: "1px solid #f2f2f2",
  },
  td: {
    padding: "24px 16px",
    fontSize: "0.9rem",
    color: "#000",
    verticalAlign: "middle",
  },
  ref: {
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "#000",
  },
  userName: {
    fontWeight: 600,
    marginBottom: "2px",
  },
  userEmail: {
    fontSize: "0.8rem",
    color: "#888",
  },
  itemsText: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#555",
  },
  total: {
    fontWeight: 700,
    fontSize: "1rem",
  },
  badge: {
    padding: "4px 12px",
    fontSize: "0.6rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  statusSelect: {
    border: "1px solid #eee",
    padding: "6px 10px",
    fontSize: "0.7rem",
    fontWeight: 600,
    background: "#fff",
    outline: "none",
    cursor: "pointer",
  },
  date: {
    fontSize: "0.8rem",
    color: "#888",
  },
  loading: { textAlign: "center", padding: "80px", color: "#888", fontSize: "0.8rem" },
  empty: { textAlign: "center", padding: "80px", color: "#ccc", fontSize: "0.8rem" },
  pagination: {
    marginTop: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "32px",
  },
  pageBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: 800,
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    padding: "8px 0",
    borderBottom: "1px solid #000",
  },
  pageInfo: {
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "0.2em",
    color: "#aaa",
  },
  trackBtn: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "4px",
    cursor: "pointer",
    padding: "6px 8px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "12px",
    boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
  },
  modalTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.8rem",
    margin: "0 0 8px",
    fontWeight: 400,
  },
  modalSubtitle: {
    fontSize: "0.8rem",
    color: "#888",
    marginBottom: "32px",
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "0.65rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#aaa",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "16px",
    border: "1px solid #eee",
    borderRadius: "8px",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "inherit",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    marginTop: "40px",
  },
  cancelBtn: {
    flex: 1,
    padding: "16px",
    background: "transparent",
    border: "1px solid #eee",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  saveBtn: {
    flex: 2,
    padding: "16px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};
