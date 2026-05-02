"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { formatPrice } from "@/lib/utils";

export default function AdminCouponsPage() {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "FIXED",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setCoupons(data.coupons || []);
      } else {
        Swal.fire({ title: "Error", text: data.error || "Failed to fetch coupons", icon: "error" });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: "Network failure", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async () => {
    if (!form.code || !form.discountValue) {
      Swal.fire({ title: "Notice", text: "Code and Discount Value are required", icon: "warning" });
      return;
    }

    setSaving(true);
    try {
      const url = editId ? `/api/admin/coupons/${editId}` : "/api/admin/coupons";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowForm(false);
        setEditId(null);
        resetForm();
        fetchCoupons();
        Swal.fire({ title: "Success", text: `Coupon ${editId ? "updated" : "created"} successfully`, icon: "success" });
      } else {
        const data = await res.json();
        Swal.fire({ title: "Error", text: data.error || "Failed to save coupon", icon: "error" });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: "Save failed", icon: "error" });
    } finally {
      setSaving(false);
    }
  };

  const deleteCoupon = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the coupon.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCoupons();
        Swal.fire({ title: "Deleted", icon: "success" });
      } else {
        const data = await res.json();
        Swal.fire({ title: "Error", text: data.error || "Delete failed", icon: "error" });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: "Delete failed", icon: "error" });
    }
  };

  const resetForm = () => {
    setForm({
      code: "",
      description: "",
      discountType: "FIXED",
      discountValue: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      expiryDate: "",
      usageLimit: "",
      isActive: true,
    });
  };

  const handleEdit = (coupon: any) => {
    setEditId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount?.toString() || "",
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : "",
      usageLimit: coupon.usageLimit?.toString() || "",
      isActive: coupon.isActive,
    });
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Coupons</h1>
          <p style={styles.subtitle}>Create and manage promotional codes for your store.</p>
        </div>
        <button
          onClick={() => { setEditId(null); resetForm(); setShowForm(true); }}
          style={styles.addBtn}
        >
          Generate Coupon
        </button>
      </header>

      <div style={styles.tableWrapper} className="admin-table-wrap">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Value</th>
              <th style={styles.th}>Usage</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Expiry</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={styles.loading}>Loading coupons...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={7} style={styles.empty}>No coupons found.</td></tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.codeText}>{coupon.code}</div>
                    <div style={styles.descText}>{coupon.description || "No description"}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>{coupon.discountType}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.valueText}>
                      {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.usageText}>
                      {coupon.usedCount} / {coupon.usageLimit || "∞"}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.statusBadge, 
                      background: coupon.isActive ? "#e6f4ea" : "#fff1f0",
                      color: coupon.isActive ? "#1e7e34" : "#cf1322"
                    }}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.dateText}>
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Never"}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                      <button onClick={() => handleEdit(coupon)} style={styles.actionBtn} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => deleteCoupon(coupon.id)} style={{ ...styles.actionBtn, color: "#cf1322" }} title="Delete">
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

      {/* Modal */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editId ? "Edit Coupon" : "Create Coupon"}</h2>
              <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                  <label style={styles.label}>Coupon Code</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. SUMMER25"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Discount Type</label>
                  <select
                    style={styles.input}
                    value={form.discountType}
                    onChange={e => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="FIXED">Fixed Amount</option>
                    <option value="PERCENTAGE">Percentage</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Discount Value</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="e.g. 20"
                    value={form.discountValue}
                    onChange={e => setForm({ ...form, discountValue: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Min Order Amount</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="0.00"
                    value={form.minOrderAmount}
                    onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Usage Limit</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Unlimited"
                    value={form.usageLimit}
                    onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Expiry Date</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={form.expiryDate}
                    onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <div style={{ display: "flex", gap: "20px", marginTop: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.875rem" }}>
                      <input type="radio" checked={form.isActive} onChange={() => setForm({...form, isActive: true})} /> Active
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.875rem" }}>
                      <input type="radio" checked={!form.isActive} onChange={() => setForm({...form, isActive: false})} /> Inactive
                    </label>
                  </div>
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    style={{ ...styles.input, minHeight: "80px", resize: "none" }}
                    placeholder="Notes about this coupon..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
                  {saving ? "Saving..." : editId ? "Update Coupon" : "Create Coupon"}
                </button>
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
  addBtn: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
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
  codeText: {
    fontWeight: 700,
    color: "#111",
    letterSpacing: "0.05em",
    fontFamily: "monospace",
    fontSize: "1rem",
  },
  descText: {
    fontSize: "0.75rem",
    color: "#888",
    marginTop: "4px",
  },
  typeBadge: {
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "4px 8px",
    background: "#f0f0f0",
    color: "#333",
    borderRadius: "4px",
    textTransform: "uppercase",
  },
  valueText: {
    fontWeight: 700,
    color: "#111",
  },
  usageText: {
    color: "#666",
    fontSize: "0.8rem",
    fontWeight: 500,
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    display: "inline-block",
  },
  dateText: {
    color: "#888",
    fontSize: "0.8rem",
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
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border 0.2s",
    width: "100%",
    boxSizing: "border-box",
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
  loading: { textAlign: "center", padding: "80px", color: "#888", fontSize: "0.875rem" },
  empty: { textAlign: "center", padding: "80px", color: "#ccc", fontSize: "0.875rem" },
};
