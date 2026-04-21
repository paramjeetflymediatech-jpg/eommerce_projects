"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      isAdminLogin: callbackUrl.includes("/admin") ? "true" : "false",
    });
    if (result?.error) {
      setError("The credentials provided are incorrect. Please try again.");
      setLoading(false);
    } else {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push(callbackUrl);
      }
    }
  };

  return (
    <div style={s.page}>
      {/* LEFT SIDE: IMMERSIVE VISUAL */}
      <div style={s.visualSide}>
        <div style={s.visualOverlay} />
        <div style={s.brandingWrap}>
          <img src="/logo.png" alt="Aion Luxury" style={s.visualLogo} />
          <h2 style={s.visualSlogan}>The Atelier of Modern Elegance</h2>
          <div style={s.aestheticDivider} />
          {/* <p style={s.visualCreds}>Standardized Excellence since 1994</p> */}
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div style={s.formSide}>
        <div style={s.formInner}>
          <header style={s.formHeader}>
            <h1 style={s.heading}>Welcome Back</h1>
            <p style={s.subtext}>Enter your credentials to access your private collection.</p>
          </header>

          {error && (
            <div style={s.errorAlert}>
              <span style={{ fontSize: "1.1rem" }}>✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input
                required
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={s.input}
              />
            </div>

            <div style={s.field}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={s.label}>Password</label>
                <Link href="/forgot-password" style={s.forgotLink}>Forgot Password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  required
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ ...s.input, paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={s.eyeBtn}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Authenticating..." : "Sign In to Aion"}
            </button>
          </form>

          <div style={s.divider}>
            <span style={s.dividerLine} />
            <span style={s.dividerText}>Social Connection</span>
            <span style={s.dividerLine} />
          </div>

          <GoogleButton text="Continue with Google" />

          <footer style={s.authFooter}>
            New to the Atelier?{" "}
            <Link href="/register" style={s.link}>Create an account →</Link>
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(1.05); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", background: "#fff", isolation: "isolate" },
  visualSide: { 
    flex: 1, 
    background: "url('/auth-bg.png') center/cover", 
    position: "relative",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    overflow: "hidden"
  },
  visualOverlay: { 
    position: "absolute", 
    inset: 0, 
    background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
  },
  brandingWrap: { 
    position: "relative", 
    zIndex: 1, 
    textAlign: "center", 
    color: "#fff",
    padding: 40,
    animation: "scaleIn 1.5s ease-out forwards"
  },
  visualLogo: { width: 120, height: "auto", marginBottom: 24, filter: "brightness(0) invert(1)" },
  visualSlogan: { fontSize: "1.2rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 32 },
  aestheticDivider: { width: 60, height: 1, background: "rgba(255,255,255,0.4)", margin: "0 auto 32px" },
  visualCreds: { fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.6 },
  
  formSide: { 
    width: "100%", 
    maxWidth: 600, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 40,
    background: "#fff"
  },
  formInner: { width: "100%", maxWidth: 400, animation: "fadeIn 0.8s ease-out forwards" },
  formHeader: { marginBottom: 40 },
  heading: { fontSize: "2.2rem", fontWeight: 400, fontFamily: "var(--font-serif)", color: "#000", marginBottom: 12 },
  subtext: { fontSize: "0.95rem", color: "#888", fontWeight: 300, lineHeight: 1.6 },
  
  errorAlert: { background: "#000", color: "#fff", padding: "16px 20px", marginBottom: 32, fontSize: "0.85rem", display: "flex", gap: 12, alignItems: "center" },
  
  form: { display: "flex", flexDirection: "column", gap: 28 },
  field: { display: "flex", flexDirection: "column", gap: 10 },
  label: { fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#000" },
  input: { 
    width: "100%", padding: "14px 0", border: "none", borderBottom: "1px solid #eee", 
    fontSize: "1rem", outline: "none", background: "transparent", color: "#000",
    transition: "border-color 0.3s"
  },
  eyeBtn: { position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", opacity: 0.4 },
  forgotLink: { fontSize: "0.75rem", color: "#888", textDecoration: "none" },
  
  submitBtn: { width: "100%", padding: "18px", background: "#000", color: "#fff", border: "none", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", marginTop: 12 },
  
  divider: { display: "flex", alignItems: "center", gap: 16, margin: "40px 0" },
  dividerLine: { flex: 1, height: 1, background: "#f0f0f0" },
  dividerText: { fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaa" },
  
  authFooter: { textAlign: "center", marginTop: 40, fontSize: "0.9rem", color: "#888", fontWeight: 300 },
  link: { color: "#000", fontWeight: 600, textDecoration: "none" }
};

