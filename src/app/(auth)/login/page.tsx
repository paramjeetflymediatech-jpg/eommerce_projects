"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "white", margin: "0 auto 20px", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>S</div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: "var(--text-secondary)" }}>Sign in to your ShopNest account</p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#f87171", fontSize: "0.9rem" }}>
              ⚠ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Email Address</label>
              <input required type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Password</label>
              <input required type="password" className="input" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: "14px", marginTop: 8 }}>
              {loading ? "⏳ Signing in..." : "Sign In →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "var(--primary-light)", fontWeight: 600, textDecoration: "none" }}>Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
