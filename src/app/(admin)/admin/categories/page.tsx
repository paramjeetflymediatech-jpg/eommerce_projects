"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AdminCategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ name: "", description: "", parentId: "", image: "" });
  const [saving, setSaving] = useState(false);

  interface CategoryNode {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parentId: number | null;
    image?: string;
    children: CategoryNode[];
  }

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories?page=${page}&limit=10`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
        setPagination(data.pagination);
      } else {
        Swal.fire({ title: "NOTICE", text: data.error || "Failed to fetch categories", icon: "error", confirmButtonColor: "#000" });
      }
    } catch (err) {
      Swal.fire({ title: "ERROR", text: "Network failure", icon: "error", confirmButtonColor: "#000" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllForDropdown = async () => {
    try {
      const res = await fetch("/api/admin/categories?all=true", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setAllCategories(data.categories || []);
    } catch (err) { console.error("Dropdown fetch error", err); }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAllForDropdown();
  }, []);

  const handleSave = async () => {
    if (!form.name) {
      Swal.fire({ title: "NOTICE", text: "Name is required", icon: "warning", confirmButtonColor: "#000" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: editId,
          parentId: form.parentId ? parseInt(form.parentId) : null
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setEditId(null);
        setForm({ name: "", description: "", parentId: "", image: "" });
        fetchCategories(currentPage);
        fetchAllForDropdown();
        Swal.fire({
          title: "SUCCESS",
          text: `Category ${editId ? "updated" : "defined"} successfully.`,
          icon: "success",
          confirmButtonColor: "#000"
        });
      } else {
        const data = await res.json();
        Swal.fire({
          title: "NOTICE",
          text: data.error || "Failed to save category",
          icon: "error",
          confirmButtonColor: "#000"
        });
      }
    } catch (err) {
      Swal.fire({ title: "ERROR", text: "Save failed", icon: "error", confirmButtonColor: "#000" });
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Subcategories must be deleted first.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories(currentPage);
        fetchAllForDropdown();
        Swal.fire({ title: "DELETED", icon: "success", confirmButtonColor: "#000" });
      } else {
        const data = await res.json();
        Swal.fire({ title: "ERROR", text: data.error || "Delete failed", icon: "error", confirmButtonColor: "#000" });
      }
    } catch (err) {
      Swal.fire({ title: "ERROR", text: "Delete failed", icon: "error", confirmButtonColor: "#000" });
    }
  };

  const buildTree = (cats: any[], pId: number | null = null): CategoryNode[] => {
    return cats
      .filter(c => c.parentId === pId)
      .map(c => ({
        ...c,
        children: buildTree(cats, c.id)
      }));
  };

  const categoryTree = buildTree(allCategories);

  return (
    <div style={styles.container}>
      <header style={styles.header} className="admin-action-header">
        <div>
          <h1 style={styles.title}>Inventory Taxonomy</h1>
          <p style={styles.subtitle}>First define root categories, then expand into sub-disciplines.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => { setEditId(null); setForm({ name: "", description: "", parentId: "", image: "" }); setShowForm(true); }}
            style={styles.addBtn}
          >
            Define Root Class
          </button>
          <button
            onClick={() => {
              if (categories.length === 0) {
                Swal.fire({ title: "GUIDANCE", text: "You must first define a Root Category before branching into sub-disciplines.", icon: "info", confirmButtonColor: "#000" });
                return;
              }
              setEditId(null);
              setForm({ name: "", description: "", parentId: String(categories[0].id), image: "" });
              setShowForm(true);
            }}
            style={{ ...styles.addBtn, background: "transparent", color: "#000", border: "1px solid #000" }}
          >
            Define Sub-Class
          </button>
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid} className="admin-cat-grid">
        {/* Main Category Table */}
        <div style={styles.tableCol}>
          <div style={styles.tableWrapper} className="admin-table-wrap">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Taxon Name</th>
                  <th style={styles.th}>Classification</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={styles.loading}>Indexing...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={4} style={styles.empty}>No taxonomy defined.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.catName}>{cat.name}</div>
                        <div style={styles.catSlug}>{cat.slug}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.parentBadge}>
                          {cat.parentId ? categories.find(p => p.id === cat.parentId)?.name : "Root"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.descText}>{cat.description || "—"}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 16 }}>
                          <button onClick={() => { setEditId(cat.id); setForm({ name: cat.name, description: cat.description || "", parentId: cat.parentId ? String(cat.parentId) : "", image: cat.image || "" }); setShowForm(true); }} style={styles.iconBtn} title="Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => deleteCategory(cat.id)} style={styles.deleteBtn} title="Delete">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div style={styles.pagination}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.3 : 1 }}>PREV</button>
                <div style={styles.pageInfo}>{currentPage} <span style={{ color: "#ccc" }}>/</span> {pagination.totalPages}</div>
                <button disabled={currentPage === pagination.totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ ...styles.pageBtn, opacity: currentPage === pagination.totalPages ? 0.3 : 1 }}>NEXT</button>
              </div>
            )}
          </div>

          {/* Mobile card list */}
          <div className="admin-card-list" style={{ flexDirection: "column", display: "none" }}>
            {loading && <div style={{ textAlign: "center", padding: 40, color: "#888", fontSize: "0.85rem" }}>Indexing...</div>}
            {!loading && categories.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#ccc", fontSize: "0.85rem" }}>No taxonomy defined.</div>}
            {!loading && categories.map((cat) => (
              <div key={cat.id} className="admin-card-item">
                <div className="admin-card-row">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#000" }}>{cat.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "#bbb", fontFamily: "monospace", marginTop: 2 }}>{cat.slug}</div>
                  </div>
                  <span style={styles.parentBadge}>{cat.parentId ? categories.find(p => p.id === cat.parentId)?.name : "Root"}</span>
                </div>
                {cat.description && (
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>{cat.description}</div>
                )}
                <div className="admin-card-actions">
                  <button
                    onClick={() => { setEditId(cat.id); setForm({ name: cat.name, description: cat.description || "", parentId: cat.parentId ? String(cat.parentId) : "", image: cat.image || "" }); setShowForm(true); }}
                    style={{ flex: 1, background: "none", border: "1px solid #ddd", padding: "8px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                  >Edit</button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    style={{ flex: 1, background: "none", border: "1px solid #fee2e2", color: "#dc2626", padding: "8px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                  >Delete</button>
                </div>
              </div>
            ))}
            {/* Mobile pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", gap: 12 }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.3 : 1, flex: 1, border: "1px solid #eee", padding: "10px" }}>← PREV</button>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{currentPage} / {pagination.totalPages}</span>
                <button disabled={currentPage === pagination.totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ ...styles.pageBtn, opacity: currentPage === pagination.totalPages ? 0.3 : 1, flex: 1, border: "1px solid #eee", padding: "10px" }}>NEXT →</button>
              </div>
            )}
          </div>
        </div>

        {/* Visual Tree Preview */}
        <div style={styles.treeCol} className="admin-cat-tree">
          <div style={styles.treeCard}>
            <h3 style={styles.treeTitle}>Global Structure</h3>
            <div style={styles.treeContent}>
              {categoryTree.map((cat: any) => (
                <TreeNode key={cat.id} node={cat} />
              ))}
              {categoryTree.length === 0 && <p style={{ fontSize: "0.7rem", color: "#ccc" }}>No structure detected.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={styles.overlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editId ? "Modify Class" : "Define New Class"}</h2>
              <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.lbl}>Category Name *</label>
              <input
                style={styles.inp}
                placeholder="e.g., Electronics"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.lbl}>Parent Category (Optional / For Subcategories)</label>
              <select
                style={styles.inp}
                value={form.parentId}
                onChange={e => setForm({ ...form, parentId: e.target.value })}
              >
                <option value="">None (Top Level)</option>
                {allCategories
                  .filter(c => c.id !== editId)
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.lbl}>Description</label>
              <textarea
                style={{ ...styles.inp, minHeight: "80px", resize: "vertical" }}
                placeholder="Taxonomy details..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.lbl}>Image (URL or Local Upload)</label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  style={{ ...styles.inp, flex: 1, minWidth: "200px" }}
                  placeholder="https://... or upload local file ->"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSaving(true);
                    const formData = new FormData();
                    formData.append("folder", "categories");
                    formData.append("files", file);
                    try {
                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                      const data = await res.json();
                      if (res.ok && data.urls?.length) {
                        setForm(f => ({ ...f, image: data.urls[0] }));
                        Swal.fire({ title: "UPLOADED", text: "Image uploaded successfully", icon: "success", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
                      } else {
                        Swal.fire({ title: "ERROR", text: data.error || "Upload failed", icon: "error", confirmButtonColor: "#000" });
                      }
                    } catch (err) {
                      Swal.fire({ title: "ERROR", text: "Network failure", icon: "error", confirmButtonColor: "#000" });
                    } finally {
                      setSaving(false);
                      e.target.value = '';
                    }
                  }}
                  style={{ fontSize: "0.75rem", background: "#f0f0f0", padding: "8px", borderRadius: "4px", cursor: "pointer" }}
                />
              </div>
              {form.image && (
                <div style={{ marginTop: "16px" }}>
                  <img src={form.image} alt="Preview" style={{ maxHeight: "80px", borderRadius: "4px", border: "1px solid #eee", objectFit: "cover" }} />
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Processing..." : "Commit Taxonomy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TreeNode({ node }: { node: any }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: "12px", borderLeft: "1px solid #f0f0f0", paddingLeft: "12px" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 0",
          cursor: hasChildren ? "pointer" : "default"
        }}
      >
        <span style={{ fontSize: "10px", color: "#ccc" }}>{hasChildren ? (open ? "▼" : "▶") : "•"}</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#000" }}>{node.name}</span>
      </div>
      {hasChildren && open && (
        <div>
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} />
          ))}
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
    fontSize: "0.8rem",
    color: "#888",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  addBtn: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "16px 32px",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "transform 0.2s",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "clamp(280px, 1fr, 100%) 300px",
    gap: "40px",
    alignItems: "start",
  },
  tableCol: {
    minWidth: 0,
  },
  treeCol: {
    position: "sticky",
    top: "100px",
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
  },
  catName: { fontWeight: 600, marginBottom: "2px" },
  catSlug: { fontSize: "0.75rem", color: "#ccc", fontFamily: "monospace" },
  parentBadge: {
    fontSize: "0.6rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    padding: "4px 8px",
    background: "#f7f7f7",
    color: "#888",
  },
  descText: { fontSize: "0.85rem", color: "#888" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, color: "#ccc" },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "24px 16px",
    gap: "16px",
    borderTop: "1px solid #f2f2f2"
  },
  pageBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.6rem",
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "#000"
  },
  pageInfo: {
    fontSize: "0.75rem",
    fontWeight: 600,
    fontFamily: "monospace"
  },
  treeCard: {
    background: "#fff",
    border: "1px solid #eee",
    padding: "24px",
  },
  treeTitle: {
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    marginBottom: "24px",
    color: "#888",
  },
  treeContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(5px)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    background: "#fff",
    width: "100%",
    maxWidth: "540px",
    padding: "clamp(24px, 5vw, 60px)",
    border: "1px solid #000",
    boxShadow: "0 40px 100px rgba(0,0,0,0.1)",
    maxHeight: "90vh",
    overflowY: "auto",
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
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#000",
  },
  formGroup: { marginBottom: "32px" },
  lbl: {
    fontSize: "0.6rem",
    fontWeight: 800,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: "12px",
    display: "block",
  },
  inp: {
    width: "100%",
    padding: "16px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #000",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
  },
  saveBtn: {
    width: "100%",
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "20px 0",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    cursor: "pointer",
    marginTop: "16px",
  },
  loading: { textAlign: "center", padding: "80px", color: "#888", fontSize: "0.75rem" },
  empty: { textAlign: "center", padding: "80px", color: "#ccc", fontSize: "0.75rem" },
};
