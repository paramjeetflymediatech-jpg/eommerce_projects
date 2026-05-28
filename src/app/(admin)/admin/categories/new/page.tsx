"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function NewCategoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const parentIdParam = searchParams.get("parentId");

  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    tagline: "",
    overlayDescription: "",
    parentId: parentIdParam || "", 
    image: "", 
    banner: "" 
  });
  
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  const fetchAllForDropdown = async () => {
    try {
      const res = await fetch("/api/admin/categories?all=true", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setAllCategories(data.categories || []);
    } catch (err) { console.error("Dropdown fetch error", err); }
  };

  useEffect(() => {
    fetchAllForDropdown();
  }, []);

  const handleSave = async () => {
    if (!form.name) {
      Swal.fire({ title: "Notice", text: "Name is required", icon: "warning", confirmButtonColor: "#000" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          parentId: form.parentId ? parseInt(form.parentId) : null
        }),
      });
      if (res.ok) {
        Swal.fire({
          title: "Success",
          text: `Category created successfully.`,
          icon: "success",
          confirmButtonColor: "#000"
        }).then(() => {
          router.push("/admin/categories");
        });
      } else {
        const data = await res.json();
        Swal.fire({
          title: "Notice",
          text: data.error || "Failed to create category",
          icon: "error",
          confirmButtonColor: "#000"
        });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: "Save failed", icon: "error", confirmButtonColor: "#000" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFile = async (url: string) => {
    if (!url) return;
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete file from server", err);
    }
  };

  const updateImage = (url: string) => {
    if (form.image && !url) handleDeleteFile(form.image);
    setForm({ ...form, image: url });
  };

  const updateBanner = (url: string) => {
    if (form.banner && !url) handleDeleteFile(form.banner);
    setForm({ ...form, banner: url });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>{type === "sub" ? "Define Sub-Class" : "Define Root Class"}</h1>
          <p style={styles.subtitle}>Create a new category in your taxonomy.</p>
        </div>
        <Link href="/admin/categories" style={styles.backBtn}>
          ← Back to Categories
        </Link>
      </header>

      <div style={styles.formContainer}>
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
            {allCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.lbl}>Overlay Tagline <span style={{ color: "#888", fontWeight: 400 }}>(shown on category card — e.g. "Luxury at Its Best")</span></label>
          <input
            style={styles.inp}
            placeholder="e.g., Luxury at Its Best"
            value={form.tagline}
            onChange={e => setForm({ ...form, tagline: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.lbl}>Overlay Description <span style={{ color: "#888", fontWeight: 400 }}>(short body text on the card)</span></label>
          <input
            style={styles.inp}
            placeholder="e.g., One of its kind, Adjustable & Reversible Thermals."
            value={form.overlayDescription}
            onChange={e => setForm({ ...form, overlayDescription: e.target.value })}
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
                    updateImage(data.urls[0]);
                    Swal.fire({ title: "Uploaded", text: "Image uploaded successfully", icon: "success", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
                  } else {
                    Swal.fire({ title: "Error", text: data.error || "Upload failed", icon: "error", confirmButtonColor: "#000" });
                  }
                } catch (err) {
                  Swal.fire({ title: "Error", text: "Network failure", icon: "error", confirmButtonColor: "#000" });
                } finally {
                  setSaving(false);
                  e.target.value = '';
                }
              }}
              style={{ fontSize: "0.75rem", background: "#f0f0f0", padding: "8px", borderRadius: "4px", cursor: "pointer" }}
            />
          </div>
          {form.image && (
            <div style={{ marginTop: "16px", position: "relative", display: "inline-block" }}>
              <img src={form.image} alt="Preview" style={{ maxHeight: "80px", borderRadius: "4px", border: "1px solid #eee", objectFit: "cover" }} />
              <button onClick={() => updateImage("")} style={styles.imgRemoveBtn}>✕</button>
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.lbl}>Banner Image (Hero Display)</label>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              style={{ ...styles.inp, flex: 1, minWidth: "200px" }}
              placeholder="https://... or upload local file ->"
              value={form.banner}
              onChange={e => setForm({ ...form, banner: e.target.value })}
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
                    updateBanner(data.urls[0]);
                    Swal.fire({ title: "Uploaded", text: "Banner uploaded successfully", icon: "success", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
                  } else {
                    Swal.fire({ title: "Error", text: data.error || "Upload failed", icon: "error", confirmButtonColor: "#000" });
                  }
                } catch (err) {
                  Swal.fire({ title: "Error", text: "Network failure", icon: "error", confirmButtonColor: "#000" });
                } finally {
                  setSaving(false);
                  e.target.value = '';
                }
              }}
              style={{ fontSize: "0.75rem", background: "#f0f0f0", padding: "8px", borderRadius: "4px", cursor: "pointer" }}
            />
          </div>
          {form.banner && (
            <div style={{ marginTop: "16px", position: "relative", display: "inline-block" }}>
              <img src={form.banner} alt="Banner Preview" style={{ width: "100%", maxHeight: "150px", borderRadius: "4px", border: "1px solid #eee", objectFit: "cover" }} />
              <button onClick={() => updateBanner("")} style={styles.imgRemoveBtn}>✕</button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 32 }}>
          <Link href="/admin/categories" style={styles.cancelBtn}>Cancel</Link>
          <button onClick={handleSave} disabled={saving} style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}>
            {saving ? "Processing..." : "Commit Taxonomy"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "clamp(24px, 5vw, 60px)",
    maxWidth: "960px",
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
    letterSpacing: "normal",
    fontWeight: 500,
  },
  backBtn: {
    color: "#000",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 600,
    border: "1px solid #000",
    padding: "10px 20px",
    display: "inline-block",
  },
  formContainer: {
    background: "#fff",
    padding: "clamp(20px, 4vw, 40px)",
    border: "1px solid #eee",
  },
  formGroup: { marginBottom: "32px" },
  lbl: {
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "normal",
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
  cancelBtn: {
    background: "#fff",
    color: "#000",
    border: "1px solid #ddd",
    padding: "10px 20px",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none"
  },
  saveBtn: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  imgRemoveBtn: { position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", width: 24, height: 24, cursor: "pointer", fontSize: "0.75rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
};
