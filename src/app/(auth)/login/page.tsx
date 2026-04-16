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
      if (result.error === "EMAIL_NOT_VERIFIED") {
        setError("Your email is not verified. Please check your inbox for the OTP code.");
      } else if (result.error === "ADMIN_NOT_ALLOWED") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
      setLoading(false);
    } else {
      // Fetch session to check role
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
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logo}>S</div>
          <span style={styles.logoText}>Aion Luxury</span>
        </div>

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subtext}>Sign in to your account to continue</p>

        {error && (
          <div style={styles.rightToast}>
            <div style={styles.toastInner}>
              <span style={{ fontSize: "1.2rem" }}>⚠</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: "0.85rem", letterSpacing: "normal" }}>Credential Error</p>
                <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.4 }}>{error}</p>
                {error.includes("not verified") && (
                  <div style={{ marginTop: 8 }}>
                    <Link href="/verify-otp" style={styles.inlineLink}>
                      Verify your email →
                    </Link>
                  </div>
                )}
              </div>
              <button onClick={() => setError("")} style={styles.toastClose}>✕</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              id="login-email"
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                required
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...styles.input, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div style={styles.forgotWrap}>
            <Link href="/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span style={styles.spinnerWrap}><span style={styles.spinner} /> Signing in...</span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>

        <GoogleButton text="Continue with Google" />

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={styles.link}>
            Create one →
          </Link>
        </p>
      </div>
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

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9f9f7",
    padding: "24px 16px",
    fontFamily: "var(--font-sans)",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "#ffffff",
    border: "1px solid #e8e8e8",
    padding: "48px 40px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 32,
  },
  logo: {
    width: 40,
    height: 40,
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: 1,
  },
  logoText: {
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    color: "#000",
  },
  heading: {
    fontSize: "1.7rem",
    fontWeight: 400,
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "var(--font-serif)",
  },
  subtext: {
    fontSize: "0.875rem",
    color: "#888",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: 300,
  },
  errorBox: {
    background: "#FFF5F5",
    border: "1px solid #FECACA",
    padding: "12px 16px",
    marginBottom: 24,
    color: "#DC2626",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#444",
    letterSpacing: "normal",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "0.95rem",
    border: "1px solid #ddd",
    borderRadius: 0,
    outline: "none",
    background: "#fff",
    color: "#000",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: 4,
  },
  forgotWrap: {
    textAlign: "right",
    marginTop: -8,
  },
  forgotLink: {
    fontSize: "0.8rem",
    color: "#666",
    textDecoration: "none",
    fontWeight: 500,
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#000",
    color: "#fff",
    border: "none",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    cursor: "pointer",
    transition: "background 0.3s",
    marginTop: 4,
    borderRadius: 0,
  },
  spinnerWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "28px 0 20px",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#eee",
  },
  dividerText: {
    fontSize: "0.85rem",
    color: "#aaa",
    letterSpacing: "normal",
  },
  footer: {
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#666",
  },
  link: {
    color: "#000",
    fontWeight: 600,
    textDecoration: "none",
  },
  inlineLink: {
    color: "#DC2626",
    fontWeight: 600,
    textDecoration: "underline",
  },
  rightToast: {
    position: "fixed",
    top: 40,
    right: 40,
    width: "100%",
    maxWidth: 320,
    zIndex: 1000,
    animation: "slideIn 0.3s ease-out",
  },
  toastInner: {
    background: "#000",
    color: "#fff",
    padding: "16px 20px",
    display: "flex",
    gap: 16,
    alignItems: "center",
    fontSize: "0.85rem",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    borderLeft: "4px solid #EF4444",
  },
  toastClose: {
    background: "none",
    border: "none",
    color: "#fff",
    opacity: 0.5,
    cursor: "pointer",
    fontSize: "1rem",
    padding: 0,
  },
};

