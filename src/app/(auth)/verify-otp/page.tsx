"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) newOtp[i] = text[i] || "";
    setOtp(newOtp);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setLoading(false);
        return;
      }
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setResendLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend OTP.");
      } else {
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>S</div>
          <span style={styles.logoText}>AION LUXURY</span>
        </div>

        <div style={styles.iconWrap}>
          <span style={{ fontSize: 32 }}>✉️</span>
        </div>

        <h1 style={styles.heading}>Check your email</h1>
        <p style={styles.subtext}>
          We sent a 6-digit verification code to{" "}
          {email ? <strong>{email}</strong> : "your email"}
        </p>

        {success && <div style={styles.successBox}>✓ {success}</div>}
        {error && <div style={styles.errorBox}>⚠ {error}</div>}

        <form onSubmit={handleVerify} style={styles.form}>
          {!emailFromQuery && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          )}

          <div style={styles.otpWrap}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                style={{
                  ...styles.otpInput,
                  borderColor: digit ? "#000" : "#ddd",
                  background: digit ? "#000" : "#fff",
                  color: digit ? "#fff" : "#000",
                }}
              />
            ))}
          </div>

          <button
            id="verify-submit"
            type="submit"
            disabled={loading || otp.join("").length < 6}
            style={{
              ...styles.submitBtn,
              opacity: loading || otp.join("").length < 6 ? 0.5 : 1,
              cursor: loading || otp.join("").length < 6 ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div style={styles.resendWrap}>
          <span style={{ color: "#888", fontSize: "0.875rem" }}>Didn&apos;t receive the code?</span>
          <button
            id="resend-otp-btn"
            onClick={handleResend}
            disabled={resendLoading || countdown > 0 || !email}
            style={{
              ...styles.resendBtn,
              opacity: resendLoading || countdown > 0 ? 0.5 : 1,
              cursor: resendLoading || countdown > 0 ? "not-allowed" : "pointer",
            }}
          >
            {resendLoading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "#888" }}>
          <Link href="/login" style={{ color: "#000", fontWeight: 600, textDecoration: "none" }}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
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
    background: "#fff",
    border: "1px solid #e8e8e8",
    padding: "48px 40px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
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
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.25em",
    color: "#000",
  },
  iconWrap: {
    marginBottom: 16,
  },
  heading: {
    fontSize: "1.7rem",
    fontWeight: 400,
    color: "#000",
    marginBottom: 8,
    fontFamily: "var(--font-serif)",
  },
  subtext: {
    fontSize: "0.875rem",
    color: "#888",
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
    gap: 24,
    alignItems: "center",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    width: "100%",
    textAlign: "left",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#444",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
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
  otpWrap: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  otpInput: {
    width: 48,
    height: 56,
    fontSize: "1.4rem",
    fontWeight: 700,
    textAlign: "center",
    border: "1.5px solid #ddd",
    borderRadius: 0,
    outline: "none",
    transition: "all 0.15s",
    cursor: "text",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#000",
    color: "#fff",
    border: "none",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    borderRadius: 0,
  },
  resendWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  resendBtn: {
    background: "none",
    border: "none",
    color: "#000",
    fontWeight: 700,
    fontSize: "0.875rem",
    textDecoration: "underline",
    fontFamily: "var(--font-sans)",
  },
};
