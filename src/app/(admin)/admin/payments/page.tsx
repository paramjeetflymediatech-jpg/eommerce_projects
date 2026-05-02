"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

const STATUS_VARIANTS: any = {
  PENDING: { color: "#8E8E93", background: "#F1F1F2" },
  PROCESSING: { color: "#007AFF", background: "#E5F1FF" },
  SHIPPED: { color: "#AF52DE", background: "#F6ECFB" },
  DELIVERED: { color: "#34C759", background: "#ECF9F0" },
  CANCELLED: { color: "#FF3B30", background: "#FFEBEA" },
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?page=${page}&paymentMethod=${methodFilter}`);
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments || []);
        setPagination(data.pagination || { totalPages: 1 });
        setTotalAmount(data.totalAmount || 0);
      } else {
        setError(data.error || "Failed to fetch payments");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, methodFilter]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Payments</h1>
          <p style={styles.subtitle}>Track incoming transactions and cash flow.</p>
        </div>
        <div style={styles.filters} className="admin-filter-row">
          <select 
            value={methodFilter} 
            onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }} 
            style={styles.select}
          >
            <option value="ALL">All Methods</option>
            <option value="PHONEPE">Prepaid (PhonePe)</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
      </header>

      {/* Stats Card */}
      <div style={styles.statsCard}>
        <div style={styles.statLabel}>Total {methodFilter === "ALL" ? "" : methodFilter === "PHONEPE" ? "Prepaid" : "COD"} Revenue</div>
        <div style={styles.statValue}>{formatPrice(totalAmount)}</div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.tableWrapper} className="admin-table-wrap">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order Ref</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Transaction ID</th>
              <th style={styles.th}>Date</th>
              <th style={{...styles.th, textAlign: "right"}}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={styles.loading}>Loading records...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={7} style={styles.empty}>No payment records found.</td></tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.ref}>#{payment.id.toString().padStart(6, "0")}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.userName}>{payment.user?.name || "Guest"}</div>
                    <div style={styles.userEmail}>{payment.user?.email}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: payment.paymentMethod === "COD" ? "#fff7e6" : "#e6f7ff",
                      color: payment.paymentMethod === "COD" ? "#d46b08" : "#096dd9",
                      border: `1px solid ${payment.paymentMethod === "COD" ? "#ffd591" : "#91d5ff"}`
                    }}>
                      {payment.paymentMethod === "PHONEPE" ? "Prepaid" : payment.paymentMethod}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge, 
                      ...STATUS_VARIANTS[payment.status]
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.txnId}>{payment.stripePaymentId || payment.stripeSessionId || "—"}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.date}>{new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td style={{...styles.td, textAlign: "right"}}>
                    <div style={styles.total}>{formatPrice(payment.total)}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
  statsCard: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    padding: "24px",
    marginBottom: "32px",
    borderRadius: "12px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "#888",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#111",
    letterSpacing: "-0.02em",
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
  txnId: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "#666",
    background: "#fafafa",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #eee",
  },
  date: {
    color: "#888",
    fontSize: "0.8rem",
  },
  loading: { textAlign: "center", padding: "80px", color: "#888", fontSize: "0.875rem" },
  empty: { textAlign: "center", padding: "80px", color: "#ccc", fontSize: "0.875rem" },
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
};
