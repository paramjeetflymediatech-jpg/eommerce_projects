"use client";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditSeoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [form, setForm] = useState({
    pagePath: "",
    seoTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    metaRobots: "Index, Follow",
    twitterCard: "summary_large_image",
    customSchema: "",
    ogTitle: "",
    ogImageUrl: "",
    ogDescription: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/admin/login");
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/admin/seo/${id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setForm({
              pagePath: data.pagePath || "",
              seoTitle: data.seoTitle || "",
              metaDescription: data.metaDescription || "",
              keywords: data.keywords || "",
              canonicalUrl: data.canonicalUrl || "",
              metaRobots: data.metaRobots || "Index, Follow",
              twitterCard: data.twitterCard || "summary_large_image",
              customSchema: data.customSchema || "",
              ogTitle: data.ogTitle || "",
              ogImageUrl: data.ogImageUrl || "",
              ogDescription: data.ogDescription || "",
            });
          } else {
            setMsg({ text: "Failed to load SEO config.", type: "error" });
          }
          setLoading(false);
        })
        .catch(() => {
          setMsg({ text: "Error loading config.", type: "error" });
          setLoading(false);
        });
    }
  }, [status, id]);

  const handleSave = async () => {
    if (!form.pagePath) {
      setMsg({ text: "Page URL Path is required.", type: "error" });
      return;
    }
    setSaving(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch(`/api/admin/seo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSaving(false);
      if (!res.ok) {
        setMsg({ text: data.error || "Failed to save.", type: "error" });
        return;
      }
      setMsg({ text: "SEO updated successfully!", type: "success" });
      setTimeout(() => router.push("/admin/seo"), 1000);
    } catch {
      setMsg({ text: "Network error occurred.", type: "error" });
      setSaving(false);
    }
  };

  if (status === "loading" || loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.mainContainer}>
      <div style={s.actionHeader}>
        <div>
          <button onClick={() => router.push("/admin/seo")} style={s.backBtn}>← Back</button>
          <h1 style={s.pageTitle}>Edit Page SEO</h1>
        </div>
      </div>

      {msg.text && (
        <div style={{ ...s.alert, background: msg.type === "error" ? "#FFF5F5" : "#F0FDF4", color: msg.type === "error" ? "#DC2626" : "#15803D" }}>
          {msg.text}
        </div>
      )}

      <div style={s.card}>
        <div style={s.grid2}>
          <div>
            <label style={s.lbl}>Page URL Path *</label>
            <input style={s.inp} value={form.pagePath} onChange={e => setForm({ ...form, pagePath: e.target.value })} placeholder='Use "/" for homepage. Always start with a slash.' />
          </div>
          <div>
            <label style={s.lbl}>SEO Title</label>
            <input style={s.inp} value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} placeholder="Focus keywords in first 60 chars..." />
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <label style={s.lbl}>Meta Description</label>
          <textarea style={s.inp} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} rows={3} placeholder="Short summary for search results (max 160 chars)..." />
        </div>

        <div style={{ marginTop: 15, ...s.grid2 }}>
          <div>
            <label style={s.lbl}>Keywords (Comma separated)</label>
            <input style={s.inp} value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="web design, agency, digital marketing" />
          </div>
          <div>
            <label style={s.lbl}>Canonical URL</label>
            <input style={s.inp} value={form.canonicalUrl} onChange={e => setForm({ ...form, canonicalUrl: e.target.value })} placeholder="https://flymediatech.com/your-page" />
          </div>
          <div>
            <label style={s.lbl}>Meta Robots</label>
            <input style={s.inp} value={form.metaRobots} onChange={e => setForm({ ...form, metaRobots: e.target.value })} placeholder="Index, Follow" />
          </div>
          <div>
            <label style={s.lbl}>Twitter Card</label>
            <input style={s.inp} value={form.twitterCard} onChange={e => setForm({ ...form, twitterCard: e.target.value })} placeholder="Summary Large Image" />
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 20, marginTop: 20 }}>
          <h3 style={{ fontSize: "1rem", margin: "0 0 10px" }}>Social Media (Open Graph)</h3>
          <div style={s.grid2}>
            <div>
              <label style={s.lbl}>OG Title</label>
              <input style={s.inp} value={form.ogTitle} onChange={e => setForm({ ...form, ogTitle: e.target.value })} placeholder="Title for social shares" />
            </div>
            <div>
              <label style={s.lbl}>OG Image URL</label>
              <input style={s.inp} value={form.ogImageUrl} onChange={e => setForm({ ...form, ogImageUrl: e.target.value })} placeholder="https://.../og-image.jpg" />
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            <label style={s.lbl}>OG Description</label>
            <textarea style={s.inp} value={form.ogDescription} onChange={e => setForm({ ...form, ogDescription: e.target.value })} rows={2} placeholder="Brief summary for social sharing..." />
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 20, marginTop: 20 }}>
          <h3 style={{ fontSize: "1rem", margin: "0 0 10px" }}>Custom Page Schema</h3>
          <div>
            <label style={s.lbl}>JSON-LD (Optional)</label>
            <textarea style={{ ...s.inp, fontFamily: "monospace", minHeight: 120 }} value={form.customSchema} onChange={e => setForm({ ...form, customSchema: e.target.value })} placeholder='{ "@context": "http://schema.org", "@type": "Product", ... }' />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 30 }}>
          <button onClick={() => router.push("/admin/seo")} style={s.cancelBtn}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={s.saveBtn}>{saving ? "Saving..." : "Save Settings"}</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  mainContainer: { padding: "20px", background: "#f4f5f7", minHeight: "100vh", color: "#000" },
  actionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  pageTitle: { fontSize: "1.5rem", fontWeight: "bold", margin: "10px 0 0 0" },
  backBtn: { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.9rem", padding: 0 },
  alert: { padding: "12px", marginBottom: "20px", borderRadius: "4px" },
  center: { textAlign: "center", padding: "40px", color: "#888" },
  card: { background: "#fff", padding: "30px", borderRadius: "8px", border: "1px solid #ddd" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  lbl: { display: "block", marginBottom: "6px", fontSize: "0.85rem", fontWeight: "bold", color: "#333" },
  inp: { width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "0.9rem" },
  cancelBtn: { background: "#fff", border: "1px solid #ccc", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" },
  saveBtn: { background: "#000", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" },
};
