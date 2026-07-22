"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const emptyForm = () => ({
  title: "",
  slug: "",
  content: "",
  image: "",
  author: "",
  isPublished: false,
  metaTitle: "",
  metaDescription: "",
  keywords: "",
});

export default function NewBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/admin/login");
  }, [status, session, router]);

  const handleSave = async () => {
    if (!form.title || !form.content) {
      setMsg({ text: "Title and content are required.", type: "error" });
      return;
    }
    setSaving(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSaving(false);
      if (!res.ok) {
        setMsg({ text: data.error || "Failed to save.", type: "error" });
        return;
      }
      router.push("/admin/blogs");
    } catch {
      setMsg({ text: "Network error occurred.", type: "error" });
      setSaving(false);
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingImg(true);
    const fd = new FormData();
    fd.append("files", e.target.files[0]);
    fd.append("folder", "blogs");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.urls?.[0]) {
        setForm({ ...form, image: data.urls[0] });
      } else {
        setMsg({ text: data.error || "Upload failed.", type: "error" });
      }
    } catch {
      setMsg({ text: "Upload error.", type: "error" });
    }
    setUploadingImg(false);
  };

  if (status === "loading") return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.mainContainer}>
      <div style={s.actionHeader}>
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Create New Blog</h2>
        <button onClick={() => router.push("/admin/blogs")} style={s.cancelBtn}>Back to Blogs</button>
      </div>

      {msg.text && (
        <div style={{ ...s.alert, background: msg.type === "error" ? "#FFF5F5" : "#F0FDF4", color: msg.type === "error" ? "#DC2626" : "#15803D" }}>
          {msg.text}
        </div>
      )}

      <div style={s.formContainer}>
        <div style={s.grid2}>
          <div>
            <label style={s.lbl}>Title *</label>
            <input style={s.inp} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label style={s.lbl}>Slug (Leave empty to auto-generate)</label>
            <input style={s.inp} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label style={s.lbl}>Author</label>
            <input style={s.inp} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
          </div>
          <div>
            <label style={s.lbl}>Cover Image</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input style={{ ...s.inp, flex: 1 }} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="URL" />
              <label style={s.uploadBtn}>
                {uploadingImg ? "..." : "Upload"}
                <input type="file" style={{ display: "none" }} onChange={uploadFile} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={s.lbl}>Content *</label>
          <div style={{ background: "#fff", color: "#000" }}>
            <ReactQuill theme="snow" value={form.content} onChange={(val: string) => setForm({ ...form, content: val })} style={{ height: 350, marginBottom: 50 }} />
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 20, marginTop: 20 }}>
          <h3 style={{ fontSize: "1rem", margin: "0 0 10px" }}>SEO Settings</h3>
          <div style={s.grid2}>
            <div>
              <label style={s.lbl}>Meta Title</label>
              <input style={s.inp} value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} />
            </div>
            <div>
              <label style={s.lbl}>Keywords</label>
              <input style={s.inp} value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="comma, separated" />
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            <label style={s.lbl}>Meta Description</label>
            <textarea style={s.inp} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} rows={3} />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, cursor: "pointer" }}>
          <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
          Publish this blog post
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 30 }}>
          <button onClick={() => router.push("/admin/blogs")} style={s.cancelBtn}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={s.saveBtn}>{saving ? "Saving..." : "Save Blog"}</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  mainContainer: { padding: "30px", background: "#f8fafc", minHeight: "100vh", color: "#000" },
  actionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  formContainer: { background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  alert: { padding: "12px", marginBottom: "20px", borderRadius: "4px" },
  center: { textAlign: "center", padding: "40px", color: "#888" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  lbl: { display: "block", marginBottom: "6px", fontSize: "0.85rem", fontWeight: "bold", color: "#333" },
  inp: { width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "0.9rem" },
  uploadBtn: { background: "#f1f5f9", padding: "10px 16px", cursor: "pointer", borderRadius: "4px", fontSize: "0.85rem", display: "flex", alignItems: "center", border: "1px solid #cbd5e1" },
  cancelBtn: { background: "#fff", border: "1px solid #ccc", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" },
  saveBtn: { background: "#000", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" },
};
