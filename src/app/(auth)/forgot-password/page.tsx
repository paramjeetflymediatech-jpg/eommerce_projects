"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "email" | "otp";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to process request.");
        setLoading(false);
        return;
      }
      setStep("otp");
      setSuccess(data.message || `A reset code has been sent to ${email}.`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(newPassword)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        setLoading(false);
        return;
      }
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>S</div>
          <span style={styles.logoText}>Aion Luxury</span>
        </div>

        {/* Step indicators */}
        <div style={styles.steps}>
          <div style={styles.stepItem}>
            <div style={{ ...styles.stepDot, background: "#000", color: "#fff" }}>1</div>
            <span style={{ ...styles.stepLabel, color: "#000" }}>Email</span>
          </div>
          <div style={{ ...styles.stepConnector, background: step === "otp" ? "#000" : "#ddd" }} />
          <div style={styles.stepItem}>
            <div style={{ ...styles.stepDot, background: step === "otp" ? "#000" : "#ddd", color: step === "otp" ? "#fff" : "#aaa" }}>2</div>
            <span style={{ ...styles.stepLabel, color: step === "otp" ? "#000" : "#aaa" }}>Reset</span>
          </div>
        </div>

        {step === "email" ? (
          <>
            <h1 style={styles.heading}>Forgot password?</h1>
            <p style={styles.subtext}>
              Enter your email and we'll send you a reset code.
            </p>

            {error && <div style={styles.errorBox}>⚠ {error}</div>}

            <form onSubmit={handleSendOtp} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  id="forgot-email"
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>
              <button
                id="forgot-submit"
                type="submit"
                disabled={loading}
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={styles.heading}>Reset password</h1>
            <p style={styles.subtext}>
              Enter the code sent to <strong>{email}</strong> and choose a new password.
            </p>

            {success && <div style={styles.successBox}>✓ {success}</div>}
            {error && <div style={styles.errorBox}>⚠ {error}</div>}

            <form onSubmit={handleResetPassword} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Verification Code</label>
                <input
                  id="reset-otp"
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  style={{ ...styles.input, letterSpacing: "0.3em", fontSize: "1.2rem", textAlign: "center" }}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reset-password"
                    required
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ ...styles.input, paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  id="reset-confirm"
                  required
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    ...styles.input,
                    borderColor: confirmPassword && confirmPassword !== newPassword ? "#EF4444" : "#ddd",
                  }}
                />
              </div>

              <button
                id="reset-submit"
                type="submit"
                disabled={loading}
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); setSuccess(""); }}
                style={styles.backBtn}
              >
                ← Change email
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "#888" }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color: "#000", fontWeight: 600, textDecoration: "none" }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
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
    background: "#fff",
    border: "1px solid #e8e8e8",
    padding: "48px 40px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 28,
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
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    gap: 0,
  },
  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: 700,
    transition: "all 0.3s",
  },
  stepConnector: {
    width: 60,
    height: 2,
    margin: "0 8px",
    marginBottom: 20,
    transition: "background 0.3s",
  },
  stepLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "normal",
    textTransform: "none",
    transition: "color 0.3s",
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
    lineHeight: 1.6,
  },
  successBox: {
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
    padding: "12px 16px",
    marginBottom: 24,
    color: "#15803D",
    fontSize: "0.875rem",
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
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#444",
    letterSpacing: "normal",
    textTransform: "none",
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
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#000",
    color: "#fff",
    border: "none",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
    textTransform: "none",
    cursor: "pointer",
    borderRadius: 0,
    marginTop: 4,
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "0.875rem",
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "var(--font-sans)",
    textDecoration: "underline",
  },
};
