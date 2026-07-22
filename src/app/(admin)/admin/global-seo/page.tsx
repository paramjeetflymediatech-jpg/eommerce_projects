"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface GlobalSeo {
  businessName?: string;
  logoUrl?: string;
  phoneNumber?: string;
  emailAddress?: string;
  businessDescription?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  latitude?: string;
  longitude?: string;
  socialProfileUrls?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  customGlobalSchema?: string;
  headerScripts?: string;
  footerScripts?: string;
}

const emptyForm = (): GlobalSeo => ({
  businessName: "",
  logoUrl: "",
  phoneNumber: "",
  emailAddress: "",
  businessDescription: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "",
  latitude: "",
  longitude: "",
  socialProfileUrls: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  customGlobalSchema: "",
  headerScripts: "",
  footerScripts: "",
});

export default function AdminGlobalSeoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<GlobalSeo>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/admin/login");
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      fetch("/api/admin/global-seo")
        .then(r => r.json())
        .then(data => {
          if (data && !data.error) {
            setForm({
              businessName: data.businessName || "",
              logoUrl: data.logoUrl || "",
              phoneNumber: data.phoneNumber || "",
              emailAddress: data.emailAddress || "",
              businessDescription: data.businessDescription || "",
              streetAddress: data.streetAddress || "",
              city: data.city || "",
              state: data.state || "",
              postalCode: data.postalCode || "",
              countryCode: data.countryCode || "",
              latitude: data.latitude || "",
              longitude: data.longitude || "",
              socialProfileUrls: data.socialProfileUrls || "",
              googleAnalyticsId: data.googleAnalyticsId || "",
              googleTagManagerId: data.googleTagManagerId || "",
              customGlobalSchema: data.customGlobalSchema || "",
              headerScripts: data.headerScripts || "",
              footerScripts: data.footerScripts || "",
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const handleSave = async () => {
    setSaving(true);
    setMsg({ text: "", type: "" });
    try {
      const res = await fetch("/api/admin/global-seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg({ text: "Global SEO settings saved successfully!", type: "success" });
        setTimeout(() => {
          router.push("/admin/seo");
        }, 1000);
      } else {
        const d = await res.json();
        setMsg({ text: d.error || "Failed to save.", type: "error" });
      }
    } catch {
      setMsg({ text: "Network error occurred.", type: "error" });
    }
    setSaving(false);
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingImg(true);
    const fd = new FormData();
    fd.append("files", e.target.files[0]);
    fd.append("folder", "seo");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.urls?.[0]) {
        setForm({ ...form, logoUrl: data.urls[0] });
      } else {
        setMsg({ text: data.error || "Upload failed.", type: "error" });
      }
    } catch {
      setMsg({ text: "Upload error.", type: "error" });
    }
    setUploadingImg(false);
  };

  if (status === "loading" || loading) return <div style={s.center}>Loading Settings...</div>;

  return (
    <div style={s.mainContainer}>
      <div style={s.actionHeader}>
        <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>Configure global SEO, business schema, and tracking scripts.</p>
      </div>

      {msg.text && (
        <div style={{ ...s.alert, background: msg.type === "error" ? "#FFF5F5" : "#F0FDF4", color: msg.type === "error" ? "#DC2626" : "#15803D" }}>
          {msg.text}
        </div>
      )}

      <div style={s.card}>
        <h2 style={s.sectionTitle}>1. Business Schema Details</h2>
        <div style={s.grid2}>
          <div>
            <label style={s.lbl}>Business Name</label>
            <input style={s.inp} value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} placeholder="e.g. Flymedia Technology" />
          </div>
          <div>
            <label style={s.lbl}>Logo URL</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input style={{ ...s.inp, flex: 1 }} value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://..." />
              <label style={s.uploadBtn}>
                {uploadingImg ? "..." : "Upload"}
                <input type="file" style={{ display: "none" }} onChange={uploadFile} accept="image/*" />
              </label>
            </div>
          </div>
          <div>
            <label style={s.lbl}>Phone Number</label>
            <input style={s.inp} value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+91 98884 84310" />
          </div>
          <div>
            <label style={s.lbl}>Email Address</label>
            <input style={s.inp} value={form.emailAddress} onChange={e => setForm({ ...form, emailAddress: e.target.value })} placeholder="info@flymediatech.com" />
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <label style={s.lbl}>Business Description</label>
          <textarea style={s.inp} rows={3} value={form.businessDescription} onChange={e => setForm({ ...form, businessDescription: e.target.value })} placeholder="Briefly describe your business for SEO..." />
        </div>

        <div style={{ marginTop: 15, ...s.grid2 }}>
          <div>
            <label style={s.lbl}>Street Address</label>
            <input style={s.inp} value={form.streetAddress} onChange={e => setForm({ ...form, streetAddress: e.target.value })} placeholder="Plot no, 20..." />
          </div>
          <div>
            <label style={s.lbl}>City</label>
            <input style={s.inp} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Ludhiana" />
          </div>
          <div>
            <label style={s.lbl}>State / Region</label>
            <input style={s.inp} value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Punjab" />
          </div>
          <div>
            <label style={s.lbl}>Postal Code</label>
            <input style={s.inp} value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} placeholder="141001" />
          </div>
          <div>
            <label style={s.lbl}>Country</label>
            <input style={s.inp} value={form.countryCode} onChange={e => setForm({ ...form, countryCode: e.target.value })} placeholder="India" />
          </div>
        </div>

        <div style={{ marginTop: 15, ...s.grid2 }}>
          <div>
            <label style={s.lbl}>Latitude</label>
            <input style={s.inp} value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="e.g. 30.900965" />
          </div>
          <div>
            <label style={s.lbl}>Longitude</label>
            <input style={s.inp} value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="e.g. 75.857277" />
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <label style={s.lbl}>Social Profile URLs (Space separated)</label>
          <textarea style={s.inp} rows={2} value={form.socialProfileUrls} onChange={e => setForm({ ...form, socialProfileUrls: e.target.value })} placeholder="https://facebook.com/... https://instagram.com/..." />
        </div>
      </div>

      <div style={s.card}>
        <h2 style={s.sectionTitle}>2. Google Tracking & Analytics</h2>
        <div style={s.grid2}>
          <div>
            <label style={s.lbl}>Google Analytics ID (GA4)</label>
            <input style={s.inp} value={form.googleAnalyticsId} onChange={e => setForm({ ...form, googleAnalyticsId: e.target.value })} placeholder="e.g. G-XXXXXXX" />
          </div>
          <div>
            <label style={s.lbl}>Google Tag Manager ID</label>
            <input style={s.inp} value={form.googleTagManagerId} onChange={e => setForm({ ...form, googleTagManagerId: e.target.value })} placeholder="e.g. GTM-XXXXXXX" />
          </div>
        </div>
      </div>

      <div style={s.card}>
        <h2 style={s.sectionTitle}>3. Custom Schema & Scripts</h2>
        
        <div>
          <label style={s.lbl}>Custom Global Schema (JSON-LD Fallback)</label>
          <textarea style={{ ...s.inp, fontFamily: "monospace", minHeight: 150 }} value={form.customGlobalSchema} onChange={e => setForm({ ...form, customGlobalSchema: e.target.value })} placeholder='{ "@context": "http://schema.org", "@type": "Organization", ... }' />
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={s.lbl}>Header Scripts (Injected into &lt;head&gt;)</label>
          <textarea style={{ ...s.inp, fontFamily: "monospace", minHeight: 150 }} value={form.headerScripts} onChange={e => setForm({ ...form, headerScripts: e.target.value })} placeholder='<meta name="facebook-domain-verification" content="..." />&#10;<script>...</script>' />
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={s.lbl}>Footer Scripts (Injected before &lt;/body&gt;)</label>
          <textarea style={{ ...s.inp, fontFamily: "monospace", minHeight: 150 }} value={form.footerScripts} onChange={e => setForm({ ...form, footerScripts: e.target.value })} placeholder='<script>...</script>' />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button onClick={handleSave} disabled={saving} style={s.saveBtn}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  mainContainer: { padding: "20px", background: "#f4f5f7", minHeight: "100vh", color: "#000" },
  actionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  saveBtn: { background: "#000", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  alert: { padding: "12px", marginBottom: "20px", borderRadius: "4px" },
  center: { textAlign: "center", padding: "40px", color: "#888" },
  card: { background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "20px" },
  sectionTitle: { fontSize: "1.2rem", fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  lbl: { display: "block", marginBottom: "6px", fontSize: "0.85rem", fontWeight: "bold", color: "#333" },
  inp: { width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "0.9rem" },
  uploadBtn: { background: "#eee", padding: "10px 16px", cursor: "pointer", borderRadius: "4px", fontSize: "0.85rem", display: "flex", alignItems: "center" },
};
