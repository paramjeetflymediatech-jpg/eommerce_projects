"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      isAdminLogin: "true",
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "EMAIL_NOT_VERIFIED") {
        setError("Email not verified. Please verify your account first.");
      } else if (result.error === "ADMIN_NOT_ALLOWED_IN_STOREFRONT") {
        setError("Please login via the dedicated admin portal.");
      } else {
        setError("Invalid credentials.");
      }
      setLoading(false);
      return;
    }

    // Fetch session to check role
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user?.role !== "ADMIN") {
      setError("Access denied. Admin accounts only.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.loginContainer} className="login-container">
        {/* Visual Side (Left) */}
        <div style={styles.visualSide} className="desktop-only">
          <div style={styles.visualContent}>
            <h2 style={styles.visualTitle}>Aion Luxury</h2>
            <p style={styles.visualText}>
              Exclusive Administration Portal <br />
              <span style={{ fontSize: "0.85rem", opacity: 0.5, letterSpacing: "normal" }}>Est. 2024</span>
            </p>
          </div>
          <div style={styles.visualOverlay} />
        </div>

        {/* Form Side (Right) */}
        <div style={styles.formSide} className="form-side">
          <div style={styles.formContainer}>
            <div style={styles.header}>
              <h1 style={styles.title}>Admin Login</h1>
              <p style={styles.subtitle}>Secure Access Required</p>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Identity</label>
                <input
                  id="admin-email"
                  required
                  type="email"
                  placeholder="name@aionluxury.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Security Key</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="admin-password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ ...styles.input, paddingRight: "40px" }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.toggleBtn}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>
              <button
                id="admin-login-submit"
                type="submit"
                disabled={loading}
                style={{ ...styles.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
              >
                {loading ? "Authenticating..." : "Enter Portal"}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Unauthorized access is strictly prohibited.
              </p>
              <Link href="/" style={styles.link}>← Return to Boutique</Link>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
          .login-container { 
            margin: 0 !important; 
            max-width: 100% !important; 
            height: 100vh !important; 
            min-height: auto !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .form-side {
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f7f7",
    color: "#fff",
    fontFamily: "var(--font-sans)",
  },
  loginContainer: {
    width: "100%",
    maxWidth: "1100px",
    height: "auto",
    minHeight: "680px",
    display: "flex",
    background: "#fff",
    boxShadow: "0 100px 100px -50px rgba(0,0,0,0.5)",
    margin: "20px",
    overflow: "hidden",
  },
  visualSide: {
    flex: 1.2,
    background: "url('/admin_login_visual_1774696483602.png')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    padding: "60px",
    borderRight: "1px solid rgba(0,0,0,0.05)",
  },
  visualContent: {
    position: "relative",
    zIndex: 2,
  },
  visualTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "3.5rem",
    fontWeight: 400,
    letterSpacing: "normal",
    marginBottom: "16px",
    color: "#fff",
    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  visualText: {
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    lineHeight: 2,
    color: "#fff",
    opacity: 0.9,
    textShadow: "0 1px 5px rgba(0,0,0,0.3)",
  },
  visualOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%, rgba(0,0,0,0.4) 100%)",
    zIndex: 1,
  },
  formSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "clamp(40px, 8vw, 80px)",
    background: "#fff",
  },
  formContainer: {
    maxWidth: "380px",
    width: "100%",
    margin: "0 auto",
  },
  header: {
    marginBottom: "48px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "2.2rem",
    fontWeight: 400,
    color: "#000",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#999",
    letterSpacing: "normal",
  },
  errorBox: {
    background: "#000",
    color: "#fff",
    padding: "16px",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    marginBottom: "32px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#aaa",
    letterSpacing: "normal",
  },
  input: {
    width: "100%",
    padding: "16px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #e0e0e0",
    color: "#000",
    fontSize: "0.95rem",
    fontWeight: 500,
    outline: "none",
    transition: "border-color 0.3s",
    borderRadius: 0,
  },
  btn: {
    width: "100%",
    padding: "20px",
    background: "#000",
    color: "#fff",
    border: "none",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    marginTop: "16px",
    transition: "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
    borderRadius: 0,
  },
  footer: {
    marginTop: "64px",
    paddingTop: "32px",
    borderTop: "1px solid #f2f2f2",
  },
  footerText: {
    fontSize: "0.7rem",
    color: "#ccc",
    marginBottom: "16px",
    fontStyle: "italic",
  },
  link: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#000",
    textDecoration: "none",
    letterSpacing: "normal",
  },
  toggleBtn: {
    position: "absolute",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    color: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s",
  },
};
