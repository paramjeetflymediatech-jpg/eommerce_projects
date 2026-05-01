"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";

function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2. Password length check
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // 3. Password complexity (letter + number)
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(form.password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    // 4. Confirm match
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }
      // Temporarily store password for auto-login after OTP verification
      sessionStorage.setItem("signup_password", form.password);
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColor = ["transparent", "#EF4444", "#F59E0B", "#10B981"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>S</div>
          <span style={styles.logoText}>Aion Luxury</span>
        </div>

        <h1 style={styles.heading}>Create account</h1>
        <p style={styles.subtext}>Join Aion Luxury and start shopping</p>

        {error && (
          <div style={styles.rightToast}>
            <div style={styles.toastInner}>
              <span style={{ fontSize: "1.2rem" }}>⚠</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: "0.85rem", letterSpacing: "normal" }}>Account Error</p>
                <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.4 }}>{error}</p>
              </div>
              <button onClick={() => setError("")} style={styles.toastClose}>✕</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              id="reg-name"
              required
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              id="reg-email"
              required
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="reg-password"
                required
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...styles.input, paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {form.password.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <div style={styles.strengthBar}>
                  <div style={{ ...styles.strengthFill, width: `${(strength / 3) * 100}%`, background: strengthColor }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              id="reg-confirm"
              required
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              style={{
                ...styles.input,
                borderColor: form.confirm && form.confirm !== form.password ? "#EF4444" : "#ddd",
              }}
            />
            {form.confirm && form.confirm !== form.password && (
              <span style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>Passwords do not match</span>
            )}
          </div>

          <button
            id="reg-submit"
            type="submit"
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>

        <GoogleButton text="Sign up with Google" />

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
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
  strengthBar: {
    height: 3,
    background: "#eee",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  strengthFill: {
    height: "100%",
    transition: "width 0.3s, background 0.3s",
    borderRadius: 2,
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
    marginTop: 4,
    borderRadius: 0,
  },
  footer: {
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#666",
    marginTop: 24,
  },
  link: {
    color: "#000",
    fontWeight: 600,
    textDecoration: "none",
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
};

