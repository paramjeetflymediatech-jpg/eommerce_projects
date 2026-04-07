"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function LogoutPage() {
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    // Perform actual sign out from NextAuth
    // We pass redirect: false so we can show our own "Thank you" screen
    signOut({ redirect: false }).then(() => {
      setSignedOut(true);
    });
  }, []);

  return (
    <div style={s.layout}>
      <div style={s.card}>
        <div style={s.iconArea}>
          {signedOut ? (
             <span style={s.check}>✓</span>
          ) : (
             <div style={s.loader} />
          )}
        </div>
        
        <h1 style={s.title}>
          {signedOut ? "Signed Out Successfully" : "Signing you out..."}
        </h1>
        
        <p style={s.subtitle}>
          {signedOut 
            ? "Thank you for choosing Aion Luxury. We look forward to your next visit."
            : "We are securely ending your session. Please wait a moment."
          }
        </p>

        {signedOut && (
          <div style={s.actions}>
            <Link href="/" style={s.btn}>Return to Storefront</Link>
            <Link href="/login" style={s.link}>Sign back in</Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  layout: { 
    minHeight: "100vh", background: "#fcfcfc", display: "flex", 
    alignItems: "center", justifyContent: "center", padding: 24 
  },
  card: { 
    maxWidth: 400, width: "100%", textAlign: "center", 
    padding: "64px 32px", background: "#fff", border: "1px solid #eee",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  },
  iconArea: { marginBottom: 32, display: "flex", justifyContent: "center" },
  check: { fontSize: "3rem", color: "#000", fontWeight: 300 },
  loader: { 
    width: 48, height: 48, border: "2px solid #eee", 
    borderTopColor: "#000", borderRadius: "50%",
    animation: "rotate 0.8s linear infinite"
  },
  title: { fontSize: "1.5rem", fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 16 },
  subtitle: { fontSize: "0.9rem", color: "#888", fontWeight: 300, lineHeight: 1.6, marginBottom: 40 },
  actions: { display: "flex", flexDirection: "column", gap: 16 },
  btn: { 
    background: "#000", color: "#fff", textDecoration: "none", 
    padding: "14px 32px", fontSize: "0.75rem", fontWeight: 700, 
    textTransform: "uppercase", letterSpacing: "0.15em" 
  },
  link: { fontSize: "0.7rem", color: "#888", textDecoration: "none", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }
};
