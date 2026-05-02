"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Swal from "sweetalert2";

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

  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  const [editData, setEditData] = useState({ trackingId: "", carrier: "", street: "", city: "", state: "", zip: "" });

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
        setEditingOrder(null);
      }
    } catch (err) {
      alert("Failed to update order");
    }
  };

  const openEditModal = (order: any) => {
    setEditingOrder(order);
    setEditData({
      trackingId: order.trackingId || "",
      carrier: order.carrier || "",
      street: order.shippingAddress?.street || "",
      city: order.shippingAddress?.city || "",
      state: order.shippingAddress?.state || "",
      zip: order.shippingAddress?.zip || "",
    });
  };

  const handleEditSubmit = () => {
    const trackingInfo = {
      trackingId: editData.trackingId,
      carrier: editData.carrier,
      shippingAddress: {
        ...editingOrder.shippingAddress,
        street: editData.street,
        city: editData.city,
        state: editData.state,
        zip: editData.zip
      }
    };
    updateStatus(editingOrder.id, editingOrder.status, trackingInfo);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "CAUTION: Are you sure you want to permanently delete this order? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#000",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchOrders();
        Swal.fire("Deleted!", "The order has been successfully removed.", "success");
      } else {
        Swal.fire("Error!", "Failed to delete order.", "error");
      }
    } catch (err) {
      Swal.fire("Error!", "Network error. Failed to delete.", "error");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Manage customer purchases and fulfillment cycles.</p>
        </div>
        <div style={styles.filters} className="admin-filter-row">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={styles.select}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
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
              <th style={styles.th}>Date</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={styles.loading}>
                <div className="loader"></div>
                Loading Orders...
              </td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={styles.empty}>No orders found in the system.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.ref}>#{order.id.toString().padStart(6, '0')}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.userName}>{order.user?.name || "Guest"}</div>
                    <div style={styles.userEmail}>{order.user?.email}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.itemsText}>{order.items?.length || 0} Items</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.total}>{formatPrice(order.total)}</div>
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
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={styles.statusSelect}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <button onClick={() => setViewingOrder(order)} style={styles.actionBtn} title="View">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button onClick={() => openEditModal(order)} style={styles.actionBtn} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(order.id)} style={{ ...styles.actionBtn, color: "#ff4d4f" }} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="admin-card-list" style={{ display: "none", flexDirection: "column", gap: 12 }}>
        {orders.map(order => (
          <div key={order.id} className="admin-card-item" style={styles.mobileCard}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={styles.ref}>#{order.id.toString().padStart(6, '0')}</span>
              <span style={{ ...styles.badge, ...STATUS_VARIANTS[order.status] }}>{order.status}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={styles.userName}>{order.user?.name || "Guest"}</div>
              <div style={styles.userEmail}>{order.user?.email}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
              <div style={styles.total}>{formatPrice(order.total)}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setViewingOrder(order)} style={styles.actionBtn}>View</button>
                <button onClick={() => openEditModal(order)} style={styles.actionBtn}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.pagination}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ ...styles.pageBtn, opacity: page === 1 ? 0.3 : 1 }}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>{page} / {pagination.totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
          disabled={page === pagination.totalPages}
          style={{ ...styles.pageBtn, opacity: page === pagination.totalPages ? 0.3 : 1 }}
        >
          Next
        </button>
      </div>

      {/* VIEW MODAL */}
      {viewingOrder && (
        <div style={styles.modalOverlay} onClick={() => setViewingOrder(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Order Details</h2>
              <button onClick={() => setViewingOrder(null)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalGrid}>
                <div>
                  <label style={styles.modalLabel}>Customer</label>
                  <p style={styles.modalValue}>{viewingOrder.user?.name || "Guest"}</p>
                  <p style={styles.modalSubValue}>{viewingOrder.user?.email}</p>
                  <p style={styles.modalSubValue}>{viewingOrder.shippingAddress?.phone}</p>
                </div>
                <div>
                  <label style={styles.modalLabel}>Shipping Address</label>
                  <p style={styles.modalValue}>{viewingOrder.shippingAddress?.street}</p>
                  <p style={styles.modalSubValue}>{viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.state} {viewingOrder.shippingAddress?.zip}</p>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <label style={styles.modalLabel}>Items</label>
                <div style={styles.itemList}>
                  {viewingOrder.items?.map((item: any) => (
                    <div key={item.id} style={styles.itemRow}>
                      <span style={{ fontWeight: 600 }}>{item.productName}</span>
                      <span style={{ color: "#888" }}>x{item.quantity}</span>
                      <span style={{ marginLeft: "auto", fontWeight: 700 }}>{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.modalTotal}>
                <span>Total Amount</span>
                <span>{formatPrice(viewingOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingOrder && (
        <div style={styles.modalOverlay} onClick={() => setEditingOrder(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Update Order</h2>
              <button onClick={() => setEditingOrder(null)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Carrier</label>
                  <input style={styles.input} value={editData.carrier} onChange={e => setEditData({ ...editData, carrier: e.target.value })} placeholder="e.g. FedEx" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tracking ID</label>
                  <input style={styles.input} value={editData.trackingId} onChange={e => setEditData({ ...editData, trackingId: e.target.value })} placeholder="TRK123..." />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                  <label style={styles.label}>Street Address</label>
                  <input style={styles.input} value={editData.street} onChange={e => setEditData({ ...editData, street: e.target.value })} />
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button onClick={() => setEditingOrder(null)} style={styles.cancelBtn}>Cancel</button>
                <button onClick={handleEditSubmit} style={styles.saveBtn}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
    padding: "20px 0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    gap: "20px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#111",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#666",
    margin: "4px 0 0",
  },
  filters: {
    minWidth: "200px",
  },
  select: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "0.875rem",
    fontWeight: 500,
    background: "#fff",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
  },
  error: {
    padding: "12px 16px",
    background: "#fff1f0",
    border: "1px solid #ffa39e",
    color: "#cf1322",
    borderRadius: "8px",
    fontSize: "0.875rem",
    marginBottom: "24px",
  },
  tableWrapper: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.875rem",
  },
  th: {
    padding: "16px 20px",
    textAlign: "left",
    background: "#fafafa",
    color: "#888",
    fontWeight: 600,
    borderBottom: "1px solid #f0f0f0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontSize: "0.75rem",
  },
  tr: {
    borderBottom: "1px solid #f5f5f5",
    transition: "background 0.2s",
  },
  td: {
    padding: "16px 20px",
    verticalAlign: "middle",
  },
  ref: {
    fontWeight: 700,
    color: "#111",
    fontFamily: "monospace",
    fontSize: "0.95rem",
  },
  userName: {
    fontWeight: 600,
    color: "#111",
  },
  userEmail: {
    fontSize: "0.8rem",
    color: "#888",
    marginTop: "2px",
  },
  itemsText: {
    color: "#666",
  },
  total: {
    fontWeight: 700,
    color: "#111",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    display: "inline-block",
  },
  date: {
    color: "#888",
    fontSize: "0.8rem",
  },
  statusSelect: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
    fontSize: "0.75rem",
    background: "#fff",
    outline: "none",
  },
  actionBtn: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    border: "1px solid #eee",
    background: "#fff",
    cursor: "pointer",
    color: "#666",
    transition: "all 0.2s",
    padding: 0,
  },
  loading: {
    padding: "60px",
    textAlign: "center",
    color: "#999",
  },
  empty: {
    padding: "60px",
    textAlign: "center",
    color: "#999",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    marginTop: "32px",
  },
  pageBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    background: "#fff",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  pageInfo: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#888",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "24px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.25rem",
    cursor: "pointer",
    color: "#999",
  },
  modalBody: {
    padding: "24px",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  modalLabel: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#999",
    textTransform: "uppercase",
    marginBottom: "8px",
    letterSpacing: "0.05em",
  },
  modalValue: {
    margin: 0,
    fontWeight: 600,
    color: "#111",
  },
  modalSubValue: {
    margin: "4px 0 0",
    fontSize: "0.875rem",
    color: "#666",
  },
  itemList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#fafafa",
    padding: "16px",
    borderRadius: "12px",
  },
  itemRow: {
    display: "flex",
    gap: "12px",
    fontSize: "0.875rem",
  },
  modalTotal: {
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "2px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 800,
    fontSize: "1.1rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#666",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border 0.2s",
  },
  modalFooter: {
    marginTop: "32px",
    display: "flex",
    gap: "12px",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    background: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  saveBtn: {
    flex: 2,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#000",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
