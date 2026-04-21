"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function AccountSecurityPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      return setMsg({ text: "New passwords do not match.", type: "error" });
    }

    if (form.newPassword.length < 8) {
      return setMsg({ text: "New password must be at least 8 characters.", type: "error" });
    }

    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/account/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ text: "Password updated successfully. You will be signed out shortly.", type: "success" });
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => signOut({ callbackUrl: "/login" }), 3000);
      } else {
        setMsg({ text: data.error || "Update failed.", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "An error occurred. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={s.title}>Password & Security</h2>
      <p style={s.desc}>Maintain the security of your account by updating your credentials.</p>

      {msg.text && (
        <div style={{ 
          ...s.alert, 
          background: msg.type === "error" ? "#fff5f5" : "#f0fdf4", 
          color: msg.type === "error" ? "#dc2626" : "#15803d",
          borderColor: msg.type === "error" ? "#fecaca" : "#bbf7d0"
        }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleUpdate} style={s.form}>
        <div style={s.section}>
          <h3 style={s.secTitle}>Change Password</h3>
          <div style={s.grid}>
             <div style={s.field}>
               <label style={s.lbl}>Current Password</label>
               <input 
                 style={s.inp} 
                 type={showPassword ? "text" : "password"} 
                 placeholder="••••••••" 
                 value={form.currentPassword}
                 onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                 required
               />
             </div>
             
             <div style={s.field}>
               <label style={s.lbl}>New Password</label>
               <input 
                 style={s.inp} 
                 type={showPassword ? "text" : "password"} 
                 placeholder="••••••••" 
                 value={form.newPassword}
                 onChange={e => setForm({ ...form, newPassword: e.target.value })}
                 required
               />
               <p style={{ fontSize: "0.7rem", color: "#888", marginTop: 4 }}>Minimum 8 characters.</p>
             </div>

             <div style={s.field}>
               <label style={s.lbl}>Confirm New Password</label>
               <input 
                 style={s.inp} 
                 type={showPassword ? "text" : "password"} 
                 placeholder="••••••••" 
                 value={form.confirmPassword}
                 onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                 required
               />
             </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: -8, marginBottom: 8 }}>
            <input 
              type="checkbox" 
              id="show-pass" 
              checked={showPassword} 
              onChange={() => setShowPassword(!showPassword)} 
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="show-pass" style={{ fontSize: "0.8rem", color: "#666", cursor: "pointer" }}>Show Passwords</label>
          </div>

          <button disabled={loading} type="submit" style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>

        <div style={s.hr} />

        <div style={s.section}>
          <h3 style={s.secTitle}>Session Management</h3>
          <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: 20 }}>
            If you suspect unauthorized access, click below to sign out from all other active sessions.
          </p>
          <button 
            type="button"
            onClick={() => signOut()}
            style={{ ...s.saveBtn, background: "none", border: "1px solid #ff4d4d", color: "#ff4d4d" }}
          >
            Sign Out from all devices
          </button>
        </div>
      </form>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  title: { fontSize: "1.8rem", fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 8 },
  desc: { fontSize: "0.9rem", color: "#888", fontWeight: 300, marginBottom: 48 },
  alert: { padding: "16px", border: "1px solid", marginBottom: 32, fontSize: "0.85rem", fontWeight: 500 },
  form: { maxWidth: 500 },
  section: { display: "flex", flexDirection: "column", gap: 24 },
  secTitle: { fontSize: "0.95rem", fontWeight: 700, letterSpacing: "normal", color: "#000" },
  grid: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  lbl: { fontSize: "0.85rem", fontWeight: 700, color: "#888", letterSpacing: "normal" },
  inp: { width: "100%", padding: "14px 18px", border: "1px solid #ddd", fontSize: "0.9rem", color: "#000", outline: "none", background: "#fff", transition: "border-color 0.2s" },
  saveBtn: { padding: "16px 32px", background: "#000", color: "#fff", border: "none", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", cursor: "pointer", width: "fit-content", transition: "opacity 0.2s" },
  hr: { height: 1, background: "#eee", margin: "48px 0" }
};
