"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { getColorFromName } from "@/lib/colors";

interface Category { id: number; name: string; parentId: number | null; }

// A single variant row: one size entry within a color group
interface VariantRow {
  id?: number;
  size: string;
  stock: string;
  price: string;
  comparePrice: string;
  sku: string;
}

// A color group holds variant rows + images for that color
interface ColorGroup {
  color: string;
  description: string;      // per-color description override
  images: string[];         // per-color images
  variants: VariantRow[];
}

interface Product {
  id: number; name: string; slug: string; price: number;
  comparePrice?: number; stock: number; isFeatured: boolean;
  images: string[]; category?: { name: string };
  variants?: any[];
}

const emptyRow = (): VariantRow => ({ size: "", stock: "0", price: "", comparePrice: "", sku: "" });

const emptyGroup = (): ColorGroup => ({
  color: "",
  description: "",
  images: [],
  variants: [emptyRow()],
});

const emptyForm = () => ({
  name: "", slug: "", description: "", price: "", comparePrice: "",
  stock: "", categoryId: "",
  imageUrls: Array(10).fill("") as string[],
  isFeatured: false,
  colorGroups: [] as ColorGroup[],
});

// Convert flat variants array → color groups
function variantsToGroups(variants: any[]): ColorGroup[] {
  const map = new Map<string, ColorGroup>();
  for (const v of variants) {
    const key = (v.color || "").trim();
    if (!map.has(key)) {
      map.set(key, {
        color: key,
        description: "",
        images: Array.isArray(v.images) ? v.images : [],
        variants: [],
      });
    }
    map.get(key)!.variants.push({
      id: v.id,
      size: v.size || "",
      stock: String(v.stock ?? 0),
      price: v.price ? String(v.price) : "",
      comparePrice: v.comparePrice ? String(v.comparePrice) : "",
      sku: v.sku || "",
    });
  }
  return Array.from(map.values());
}

