"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

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
          <p style={styles.subtitle}>Track incoming transactions and cash on delivery records.</p>
        </div>
        <div style={styles.filters} className="admin-filter-row">
          <select 
            value={methodFilter} 
            onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }} 
            style={styles.select}
          >
            <option value="ALL">All Payment Methods</option>
            <option value="PHONEPE">Prepaid (PhonePe)</option>
            <option value="COD">Cash on Delivery (COD)</option>
          </select>
        </div>
      </header>

      {/* Aggregate Stats */}
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
              <th style={styles.th}>Payment Method</th>
              <th style={styles.th}>Order Status</th>
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
                      background: payment.paymentMethod === "COD" ? "#FFF4E5" : "#E5F1FF",
                      color: payment.paymentMethod === "COD" ? "#B25E02" : "#0056B3"
                    }}>
                      {payment.paymentMethod === "PHONEPE" ? "Prepaid (PhonePe)" : payment.paymentMethod === "COD" ? "COD" : payment.paymentMethod || "UNKNOWN"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, background: "#f5f5f5", color: "#666"}}>{payment.status}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.txnId}>{payment.stripePaymentId || payment.stripeSessionId || "N/A"}</span>
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
          style={styles.pageBtn}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>Page {page} of {pagination.totalPages}</span>
        <button 
          onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} 
          disabled={page === pagination.totalPages}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>
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
    marginBottom: "32px",
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
    fontSize: "0.85rem",
    color: "#888",
    letterSpacing: "normal",
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
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    outline: "none",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  statsCard: {
    background: "#fff",
    border: "1px solid #eee",
    padding: "24px",
    marginBottom: "32px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "#888",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#000"
  },
  error: {
    padding: "16px",
    background: "#000",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    marginBottom: "32px",
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
    fontSize: "0.8rem",
    fontWeight: 800,
    color: "#999",
    letterSpacing: "normal",
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
  total: {
    fontWeight: 800,
    fontSize: "0.95rem",
  },
  badge: {
    padding: "6px 12px",
    fontSize: "0.75rem",
    fontWeight: 800,
    letterSpacing: "normal",
    borderRadius: "4px"
  },
  txnId: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "#666",
    background: "#f9f9f9",
    padding: "4px 8px",
    border: "1px solid #eee",
    borderRadius: "4px"
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
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#000",
    letterSpacing: "normal",
    padding: "8px 0",
    borderBottom: "1px solid #000",
  },
  pageInfo: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "normal",
    color: "#aaa",
  },
};
