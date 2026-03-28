"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface Product { id: number; name: string; price: number; stock: number; isFeatured: boolean; isActive: boolean; images: string[]; category?: { name: string }; rating: number; }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", categoryId: "", isFeatured: false, images: [] as string[] });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/products?limit=50").then(r => r.json()).then(d => { setProducts(d.products || []); setLoading(false); });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(e.target.files).forEach(f => fd.append("files", f));
    fd.append("folder", "products");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.urls) setForm(f => ({ ...f, images: [...f.images, ...data.urls] }));
    setUploading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      const d = await res.json();
      setProducts(prev => [d, ...prev]);
      setShowForm(false);
      setForm({ name: "", description: "", price: "", stock: "", categoryId: "", isFeatured: false, images: [] });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div><h1 style={{ fontSize: "2rem", marginBottom: 4 }}>📦 Products</h1><p style={{ color: "var(--text-secondary)" }}>{products.length} total</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Product</button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card" style={{ padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 24 }}>New Product</h2>
          <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1/-1" }}><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Name *</label><input required className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" /></div>
            <div style={{ gridColumn: "1/-1" }}><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Description *</label><textarea required className="input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description" style={{ resize: "vertical" }} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Price *</label><input required type="number" step="0.01" className="input" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Stock</label><input type="number" className="input" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Category ID</label><input type="number" className="input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} placeholder="1" /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
              <label htmlFor="featured" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Featured Product</label>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Images</label>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ color: "var(--text-secondary)", marginBottom: 12 }} />
              {uploading && <p style={{ color: "var(--primary-light)", fontSize: "0.9rem" }}>⏳ Uploading...</p>}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 8, overflow: "hidden", background: "var(--bg-elevated)" }}>
                    <Image src={img} alt="" fill style={{ objectFit: "cover" }} sizes="72px" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} style={{ position: "absolute", top: 2, right: 2, background: "rgba(239,68,68,0.8)", border: "none", color: "white", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 12 }}>
              <button type="submit" className="btn btn-primary">Create Product</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}><p style={{ color: "var(--text-muted)" }}>Loading...</p></div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Image", "Name", "Category", "Price", "Stock", "Featured", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "16px 20px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ position: "relative", width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "var(--bg-elevated)" }}>
                        {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: "cover" }} sizes="48px" />}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}><p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{p.name}</p><p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>#{p.id}</p></td>
                    <td style={{ padding: "16px 20px" }}><span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{p.category?.name || "—"}</span></td>
                    <td style={{ padding: "16px 20px" }}><span style={{ fontWeight: 700, color: "var(--primary-light)" }}>{formatPrice(p.price)}</span></td>
                    <td style={{ padding: "16px 20px" }}><span style={{ fontWeight: 600, color: p.stock < 5 ? "var(--error)" : p.stock < 20 ? "var(--warning)" : "var(--success)" }}>{p.stock}</span></td>
                    <td style={{ padding: "16px 20px" }}>{p.isFeatured ? "⭐" : "—"}</td>
                    <td style={{ padding: "16px 20px" }}><span className={`badge ${p.isActive ? "badge-success" : "badge-danger"}`}>{p.isActive ? "Active" : "Hidden"}</span></td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a href={`/products/${p.id}`} className="btn btn-ghost btn-sm">View</a>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.2)" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>No products yet. Create your first one!</div>}
          </div>
        </div>
      )}
    </div>
  );
}
