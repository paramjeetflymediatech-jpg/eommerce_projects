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
      <header style={styles.header} className="admin-action-header">
        <div>
          <h1 style={styles.title}>Coupons & Discounts</h1>
          <p style={styles.subtitle}>Manage promotional codes and gift card credits.</p>
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
              <th style={styles.th}>Actions</th>
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
                    <div style={{ fontWeight: 700, letterSpacing: "0.05em" }}>{coupon.code}</div>
                    <div style={{ fontSize: "0.7rem", color: "#888", marginTop: 2 }}>{coupon.description || "No description"}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{coupon.discountType}</span>
                  </td>
                  <td style={styles.td}>
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)}
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontSize: "0.85rem" }}>
                      {coupon.usedCount} / {coupon.usageLimit || "∞"}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.statusBadge, 
                      background: coupon.isActive ? "#e6f4ea" : "#fce8e6",
                      color: coupon.isActive ? "#1e7e34" : "#d93025"
                    }}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "Never"}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => handleEdit(coupon)} style={styles.iconBtn}>Edit</button>
                      <button onClick={() => deleteCoupon(coupon.id)} style={{ ...styles.iconBtn, color: "#d93025" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={styles.overlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editId ? "Edit Coupon" : "Generate Coupon"}</h2>
              <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.lbl}>Coupon Code *</label>
                <input
                  style={styles.inp}
                  placeholder="e.g. SUMMER20"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.lbl}>Discount Type *</label>
                <select
                  style={styles.inp}
                  value={form.discountType}
                  onChange={e => setForm({ ...form, discountType: e.target.value })}
                >
                  <option value="FIXED">Fixed Amount</option>
                  <option value="PERCENTAGE">Percentage</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.lbl}>Discount Value *</label>
                <input
                  style={styles.inp}
                  type="number"
                  placeholder={form.discountType === "PERCENTAGE" ? "20 (%)" : "50 ($)"}
                  value={form.discountValue}
                  onChange={e => setForm({ ...form, discountValue: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.lbl}>Min Order Amount ($)</label>
                <input
                  style={styles.inp}
                  type="number"
                  placeholder="0.00"
                  value={form.minOrderAmount}
                  onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.lbl}>Max Discount (For %)</label>
                <input
                  style={styles.inp}
                  type="number"
                  placeholder="No limit"
                  value={form.maxDiscountAmount}
                  onChange={e => setForm({ ...form, maxDiscountAmount: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.lbl}>Usage Limit</label>
                <input
                  style={styles.inp}
                  type="number"
                  placeholder="Unlimited"
                  value={form.usageLimit}
                  onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.lbl}>Expiry Date</label>
                <input
                  style={styles.inp}
                  type="date"
                  value={form.expiryDate}
                  onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.lbl}>Status</label>
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="radio" checked={form.isActive} onChange={() => setForm({...form, isActive: true})} /> Active
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="radio" checked={!form.isActive} onChange={() => setForm({...form, isActive: false})} /> Inactive
                  </label>
                </div>
              </div>

              <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                <label style={styles.lbl}>Description</label>
                <textarea
                  style={{ ...styles.inp, minHeight: "60px", resize: "none" }}
                  placeholder="Internal notes or user-facing description..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Saving..." : editId ? "Update Coupon" : "Generate Coupon"}
            </button>
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
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "48px",
    gap: "24px",
    flexWrap: "wrap",
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
    fontWeight: 500,
  },
  addBtn: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "16px 32px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  tableWrapper: {
    background: "#fff",
    borderTop: "1px solid #000",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "24px 16px",
    fontSize: "0.75rem",
    fontWeight: 800,
    color: "#999",
    borderBottom: "1px solid #f2f2f2",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: {
    borderBottom: "1px solid #f2f2f2",
  },
  td: {
    padding: "24px 16px",
    fontSize: "0.9rem",
    color: "#000",
  },
  badge: {
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "4px 8px",
    background: "#f0f0f0",
    color: "#000",
    borderRadius: "2px",
  },
  statusBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "12px",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 700,
    padding: 0,
    color: "#000",
    textDecoration: "underline",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(4px)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    background: "#fff",
    width: "100%",
    maxWidth: "600px",
    padding: "40px",
    border: "1px solid #000",
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  modalTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.8rem",
    fontWeight: 400,
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  formGroup: { marginBottom: "20px" },
  lbl: {
    fontSize: "0.75rem",
    fontWeight: 800,
    color: "#888",
    marginBottom: "8px",
    display: "block",
    textTransform: "uppercase",
  },
  inp: {
    width: "100%",
    padding: "12px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #eee",
    fontSize: "1rem",
    outline: "none",
    fontFamily: "inherit",
  },
  saveBtn: {
    width: "100%",
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "18px 0",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "24px",
  },
  loading: { textAlign: "center", padding: "80px", color: "#888" },
  empty: { textAlign: "center", padding: "80px", color: "#ccc" },
};
