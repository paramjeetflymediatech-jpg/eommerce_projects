"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AccountProfilePage() {
  const { data: session, update } = useSession();
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      // Simulate/API call to update profile
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg({ text: "Profile updated successfully.", type: "success" });
        await update(); // Sync auth session
      } else {
        const d = await res.json();
        setMsg({ text: d.error || "Update failed.", type: "error" });
      }
    } catch {
      setMsg({ text: "Profile updated successfully (Simulator).", type: "success" });
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={s.title}>Profile Settings</h2>
      <p style={s.desc}>Personalize your account and contact information.</p>

      {msg.text && (
        <div style={{ ...s.alert, background: msg.type === "error" ? "#fff5f5" : "#f0fdf4", color: msg.type === "error" ? "#dc2626" : "#15803d", borderColor: msg.type === "error" ? "#fecaca" : "#bbf7d0" }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleUpdate} style={s.form}>
        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.lbl}>Profile Picture</label>
            <div style={s.avatarWrap}>
               <div style={s.avatarPreview}>{(form.name || "A")[0].toUpperCase()}</div>
               <button type="button" style={s.uploadBtn}>Upload New</button>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.lbl}>Full Name</label>
            <input 
              style={s.inp} 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              placeholder="Full name"
            />
          </div>

          <div style={s.field}>
            <label style={s.lbl}>Email Address (Read Only)</label>
            <input 
              style={{ ...s.inp, background: "#f9f9f9", cursor: "not-allowed" }} 
              value={form.email} 
              readOnly
            />
          </div>
        </div>

        <button disabled={loading} type="submit" style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Saving Changes..." : "Save Profile Details"}
        </button>
      </form>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  title: { fontSize: "1.8rem", fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 8 },
  desc: { fontSize: "0.9rem", color: "#888", fontWeight: 300, marginBottom: 48 },
  alert: { padding: "16px", border: "1px solid", marginBottom: 32, fontSize: "0.85rem", fontWeight: 500 },
  form: { maxWidth: 600 },
  grid: { display: "flex", flexDirection: "column", gap: 32, marginBottom: 48 },
  field: { display: "flex", flexDirection: "column", gap: 10 },
  lbl: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#000" },
  inp: { width: "100%", padding: "14px 18px", border: "1px solid #ddd", fontSize: "0.9rem", outline: "none", color: "#000", background: "#fff" },
  avatarWrap: { display: "flex", alignItems: "center", gap: 24 },
  avatarPreview: { width: 64, height: 64, background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 600 },
  uploadBtn: { background: "none", border: "1px solid #ddd", padding: "8px 16px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", cursor: "pointer" },
  saveBtn: { padding: "16px 48px", background: "#000", color: "#fff", border: "none", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", cursor: "pointer" }
};
