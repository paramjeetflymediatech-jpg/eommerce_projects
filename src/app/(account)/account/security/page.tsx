"use client";
import { useState } from "react";

export default function AccountSecurityPage() {
  const [msg, setMsg] = useState({ text: "", type: "" });

  return (
    <div>
      <h2 style={s.title}>Password & Security</h2>
      <p style={s.desc}>Maintain the security of your account by updating your credentials.</p>

      {msg.text && (
        <div style={{ ...s.alert, background: msg.type === "error" ? "#fff5f5" : "#f0fdf4", color: msg.type === "error" ? "#dc2626" : "#15803d" }}>
          {msg.text}
        </div>
      )}

      <div style={s.form}>
        <div style={s.section}>
          <h3 style={s.secTitle}>Change Password</h3>
          <div style={s.grid}>
             <div style={s.field}>
               <label style={s.lbl}>Current Password</label>
               <input style={s.inp} type="password" placeholder="••••••••" />
             </div>
             <div style={s.field}>
               <label style={s.lbl}>New Password</label>
               <input style={s.inp} type="password" placeholder="••••••••" />
             </div>
             <div style={s.field}>
               <label style={s.lbl}>Confirm New Password</label>
               <input style={s.inp} type="password" placeholder="••••••••" />
             </div>
          </div>
          <button style={s.saveBtn}>Update Password</button>
        </div>

        <div style={s.hr} />

        <div style={s.section}>
          <h3 style={s.secTitle}>Session Management</h3>
          <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: 20 }}>Signing out will clear all active sessions on this device.</p>
          <button 
            style={{ ...s.saveBtn, background: "none", border: "1px solid #ff4d4d", color: "#ff4d4d" }}
          >
            Sign Out from all devices
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  title: { fontSize: "1.8rem", fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 8 },
  desc: { fontSize: "0.9rem", color: "#888", fontWeight: 300, marginBottom: 48 },
  alert: { padding: "16px", marginBottom: 32, fontSize: "0.85rem" },
  form: { maxWidth: 500 },
  section: { display: "flex", flexDirection: "column", gap: 32 },
  secTitle: { fontSize: "0.95rem", fontWeight: 700, letterSpacing: "normal", color: "#000" },
  grid: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  lbl: { fontSize: "0.85rem", fontWeight: 700, color: "#888", letterSpacing: "normal" },
  inp: { width: "100%", padding: "14px 18px", border: "1px solid #ddd", fontSize: "0.9rem", color: "#000", outline: "none", background: "#fff" },
  saveBtn: { padding: "16px 32px", background: "#000", color: "#fff", border: "none", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", cursor: "pointer", width: "fit-content" },
  hr: { height: 1, background: "#eee", margin: "48px 0" }
};
