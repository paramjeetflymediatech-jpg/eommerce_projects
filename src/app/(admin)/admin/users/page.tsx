"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        setPagination(data.pagination || { totalPages: 1 });
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editUser.id,
          name: editForm.name,
          role: editForm.role
        }),
      });
      if (res.ok) {
        setEditUser(null);
        fetchUsers();
        Swal.fire({ title: "Success", text: "Profile updated.", icon: "success", confirmButtonColor: "#000" });
      } else {
        const data = await res.json();
        Swal.fire({ title: "Notice", text: data.error || "Update failed", icon: "error", confirmButtonColor: "#000" });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: "Update failed", icon: "error", confirmButtonColor: "#000" });
    }
  };

  const toggleVerification = async (id: number, current: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVerified: !current }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const deleteUser = async (id: number) => {
    const result = await Swal.fire({
      title: "Deactivate Identity",
      text: "This operation will permanently remove the account access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
        Swal.fire({ title: "Removed", icon: "success", confirmButtonColor: "#000" });
      } else {
        const data = await res.json();
        Swal.fire({ title: "Notice", text: data.message || "Delete failed", icon: "info", confirmButtonColor: "#000" });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: "Delete failed", icon: "error", confirmButtonColor: "#000" });
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>User Management</h1>
          <p style={styles.subtitle}>Administrative access to customer accounts and roles.</p>
        </div>
        <div style={styles.actions}>
          <input
            type="text"
            placeholder="Search identity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Identity</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={styles.loading}>Processing...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={styles.empty}>No accounts found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userEmail}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: user.role === "ADMIN" ? "#000" : "#f0f0f0",
                      color: user.role === "ADMIN" ? "#fff" : "#000"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => toggleVerification(user.id, user.isVerified)}
                      style={{
                        ...styles.statusBtn,
                        color: user.isVerified ? "#00a36c" : "#e0e0e0"
                      }}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </button>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.date}>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 20 }}>
                      <button
                        onClick={() => { setEditUser(user); setEditForm({ name: user.name, role: user.role }); }}
                        style={styles.iconBtn}
                        title="Edit User"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        style={{
                          ...styles.iconBtn,
                          color: user.email === (session as any)?.user?.email ? "#eee" : "#000"
                        }}
                        disabled={user.email === (session as any)?.user?.email}
                        title="Delete User"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div style={styles.overlay} onClick={() => setEditUser(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Adjust Identity</h2>
              <button onClick={() => setEditUser(null)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.lbl}>Full Name</label>
              <input
                style={styles.inp}
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.lbl}>Access Role</label>
              <select
                style={styles.inp}
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <option value="USER">User (Storefront access)</option>
                <option value="ADMIN">Admin (Portal access)</option>
              </select>
            </div>
            <button
              onClick={handleUpdateUser}
              style={styles.saveBtn}
            >
              Update Security Profile
            </button>
          </div>
        </div>
      )}

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
    fontSize: "0.85rem",
    color: "#888",
    letterSpacing: "normal",
    fontWeight: 500,
  },
  actions: {
    flex: 1,
    maxWidth: "350px",
  },
  search: {
    width: "100%",
    padding: "14px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #e0e0e0",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.3s",
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
    transition: "background 0.2s",
  },
  td: {
    padding: "24px 16px",
    fontSize: "0.9rem",
    color: "#000",
  },
  avatar: {
    width: "40px",
    height: "40px",
    background: "#f7f7f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#000",
    border: "1px solid #f0f0f0",
  },
  userName: {
    fontWeight: 600,
    marginBottom: "2px",
  },
  userEmail: {
    fontSize: "0.8rem",
    color: "#888",
  },
  badge: {
    padding: "6px 12px",
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "0.1em",
  },
  statusBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 700,
    padding: 0,
    letterSpacing: "normal",
  },
  date: {
    fontSize: "0.8rem",
    color: "#888",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ccc",
    fontSize: "0.8rem",
    fontWeight: 800,
    letterSpacing: "normal",
    transition: "color 0.2s",
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
    fontWeight: 800,
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
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    color: "#000",
    display: "flex",
    alignItems: "center",
    transition: "transform 0.2s, opacity 0.2s",
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
    maxWidth: "500px",
    padding: "60px",
    border: "1px solid #000",
    boxShadow: "0 30px 90px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "48px",
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
    fontSize: "1rem",
    cursor: "pointer",
    color: "#000",
  },
  formGroup: {
    marginBottom: "32px",
  },
  inp: {
    width: "100%",
    padding: "16px 0",
    border: "none",
    borderBottom: "1px solid #000",
    fontSize: "1rem",
    fontFamily: "inherit",
    outline: "none",
    background: "transparent",
  },
  lbl: {
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "normal",
    marginBottom: "8px",
    display: "block",
  },
  saveBtn: {
    width: "100%",
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "20px 0",
    fontSize: "0.9rem",
    fontWeight: 600,
    letterSpacing: "normal",
    cursor: "pointer",
    marginTop: "16px",
    transition: "background 0.3s",
  },
};