// Flatten color groups → flat variants for API
function groupsToVariants(groups: ColorGroup[]) {
  const out: any[] = [];
  for (const g of groups) {
    for (const row of g.variants) {
      if (!row.size && row.stock === "0" && !row.price) continue; // skip empty rows
      out.push({
        size: row.size,
        color: g.color,
        stock: row.stock,
        price: row.price || undefined,
        comparePrice: row.comparePrice || undefined,
        sku: row.sku || undefined,
        images: g.images.filter(Boolean),
      });
    }
  }
  return out;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [uploadingImg, setUploadingImg] = useState<string | null>(null); // key like "main-3" or "variant-0-2"

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/admin/login");
  }, [status, session, router]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=${page}&limit=15`);
      if (res.ok) { const d = await res.json(); setProducts(d.products || []); setTotalPages(d.pagination?.totalPages || 1); }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [page]);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories?all=true");
      if (res.ok) { const d = await res.json(); setCategories(d.categories || []); }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (status === "authenticated") { loadProducts(); loadCategories(); } }, [status, loadProducts]);

  const openCreate = () => {
    setForm(emptyForm()); setEditId(null); setParentCategoryId(""); setSubCategoryId("");
    setActiveColorIdx(0); setShowForm(true); setMsg({ text: "", type: "" });
  };

  const openEdit = (p: any) => {
    const cat = categories.find(c => c.id === p.categoryId);
    if (cat && cat.parentId) { setParentCategoryId(String(cat.parentId)); setSubCategoryId(String(cat.id)); }
    else if (cat) { setParentCategoryId(String(cat.id)); setSubCategoryId(""); }
    else { setParentCategoryId(""); setSubCategoryId(""); }

    const images = Array.isArray(p.images) ? p.images : [];
    const imageUrls = [...images, ...Array(10).fill("")].slice(0, 10);
    const colorGroups = p.variants?.length ? variantsToGroups(p.variants) : [];

    setForm({ name: p.name, slug: p.slug, description: p.description || "", price: String(p.price), comparePrice: p.comparePrice ? String(p.comparePrice) : "", stock: String(p.stock), categoryId: String(p.categoryId), imageUrls, isFeatured: p.isFeatured, colorGroups });
    setActiveColorIdx(0); setEditId(p.id); setShowForm(true); setMsg({ text: "", type: "" });
  };

  const handleSave = async () => {
    const finalCategoryId = subCategoryId || parentCategoryId;
    if (!form.name || !form.price || !finalCategoryId) { setMsg({ text: "Name, price, and category are required.", type: "error" }); return; }
    setSaving(true); setMsg({ text: "", type: "" });
    const payload = {
      name: form.name, slug: form.slug || undefined, description: form.description, price: form.price,
      comparePrice: form.comparePrice || undefined, stock: form.stock || "0", categoryId: finalCategoryId,
      images: form.imageUrls.filter(u => u.trim() !== ""), isFeatured: form.isFeatured,
      variants: groupsToVariants(form.colorGroups),
    };
    try {
      const res = await fetch(editId ? `/api/admin/products/${editId}` : "/api/admin/products", {
        method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSaving(false);
      if (!res.ok) { setMsg({ text: data.error || "Failed to save.", type: "error" }); return; }
      setMsg({ text: editId ? "Product updated!" : "Product created!", type: "success" });
      setShowForm(false); loadProducts();
    } catch { setMsg({ text: "Network error occurred.", type: "error" }); setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await fetch(`/api/admin/products/${id}`, { method: "DELETE" }); setDeleteId(null); setMsg({ text: "Product deleted.", type: "success" }); loadProducts(); }
    catch { setMsg({ text: "Failed to delete.", type: "error" }); }
  };

  const handleNameChange = (newName: string) => {
    setForm(prev => {
      const oldSlug = prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const isAuto = prev.slug === "" || prev.slug === oldSlug;
      return { ...prev, name: newName, slug: isAuto ? newName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : prev.slug };
    });
  };

  // Upload helper — works for main images and variant images
  const uploadFile = async (file: File, key: string, onSuccess: (url: string) => void) => {
    setUploadingImg(key);
    const fd = new FormData(); fd.append("files", file); fd.append("folder", "products");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.urls?.[0]) { onSuccess(data.urls[0]); }
      else setMsg({ text: data.error || "Upload failed.", type: "error" });
    } catch { setMsg({ text: "Upload error.", type: "error" }); }
    setUploadingImg(null);
  };

  const updateMainImage = (idx: number, url: string) => {
    const newUrls = [...form.imageUrls]; newUrls[idx] = url; setForm(prev => ({ ...prev, imageUrls: newUrls }));
  };

  const updateColorGroup = (gIdx: number, patch: Partial<ColorGroup>) => {
    setForm(prev => {
      const groups = [...prev.colorGroups];
      groups[gIdx] = { ...groups[gIdx], ...patch };
      return { ...prev, colorGroups: groups };
    });
  };

  const updateVariantRow = (gIdx: number, rIdx: number, patch: Partial<VariantRow>) => {
    setForm(prev => {
      const groups = [...prev.colorGroups];
      const rows = [...groups[gIdx].variants];
      rows[rIdx] = { ...rows[rIdx], ...patch };
      groups[gIdx] = { ...groups[gIdx], variants: rows };
      return { ...prev, colorGroups: groups };
    });
  };

  const addColorGroup = () => {
    setForm(prev => ({ ...prev, colorGroups: [...prev.colorGroups, emptyGroup()] }));
    setActiveColorIdx(form.colorGroups.length);
  };

  const removeColorGroup = (gIdx: number) => {
    setForm(prev => {
      const groups = prev.colorGroups.filter((_, i) => i !== gIdx);
      return { ...prev, colorGroups: groups };
    });
    setActiveColorIdx(idx => Math.max(0, idx >= gIdx ? idx - 1 : idx));
  };

  const activeGroup = form.colorGroups[activeColorIdx];

  if (status === "loading") return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.mainContainer}>
      {/* Header */}
      <div style={s.actionHeader} className="admin-action-header">
        <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>View and manage your store inventory.</p>
        <button id="add-product-btn" onClick={openCreate} style={s.addBtn}>+ New Product</button>
      </div>

      {msg.text && (
        <div style={{ ...s.alert, background: msg.type === "error" ? "#FFF5F5" : "#F0FDF4", border: `1px solid ${msg.type === "error" ? "#FECACA" : "#BBF7D0"}`, color: msg.type === "error" ? "#DC2626" : "#15803D" }}>
          {msg.text}
        </div>
      )}

      {loading ? <div style={s.center}>Loading products...</div> : products.length === 0 ? (
        <div style={s.empty}><p style={{ fontSize: "1.1rem", color: "#888", marginBottom: 16 }}>No products yet.</p><button onClick={openCreate} style={s.addBtn}>Create your first product</button></div>
      ) : (
        <>
          <div style={s.tableWrap} className="admin-table-wrap">
            <table style={s.table}>
              <thead>
                <tr>{["Image", "Name", "Category", "Price", "Compare", "Stock", "Featured", "Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={s.tr}>
                    <td style={s.td}>{p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover" }} /> : <div style={s.noImg}>—</div>}</td>
                    <td style={s.td}><span style={s.productName}>{p.name}</span><br /><span style={{ fontSize: "0.75rem", color: "#999" }}>{p.slug}</span></td>
                    <td style={s.td}><span style={s.badge}>{p.category?.name || "—"}</span></td>
                    <td style={s.td}>{formatPrice(p.price)}</td>
                    <td style={s.td}>{p.comparePrice ? <span style={{ color: "#999", textDecoration: "line-through", fontSize: "0.8rem" }}>{formatPrice(p.comparePrice)}</span> : <span style={{ color: "#eee" }}>—</span>}</td>
                    <td style={s.td}><span style={{ ...s.stockBadge, background: p.stock > 0 ? "#F0FDF4" : "#FFF5F5", color: p.stock > 0 ? "#15803D" : "#DC2626" }}>{p.stock}</span></td>
                    <td style={s.td}>{p.isFeatured ? "⭐" : "—"}</td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={s.editBtn}>Edit</button>
                        <button onClick={() => setDeleteId(p.id)} style={s.deleteBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="admin-card-list" style={{ flexDirection: "column", display: "none" }}>
            {products.map(p => (
              <div key={p.id} className="admin-card-item">
                <div className="admin-card-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: 52, height: 52, objectFit: "cover", flexShrink: 0 }} /> : <div style={{ width: 52, height: 52, background: "#f0f0f0", flexShrink: 0 }} />}
                    <div><div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#000" }}>{p.name}</div><div style={{ fontSize: "0.7rem", color: "#999", marginTop: 2 }}>{p.category?.name || "—"}</div></div>
                  </div>
                  {p.isFeatured && <span style={{ fontSize: "0.7rem", background: "#fffbeb", color: "#b45309", padding: "2px 8px", fontWeight: 700 }}>★ Featured</span>}
                </div>
                <div className="admin-card-row"><span className="admin-card-label">Price</span><span className="admin-card-value">{formatPrice(p.price)}</span></div>
                <div className="admin-card-row"><span className="admin-card-label">Stock</span><span style={{ fontSize: "0.8rem", fontWeight: 700, color: p.stock > 0 ? "#15803D" : "#DC2626" }}>{p.stock} units</span></div>
                <div className="admin-card-actions">
                  <button onClick={() => openEdit(p)} style={s.editBtn}>Edit</button>
                  <button onClick={() => setDeleteId(p.id)} style={s.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div style={s.pagination}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={s.pageBtn}>← Prev</button>
          <span style={{ fontSize: "0.85rem", color: "#666" }}>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={s.pageBtn}>Next →</button>
        </div>
      )}

      {/* ─── Product Form Modal ─── */}
      {showForm && (
        <div style={s.overlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
            </div>
            {msg.text && <div style={{ padding: "8px 12px", marginBottom: 12, background: "#FFF5F5", color: "#DC2626", fontSize: "0.85rem" }}>{msg.text}</div>}

            {/* ── Basic Info ── */}
            <div style={s.sectionTitle}>Basic Information</div>
            <div style={s.grid2}>
              <div style={s.formField}>
                <label style={s.lbl}>Product Name *</label>
                <input style={s.inp} type="text" placeholder="Product name" value={form.name} onChange={e => handleNameChange(e.target.value)} />
              </div>
              <div style={s.formField}>
                <label style={s.lbl}>Slug</label>
                <input style={s.inp} type="text" placeholder="auto-generated" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div style={s.formField}>
                <label style={s.lbl}>Price (INR) *</label>
                <input style={s.inp} type="number" placeholder="0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div style={s.formField}>
                <label style={s.lbl}>Compare Price</label>
                <input style={s.inp} type="number" placeholder="0.00" value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })} />
              </div>
              <div style={s.formField}>
                <label style={s.lbl}>Stock</label>
                <input style={s.inp} type="number" placeholder="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div style={s.formField}>
                <label style={s.lbl}>Main Category (Department) *</label>
                <select style={s.inp} value={parentCategoryId} onChange={e => { setParentCategoryId(e.target.value); setSubCategoryId(""); }}>
                  <option value="">Select Department...</option>
                  {categories.filter(c => !c.parentId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={s.formField}>
                <label style={s.lbl}>Sub-Category (Discipline)</label>
                <select style={s.inp} value={subCategoryId} onChange={e => setSubCategoryId(e.target.value)} disabled={!parentCategoryId}>
                  <option value="">None / Select...</option>
                  {categories.filter(c => c.parentId == (parentCategoryId as any)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div style={s.formField}>
              <label style={s.lbl}>Default Description</label>
              <textarea style={{ ...s.inp, minHeight: 80, resize: "vertical" }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description (used when no color selected)..." />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 20, fontSize: "0.875rem" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
              Mark as Featured Product
            </label>

            {/* ── Product Images ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={s.sectionTitle}>Product Images <span style={{ fontWeight: 400, color: "#aaa" }}>(Max 10)</span></div>
              <div style={s.imageGrid}>
                {form.imageUrls.map((url, idx) => {
                  const isUploading = uploadingImg === `main-${idx}`;
                  return (
                    <div key={idx} style={s.imageSlot}>
                      <div style={s.imageSlotLabel}>#{idx + 1}</div>
                      <div style={s.imagePreview}>
                        {url ? (
                          <>
                            <img src={url} alt={`preview ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button onClick={() => updateMainImage(idx, "")} style={s.imgRemoveBtn}>✕</button>
                          </>
                        ) : isUploading ? (
                          <div style={s.imgPlaceholder}><div style={s.spinner} /><span style={{ fontSize: "0.6rem", color: "#999", marginTop: 4 }}>Uploading…</span></div>
                        ) : (
                          <div style={s.imgPlaceholder}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                          </div>
                        )}
                      </div>
                      <input
                        style={{ ...s.inp, fontSize: "0.7rem", padding: "6px 8px", marginTop: 6, marginBottom: 4 }}
                        value={url} onChange={e => updateMainImage(idx, e.target.value)}
                        placeholder="Paste URL"
                      />
                      <label style={s.uploadLabel}>
                        {isUploading ? "Uploading…" : "Upload File"}
                        <input type="file" accept="image/*" style={{ display: "none" }} disabled={isUploading}
                          onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], `main-${idx}`, url => updateMainImage(idx, url))} />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Product Variants ── */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={s.sectionTitle} className="no-margin">Product Variants <span style={{ fontWeight: 400, color: "#aaa" }}>(Colors &amp; Sizes)</span></div>
                <button type="button" onClick={addColorGroup} style={{ ...s.editBtn, fontSize: "0.7rem" }}>+ Add Color</button>
              </div>

              {form.colorGroups.length === 0 ? (
                <div style={{ background: "#fafafa", border: "1px dashed #e0e0e0", padding: "24px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: "0.8rem", color: "#999", margin: 0 }}>No variants added. Product will be sold as a single item.</p>
                  <button type="button" onClick={addColorGroup} style={{ ...s.editBtn, marginTop: 12, fontSize: "0.75rem" }}>+ Add Color Group</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 0, flexDirection: "column" }}>
                  {/* Color Tab Bar */}
                  <div style={s.colorTabBar}>
                    {form.colorGroups.map((g, gIdx) => (
                      <button
                        key={gIdx}
                        type="button"
                        onClick={() => setActiveColorIdx(gIdx)}
                        style={{
                          ...s.colorTab,
                          ...(activeColorIdx === gIdx ? s.colorTabActive : {}),
                        }}
                      >
                        {g.color ? (
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: getColorFromName(g.color), border: "1px solid rgba(0,0,0,0.2)", flexShrink: 0, display: "inline-block" }} />
                            {g.color}
                          </span>
                        ) : `Color ${gIdx + 1}`}
                        <span
                          onClick={e => { e.stopPropagation(); removeColorGroup(gIdx); }}
                          style={{ marginLeft: 6, opacity: 0.4, cursor: "pointer", fontSize: "0.65rem", lineHeight: 1 }}
                          title="Remove color"
                        >✕</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Color Panel */}
                  {activeGroup && (
                    <div style={s.colorPanel}>
                      {/* Color Name */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div style={s.formField}>
                          <label style={s.lbl}>Color Name</label>
                          <input
                            style={s.inp} value={activeGroup.color}
                            onChange={e => updateColorGroup(activeColorIdx, { color: e.target.value })}
                            placeholder="e.g. Midnight Black, Ivory White"
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, paddingBottom: 2 }}>
                          {["Black", "White", "Red", "Navy", "Beige", "Camel", "Olive", "Gray"].map(c => (
                            <button
                              key={c} type="button"
                              onClick={() => updateColorGroup(activeColorIdx, { color: c })}
                              title={c}
                              style={{ width: 20, height: 20, borderRadius: "50%", border: activeGroup.color === c ? "2px solid #000" : "1px solid #ddd", background: getColorFromName(c), cursor: "pointer", flexShrink: 0 }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Per-color Description */}
                      <div style={{ ...s.formField, marginBottom: 16 }}>
                        <label style={s.lbl}>Description for this Color <span style={{ fontWeight: 400, color: "#bbb" }}>(overrides default)</span></label>
                        <textarea
                          style={{ ...s.inp, minHeight: 70, resize: "vertical", fontSize: "0.85rem" }}
                          value={activeGroup.description}
                          onChange={e => updateColorGroup(activeColorIdx, { description: e.target.value })}
                          placeholder="Optional: describe this specific colorway…"
                        />
                      </div>

                      {/* Per-color Images */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <label style={s.lbl}>Images for {activeGroup.color || "this color"}</label>
                          <button type="button"
                            onClick={() => updateColorGroup(activeColorIdx, { images: [...activeGroup.images, ""] })}
                            style={{ fontSize: "0.65rem", padding: "4px 10px", background: "#f5f5f5", border: "1px solid #ddd", cursor: "pointer" }}>
                            + Add Slot
                          </button>
                        </div>
                        <div style={s.variantImageGrid}>
                          {(activeGroup.images.length === 0 ? [""] : activeGroup.images).map((imgUrl, imgIdx) => {
                            const vKey = `variant-${activeColorIdx}-${imgIdx}`;
                            const isUploading = uploadingImg === vKey;
                            return (
                              <div key={imgIdx} style={s.variantImageSlot}>
                                <div style={s.variantImagePreview}>
                                  {imgUrl ? (
                                    <>
                                      <img src={imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                      <button type="button" onClick={() => {
                                        const imgs = [...activeGroup.images]; imgs[imgIdx] = "";
                                        updateColorGroup(activeColorIdx, { images: imgs });
                                      }} style={s.imgRemoveBtn}>✕</button>
                                    </>
                                  ) : isUploading ? (
                                    <div style={s.imgPlaceholder}><div style={s.spinner} /></div>
                                  ) : (
                                    <div style={s.imgPlaceholder}>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                                    </div>
                                  )}
                                </div>
                                <input
                                  style={{ ...s.inp, fontSize: "0.65rem", padding: "4px 6px", marginTop: 4, marginBottom: 2 }}
                                  value={imgUrl}
                                  onChange={e => {
                                    const imgs = [...activeGroup.images]; imgs[imgIdx] = e.target.value;
                                    updateColorGroup(activeColorIdx, { images: imgs });
                                  }}
                                  placeholder="URL"
                                />
                                <label style={{ ...s.uploadLabel, fontSize: "0.6rem", padding: "4px 0" }}>
                                  {isUploading ? "…" : "Upload"}
                                  <input type="file" accept="image/*" style={{ display: "none" }} disabled={isUploading}
                                    onChange={e => {
                                      if (!e.target.files?.[0]) return;
                                      uploadFile(e.target.files[0], vKey, url => {
                                        const imgs = [...activeGroup.images];
                                        // If slot was empty and it's last slot, we can fill it
                                        if (imgIdx < imgs.length) imgs[imgIdx] = url;
                                        else imgs.push(url);
                                        updateColorGroup(activeColorIdx, { images: imgs });
                                      });
                                    }} />
                                </label>
                                {activeGroup.images.length > 1 && (
                                  <button type="button" onClick={() => {
                                    const imgs = activeGroup.images.filter((_, i) => i !== imgIdx);
                                    updateColorGroup(activeColorIdx, { images: imgs });
                                  }} style={{ fontSize: "0.55rem", color: "#DC2626", border: "none", background: "none", cursor: "pointer", padding: "2px 0" }}>
                                    Remove
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Size Rows */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <label style={s.lbl}>Sizes for {activeGroup.color || "this color"}</label>
                          <button type="button"
                            onClick={() => updateColorGroup(activeColorIdx, { variants: [...activeGroup.variants, emptyRow()] })}
                            style={{ fontSize: "0.65rem", padding: "4px 10px", background: "#f5f5f5", border: "1px solid #ddd", cursor: "pointer" }}>
                            + Add Size
                          </button>
                        </div>
                        <div style={s.sizeTable}>
                          <div style={s.sizeTableHeader}>
                            {["Size", "Stock", "Price (opt)", "Compare (opt)", "SKU (opt)", ""].map(h => (
                              <div key={h} style={{ ...s.sizeTh }}>{h}</div>
                            ))}
                          </div>
                          {activeGroup.variants.map((row, rIdx) => (
                            <div key={rIdx} style={s.sizeTableRow}>
                              <input style={{ ...s.inp, ...s.sizeInput }} value={row.size} onChange={e => updateVariantRow(activeColorIdx, rIdx, { size: e.target.value })} placeholder="e.g. XL, 32, 10" />
                              <input style={{ ...s.inp, ...s.sizeInput }} type="number" value={row.stock} onChange={e => updateVariantRow(activeColorIdx, rIdx, { stock: e.target.value })} placeholder="0" />
                              <input style={{ ...s.inp, ...s.sizeInput }} type="number" value={row.price} onChange={e => updateVariantRow(activeColorIdx, rIdx, { price: e.target.value })} placeholder="—" />
                              <input style={{ ...s.inp, ...s.sizeInput }} type="number" value={row.comparePrice} onChange={e => updateVariantRow(activeColorIdx, rIdx, { comparePrice: e.target.value })} placeholder="—" />
                              <input style={{ ...s.inp, ...s.sizeInput }} value={row.sku} onChange={e => updateVariantRow(activeColorIdx, rIdx, { sku: e.target.value })} placeholder="—" />
                              <button type="button" onClick={() => {
                                const rows = activeGroup.variants.filter((_, i) => i !== rIdx);
                                updateColorGroup(activeColorIdx, { variants: rows.length ? rows : [emptyRow()] });
                              }} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "0.8rem", padding: "0 4px" }}>✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : editId ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: 360 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>Delete Product?</h2>
            <p style={{ color: "#666", marginBottom: 24, fontSize: "0.875rem" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteId(null)} style={s.cancelBtn}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ ...s.deleteBtn, padding: "10px 20px" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  mainContainer: { display: "flex", flexDirection: "column" },
  actionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, gap: 16, flexWrap: "wrap" },
  addBtn: { background: "#000", color: "#fff", border: "none", padding: "10px 20px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" },
  alert: { padding: "12px 16px", marginBottom: 20, fontSize: "0.875rem" },
  center: { textAlign: "center", padding: 60, color: "#888" },
  empty: { textAlign: "center", padding: 80 },
  tableWrap: { overflowX: "auto", background: "#fff", border: "1px solid #eee", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 700 },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", borderBottom: "1px solid #eee", background: "#f9f9f7", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "0.875rem", verticalAlign: "middle" },
  productName: { fontWeight: 600, color: "#000" },
  badge: { background: "#f0f0f0", padding: "2px 8px", fontSize: "0.7rem", color: "#444" },
  stockBadge: { padding: "2px 8px", fontSize: "0.7rem", fontWeight: 600 },
  noImg: { width: 44, height: 44, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" },
  editBtn: { background: "none", color: "#000", border: "1px solid #ddd", padding: "6px 12px", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 },
  deleteBtn: { background: "none", color: "#DC2626", border: "1px solid #fee2e2", padding: "6px 12px", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 },
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "24px 0" },
  pageBtn: { background: "#fff", border: "1px solid #ddd", padding: "8px 16px", cursor: "pointer", fontSize: "0.8rem" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modal: { background: "#fff", width: "100%", maxWidth: 760, padding: 32, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: "1.2rem", fontWeight: 700, margin: 0 },
  closeBtn: { background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#888" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px,100%), 1fr))", gap: 16, marginBottom: 16 },
  formField: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 4 },
  lbl: { fontSize: "0.68rem", fontWeight: 700, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase" },
  inp: { padding: "9px 11px", border: "1px solid #e0e0e0", outline: "none", fontSize: "0.88rem", color: "#000", background: "#fff", width: "100%", boxSizing: "border-box" },
  cancelBtn: { background: "#fff", color: "#000", border: "1px solid #ddd", padding: "10px 20px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" },
  saveBtn: { background: "#000", color: "#fff", border: "none", padding: "10px 24px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" },
  sectionTitle: { fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#555", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" },

  // Product Images Grid
  imageGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 8 },
  imageSlot: { display: "flex", flexDirection: "column", border: "1px solid #ebebeb", padding: 8, background: "#fafafa" },
  imageSlotLabel: { fontSize: "0.58rem", fontWeight: 700, color: "#bbb", marginBottom: 6, letterSpacing: "0.05em" },
  imagePreview: { height: 90, background: "#f3f3f3", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ebebeb" },
  imgPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", gap: 4 },
  imgRemoveBtn: { position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", width: 20, height: 20, cursor: "pointer", fontSize: "0.65rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  uploadLabel: { display: "block", textAlign: "center", background: "#f0f0f0", border: "1px solid #e0e0e0", fontSize: "0.65rem", padding: "5px 0", cursor: "pointer", fontWeight: 600, color: "#555" },
  spinner: { width: 16, height: 16, border: "2px solid #e0e0e0", borderTop: "2px solid #555", borderRadius: "50%", animation: "spin 0.7s linear infinite" },

  // Variant Colors
  colorTabBar: { display: "flex", flexWrap: "wrap", gap: 0, borderBottom: "2px solid #f0f0f0", marginBottom: 0 },
  colorTab: { padding: "8px 16px", fontSize: "0.75rem", border: "none", borderBottom: "2px solid transparent", background: "none", cursor: "pointer", color: "#888", fontWeight: 600, display: "flex", alignItems: "center", marginBottom: -2 },
  colorTabActive: { borderBottom: "2px solid #000", color: "#000", background: "#fff" },
  colorPanel: { border: "1px solid #f0f0f0", borderTop: "none", padding: 20, background: "#fff" },

  // Variant Images
  variantImageGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  variantImageSlot: { display: "flex", flexDirection: "column", width: 90, border: "1px solid #ebebeb", padding: 6, background: "#fafafa" },
  variantImagePreview: { height: 72, background: "#f3f3f3", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },

  // Size Table
  sizeTable: { border: "1px solid #f0f0f0", overflowX: "auto" },
  sizeTableHeader: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.5fr 32px", gap: 0, background: "#f9f9f7", borderBottom: "1px solid #eee" },
  sizeTableRow: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.5fr 32px", gap: 0, borderBottom: "1px solid #f5f5f5", alignItems: "center" },
  sizeTh: { padding: "7px 10px", fontSize: "0.6rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" },
  sizeInput: { border: "none", borderRight: "1px solid #f0f0f0", borderRadius: 0, fontSize: "0.82rem", padding: "8px 10px" },
};
