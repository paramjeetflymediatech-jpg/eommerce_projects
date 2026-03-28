"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/");
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "white", margin: "0 auto 20px", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>S</div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: "var(--text-secondary)" }}>Join ShopNest and start shopping</p>
        </div>
        <div className="card" style={{ padding: 36 }}>
          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#f87171", fontSize: "0.9rem" }}>⚠ {error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Full Name</label><input required className="input" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Email Address</label><input required type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Password</label><input required type="password" className="input" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Confirm Password</label><input required type="password" className="input" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: "14px", marginTop: 8 }}>
              {loading ? "⏳ Creating account..." : "Create Account →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary-light)", fontWeight: 600, textDecoration: "none" }}>Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
