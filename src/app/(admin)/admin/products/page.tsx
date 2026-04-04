"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category { id: number; name: string; parentId: number | null; }
interface Variant { id?: number; size: string; color?: string; price?: string; comparePrice?: string; stock: string; sku?: string; images?: string[]; }
interface Product {
  id: number; name: string; slug: string; price: number;
  comparePrice?: number; stock: number; isFeatured: boolean;
  images: string[]; category?: { name: string };
  variants?: Variant[];
}

const emptyForm = {
  name: "", slug: "", description: "", price: "", comparePrice: "",
  stock: "", categoryId: "", imageUrls: ["", "", "", "", "", ""], isFeatured: false,
  variants: [] as Variant[],
};

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/admin/login");
  }, [status, session, router]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=${page}&limit=15`);
      if (res.ok) { 
        const d = await res.json(); 
        setProducts(d.products || []); 
        setTotalPages(d.pagination?.totalPages || 1); 
      }
    } catch (error) {
       console.error("Load products error:", error);
    }
    setLoading(false);
  }, [page]);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories?all=true");
      if (res.ok) { 
        const d = await res.json(); 
        setCategories(d.categories || []); 
      }
    } catch (error) {
      console.error("Load categories error:", error);
    }
  };

  useEffect(() => { if (status === "authenticated") { loadProducts(); loadCategories(); } }, [status, loadProducts]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setParentCategoryId(""); setSubCategoryId(""); setShowForm(true); setMsg({ text: "", type: "" }); };
  const openEdit = (p: any) => {
    // Determine parent and sub category for states
    const cat = categories.find(c => c.id === p.categoryId);
    if (cat && cat.parentId) {
      setParentCategoryId(String(cat.parentId));
      setSubCategoryId(String(cat.id));
    } else if (cat) {
      setParentCategoryId(String(cat.id));
      setSubCategoryId("");
    } else {
      setParentCategoryId("");
      setSubCategoryId("");
    }

    const images = Array.isArray(p.images) ? p.images : [];
    const imageUrls = [...images, ...Array(6).fill("")].slice(0, 6);

    setForm({ 
      name: p.name, 
      slug: p.slug, 
      description: p.description || "", 
      price: String(p.price), 
      comparePrice: p.comparePrice ? String(p.comparePrice) : "", 
      stock: String(p.stock), 
      categoryId: String(p.categoryId), 
      imageUrls: imageUrls, 
      isFeatured: p.isFeatured,
      variants: p.variants ? p.variants.map((v: any) => ({ 
        ...v, 
        stock: String(v.stock), 
        price: v.price ? String(v.price) : "", 
        comparePrice: v.comparePrice ? String(v.comparePrice) : "",
        images: Array.isArray(v.images) ? v.images : [] 
      })) : []
    });
    setEditId(p.id); setShowForm(true); setMsg({ text: "", type: "" });
  };

  const handleSave = async () => {
    const finalCategoryId = subCategoryId || parentCategoryId;
    if (!form.name || !form.price || !finalCategoryId) { setMsg({ text: "Name, price, and category are required.", type: "error" }); return; }
    setSaving(true); setMsg({ text: "", type: "" });
    const payload = { 
      name: form.name, 
      slug: form.slug || undefined, 
      description: form.description, 
      price: form.price, 
      comparePrice: form.comparePrice || undefined, 
      stock: form.stock || "0", 
      categoryId: finalCategoryId, 
      images: form.imageUrls.filter(u => u.trim() !== ""), 
      isFeatured: form.isFeatured,
      variants: form.variants.map(v => ({ 
        ...v, 
        price: v.price || undefined,
        comparePrice: v.comparePrice || undefined
      }))
    };
    try {
      const res = await fetch(editId ? `/api/admin/products/${editId}` : "/api/admin/products", { 
        method: editId ? "PUT" : "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      const data = await res.json();
      setSaving(false);
      if (!res.ok) { setMsg({ text: data.error || "Failed to save.", type: "error" }); return; }
      setMsg({ text: editId ? "Product updated!" : "Product created!", type: "success" });
      setShowForm(false); loadProducts();
    } catch (error) {
      setMsg({ text: "Network error occurred.", type: "error" });
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setDeleteId(null); setMsg({ text: "Product deleted.", type: "success" }); loadProducts();
    } catch (e) {
      setMsg({ text: "Failed to delete.", type: "error" });
    }
  };

  const handleNameChange = (newName: string) => {
    setForm(prev => {
      const oldAutoSlug = prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const isAutoSlug = prev.slug === "" || prev.slug === oldAutoSlug;
      
      const newSlug = isAutoSlug 
        ? newName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") 
        : prev.slug;
        
      return { ...prev, name: newName, slug: newSlug };
    });
  };

  const handleFileUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", "products");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.urls?.[0]) {
        const newUrls = [...form.imageUrls];
        newUrls[index] = data.urls[0];
        setForm({ ...form, imageUrls: newUrls });
      } else {
        setMsg({ text: data.error || "Upload failed.", type: "error" });
      }
    } catch (e) {
      setMsg({ text: "Upload error occurred.", type: "error" });
    }
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...form.imageUrls];
    newUrls[index] = url;
    setForm({ ...form, imageUrls: newUrls });
  };

  if (status === "loading") return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.mainContainer}>
      {/* Top action area */}
      <div style={s.actionHeader} className="admin-action-header">
        <div>
           <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>View and manage your store inventory.</p>
        </div>
        <button id="add-product-btn" onClick={openCreate} style={s.addBtn}>+ New Product</button>
      </div>

      <div>
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
                <tr>{["Image","Name","Category","Price","Compare","Stock","Featured","Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={s.tr}>
                    <td style={s.td}>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover" }} />
                      ) : <div style={s.noImg}>—</div>}
                    </td>
                    <td style={s.td}>
                      <span style={s.productName}>{p.name}</span><br />
                      <span style={{ fontSize: "0.75rem", color: "#999" }}>{p.slug}</span>
                    </td>
                    <td style={s.td}><span style={s.badge}>{p.category?.name || "—"}</span></td>
                    <td style={s.td}>${Number(p.price).toFixed(2)}</td>
                    <td style={s.td}>
                      {p.comparePrice ? (
                        <span style={{ color: "#999", textDecoration: "line-through", fontSize: "0.8rem" }}>
                          ${Number(p.comparePrice).toFixed(2)}
                        </span>
                      ) : <span style={{ color: "#eee" }}>—</span>}
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.stockBadge, background: p.stock > 0 ? "#F0FDF4" : "#FFF5F5", color: p.stock > 0 ? "#15803D" : "#DC2626" }}>
                        {p.stock}
                      </span>
                    </td>
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

          {/* Mobile card list */}
          <div className="admin-card-list" style={{ flexDirection: "column", display: "none" }}>
            {products.map(p => (
              <div key={p.id} className="admin-card-item">
                <div className="admin-card-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: 52, height: 52, objectFit: "cover", flexShrink: 0 }} />
                    ) : <div style={{ width: 52, height: 52, background: "#f0f0f0", flexShrink: 0 }} />}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#000" }}>{p.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "#999", marginTop: 2 }}>{p.category?.name || "—"}</div>
                    </div>
                  </div>
                  {p.isFeatured && <span style={{ fontSize: "0.7rem", background: "#fffbeb", color: "#b45309", padding: "2px 8px", fontWeight: 700 }}>★ Featured</span>}
                </div>
                <div className="admin-card-row">
                  <span className="admin-card-label">Price</span>
                  <span className="admin-card-value">${Number(p.price).toFixed(2)}</span>
                </div>
                <div className="admin-card-row">
                  <span className="admin-card-label">Stock</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: p.stock > 0 ? "#15803D" : "#DC2626" }}>{p.stock} units</span>
                </div>
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
      </div>

      {showForm && (
        <div style={s.overlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
            </div>
            {msg.text && <div style={{ padding: "8px 12px", marginBottom: 12, background: "#FFF5F5", color: "#DC2626", fontSize: "0.85rem" }}>{msg.text}</div>}
            <div style={s.grid2}>
              <div style={s.formField}>
                <label style={s.lbl}>Product Name *</label>
                <input 
                  style={s.inp} 
                  type="text" 
                  placeholder="Product name" 
                  value={form.name} 
                  onChange={e => handleNameChange(e.target.value)} 
                />
              </div>
              {[{ lbl: "Slug", key: "slug", ph: "auto-generated" }, { lbl: "Price (USD) *", key: "price", ph: "0.00", type: "number" }, { lbl: "Compare Price", key: "comparePrice", ph: "0.00", type: "number" }, { lbl: "Stock", key: "stock", ph: "0", type: "number" }].map(f => (
                <div key={f.key} style={s.formField}>
                  <label style={s.lbl}>{f.lbl}</label>
                  <input style={s.inp} type={f.type || "text"} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div style={s.formField}>
                <label style={s.lbl}>Main Category (Department) *</label>
                <select style={s.inp} value={parentCategoryId} onChange={e => { setParentCategoryId(e.target.value); setSubCategoryId(""); }}>
                  <option value="">Select Department...</option>
                  {(categories as any[]).filter(c => !c.parentId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={s.formField}>
                <label style={s.lbl}>Sub-Category (Discipline)</label>
                <select style={s.inp} value={subCategoryId} onChange={e => setSubCategoryId(e.target.value)} disabled={!parentCategoryId}>
                  <option value="">None / Select...</option>
                  {(categories as any[]).filter(c => c.parentId == parentCategoryId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div style={s.formField}>
              <label style={s.lbl}>Description</label>
              <textarea style={{ ...s.inp, minHeight: 80, resize: "vertical" }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={s.lbl}>Product Images (Max 6)</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginTop: 8 }}>
                {form.imageUrls.map((url, idx) => (
                  <div key={idx} style={{ border: "1px solid #eee", padding: 12, background: "#fcfcfc", position: "relative" }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, marginBottom: 8, color: "#999" }}>IMAGE {idx + 1}</div>
                    
                    <div style={{ height: 100, background: "#f0f0f0", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", border: "1px solid #eee" }}>
                      {url ? (
                        <>
                          <img src={url} alt={`preview ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button 
                            onClick={() => updateImageUrl(idx, "")}
                            style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: 24, height: 24, cursor: "pointer", fontSize: "0.8rem", borderRadius: "50%" }}
                          >✕</button>
                        </>
                      ) : (
                        <span style={{ fontSize: "0.65rem", color: "#ccc" }}>EMPTY SLOT</span>
                      )}
                    </div>

                    <input 
                      style={{ ...s.inp, fontSize: "0.75rem", marginBottom: 8 }} 
                      value={url} 
                      onChange={e => updateImageUrl(idx, e.target.value)} 
                      placeholder="Image URL" 
                    />

                    <div style={{ position: "relative" }}>
                      <button style={{ ...s.editBtn, width: "100%", fontSize: "0.7rem", padding: "8px" }}>UPLOAD LOCAL</button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => e.target.files?.[0] && handleFileUpload(idx, e.target.files[0])}
                        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 20, fontSize: "0.875rem" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
              Mark as Featured Product
            </label>

            <div style={{ marginBottom: 24, borderTop: "1px solid #eee", paddingTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", color: "#666" }}>Product Variants (Sizes/Colors)</h3>
                <button 
                  type="button"
                  onClick={() => setForm({ ...form, variants: [...form.variants, { size: "", stock: "0", color: "", sku: "", price: "", comparePrice: "" }] })}
                  style={{ ...s.editBtn, background: "#f9f9f7" }}
                >
                  + Add Variant
                </button>
              </div>
              
              {form.variants.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>No variants added. Product will be sold as a single item.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {form.variants.map((v, idx) => (
                    <div key={idx} style={{ background: "#fcfcfc", padding: 16, border: "1px solid #f0f0f0" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 8, alignItems: "end", marginBottom: 12 }}>
                        <div>
                          <label style={s.lbl}>Size</label>
                          <input style={s.inp} value={v.size ?? ""} onChange={e => {
                            const newVariants = [...form.variants];
                            newVariants[idx].size = e.target.value;
                            setForm({ ...form, variants: newVariants });
                          }} placeholder="e.g. XL, 32, 10" />
                        </div>
                        <div>
                          <label style={s.lbl}>Color</label>
                          <input style={s.inp} value={v.color ?? ""} onChange={e => {
                            const newVariants = [...form.variants];
                            newVariants[idx].color = e.target.value;
                            setForm({ ...form, variants: newVariants });
                          }} placeholder="e.g. Black" />
                        </div>
                        <div>
                          <label style={s.lbl}>Stock</label>
                          <input style={s.inp} type="number" value={v.stock ?? ""} onChange={e => {
                            const newVariants = [...form.variants];
                            newVariants[idx].stock = e.target.value;
                            setForm({ ...form, variants: newVariants });
                          }} placeholder="0" />
                        </div>
                        <div>
                          <label style={s.lbl}>Price (Opt)</label>
                          <input style={s.inp} type="number" value={v.price ?? ""} onChange={e => {
                            const newVariants = [...form.variants];
                            newVariants[idx].price = e.target.value;
                            setForm({ ...form, variants: newVariants });
                          }} placeholder="Override" />
                        </div>
                        <div>
                          <label style={s.lbl}>Compare (Opt)</label>
                          <input style={s.inp} type="number" value={v.comparePrice ?? ""} onChange={e => {
                            const newVariants = [...form.variants];
                            newVariants[idx].comparePrice = e.target.value;
                            setForm({ ...form, variants: newVariants });
                          }} placeholder="Original" />
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newVariants = form.variants.filter((_, i) => i !== idx);
                            setForm({ ...form, variants: newVariants });
                          }}
                          style={{ ...s.deleteBtn, padding: "8px", border: "none", color: "#999", marginBottom: "4px" }}
                        >
                          ✕
                        </button>
                      </div>
                      
                      {/* Variant Images */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <label style={s.lbl}>Variant Images (Filtered by Color)</label>
                          <button 
                            type="button"
                            onClick={() => {
                              const newVariants = [...form.variants];
                              newVariants[idx].images = [...(newVariants[idx].images || []), ""];
                              setForm({ ...form, variants: newVariants });
                            }}
                            style={{ fontSize: "0.6rem", padding: "2px 8px", background: "#f0f0f0", border: "1px solid #ddd", cursor: "pointer" }}
                          >
                            + Add Image
                          </button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {(v.images || []).map((imgUrl, imgIdx) => (
                            <div key={imgIdx} style={{ position: "relative", width: 80 }}>
                              <div style={{ height: 60, background: "#eee", marginBottom: 4, position: "relative", overflow: "hidden" }}>
                                {imgUrl ? <img src={imgUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: "0.5rem" }}>No Img</div>}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newVariants = [...form.variants];
                                    newVariants[idx].images = newVariants[idx].images?.filter((_, i) => i !== imgIdx);
                                    setForm({ ...form, variants: newVariants });
                                  }}
                                  style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: 16, height: 16, borderRadius: "50%", cursor: "pointer", fontSize: "0.6rem" }}
                                >✕</button>
                              </div>
                              <input 
                                style={{ ...s.inp, fontSize: "0.6rem", padding: "4px" }} 
                                value={imgUrl} 
                                onChange={e => {
                                  const newVariants = [...form.variants];
                                  const newImgs = [...(newVariants[idx].images || [])];
                                  newImgs[imgIdx] = e.target.value;
                                  newVariants[idx].images = newImgs;
                                  setForm({ ...form, variants: newVariants });
                                }}
                                placeholder="URL"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : editId ? "Update Product" : "Create Product"}</button>
            </div>
          </div>
        </div>
      )}

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
  modal: { background: "#fff", width: "100%", maxWidth: 640, padding: 32, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: "1.2rem", fontWeight: 700, margin: 0 },
  closeBtn: { background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#888" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px,100%), 1fr))", gap: 16, marginBottom: 16 },
  formField: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 },
  lbl: { fontSize: "0.7rem", fontWeight: 600, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase" },
  inp: { padding: "10px 12px", border: "1px solid #ddd", outline: "none", fontSize: "0.9rem", color: "#000", background: "#fff", width: "100%", boxSizing: "border-box" },
  cancelBtn: { background: "#fff", color: "#000", border: "1px solid #ddd", padding: "10px 20px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" },
  saveBtn: { background: "#000", color: "#fff", border: "none", padding: "10px 24px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" },
};
