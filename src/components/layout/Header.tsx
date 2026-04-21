"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const cartCount = useCartStore((s: any) => s.getCount());
  const openCart = useCartStore((s: any) => s.openCart);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const navLinks = [
    { label: "Shop All", href: "/products" },
    { label: "Story", href: "/about" },
    { label: "Stores", href: "/" },
    { label: "Track Order", href: "/track" },
    { label: "Account", href: session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/account" },
  ];

  const headerBg = "#fff";
  const headerBorder = "1px solid #e0e0e0";
  const textColor = "#000";

  return (
    <>
      <style jsx global>{`
        :root {
          --nav-text: ${textColor};
          --nav-bg: ${headerBg};
        }
      `}</style>

      {/* HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "var(--nav-bg)",
          borderBottom: headerBorder,
          height: 84,
          color: "var(--nav-text)",
          display: "flex",
          alignItems: "center",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="header-container">
          {/* LEFT - MENU */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 18, display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ height: 1.5, background: "var(--nav-text)", width: "100%", transition: "background 0.4s" }} />
                <span style={{ height: 1.5, background: "var(--nav-text)", width: "100%", transition: "background 0.4s" }} />
              </div>
              <span style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "normal",
                color: "var(--nav-text)",
                display: "inline-block",
                marginTop: 1,
                transition: "color 0.4s"
              }}>
                Menu
              </span>
            </button>
          </div>

          {/* CENTER - LOGO */}
          <div style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <Image
                src="/logo.png"
                alt="Aion Luxury"
                width={200}
                height={60}
                priority
                style={{ height: "auto", width: "auto", maxHeight: "56px" }}
              />
              <span style={{ width: "1px", height: "32px", background: "#e0e0e0", display: "inline-block" }} />
              <Image
                src="/makeinindiaa1.png"
                alt="Make in India"
                width={100}
                height={72}
                priority
                style={{ height: "auto", width: "100px", maxHeight: "80px", borderRadius: "2px" }}
              />
            </Link>
          </div>

          {/* RIGHT - BAG */}
          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => {
                setMobileOpen(false);
                openCart();
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--nav-text)",
                fontSize: "0.95rem",
                fontWeight: 700,
              }}
            >
              Bag <span style={{ opacity: 0.5 }}>({mounted ? cartCount : 0})</span>
            </button>
          </div>
        </div>
      </header>

      {/* BACKDROP */}
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1099,
          background: "rgba(0,0,0,0.4)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.4s ease",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "360px",
          background: "#fff",
          zIndex: 1100,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "20px 0 50px rgba(0,0,0,0.1)",
        }}
      >
        {/* DRAWER HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 32px",
            borderBottom: "1px solid #f5f5f5",
          }}
        >
          <span style={{
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "normal"
          }}>
            Aion Luxury
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: "4px",
              opacity: 0.5
            }}
          >
            ✕
          </button>
        </div>
        
        {/* NAV SCROLLABLE */}
        <div style={{ flex: 1, overflowY: "auto", padding: "40px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: "#000",
                  textDecoration: "none",
                  letterSpacing: "-0.01em"
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* DRAWER FOOTER (STUCK TO BOTTOM) */}
        <div style={{ padding: "32px", borderTop: "1px solid #f5f5f5", background: "#fff" }}>
          {session ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div style={{ 
                width: 60, 
                height: 60, 
                borderRadius: "50%", 
                overflow: "hidden", 
                background: "#f0f0f0", 
                border: "1px solid #eee",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center"
              }}>
                {session.user.avatar || session.user.image ? (
                  <img 
                    src={(session.user.avatar || session.user.image) as string} 
                    alt="User" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                ) : (
                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#000" }}>
                    {(session.user?.name || "U")[0].toUpperCase()}
                  </span>
                )}
              </div>
              <p style={{ 
                fontSize: "0.85rem", 
                color: "#111", 
                fontWeight: 500, 
                margin: 0, 
                textAlign: "center",
                wordBreak: "break-all"
              }}>
                {session?.user?.email}
              </p>
              <button
                onClick={() => signOut()}
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  padding: "16px",
                  width: "100%",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderRadius: "2px"
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "#fff",
                  background: "#000",
                  padding: "16px",
                  textAlign: "center",
                  borderRadius: "2px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "#888",
                  textAlign: "center",
                  padding: "8px"
                }}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .header-container {
          display: grid;
          grid-template-columns: 80px 1fr 80px;
          align-items: center;
          width: 100%;
          padding: 0 16px;
          height: 100%;
        }

        @media (min-width: 1024px) {
          .header-container {
            grid-template-columns: 1fr auto 1fr;
            padding: 0 40px;
          }
        }
      `}</style>
    </>
  );
}

