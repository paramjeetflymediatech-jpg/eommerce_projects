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

        {/* NAV */}
        <div style={{ padding: "40px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
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

          <div style={{ marginTop: "auto", borderTop: "1px solid #f5f5f5", paddingTop: "32px" }}>
            {session ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>
                  Logged in as <span style={{ color: "#000", fontWeight: 600 }}>{session.user?.name}</span>
                </p>
                <div style={{ display: "flex", gap: "24px" }}>
                  <Link
                    href={session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/account"}
                    onClick={() => setMobileOpen(false)}
                    style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", textDecoration: "none", color: "#000" }}
                  >
                    {session?.user?.role === "ADMIN" ? "Admin Portal" : "My Account"}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#888",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "normal",
                      padding: 0
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "normal",
                    textDecoration: "none",
                    color: "#000",
                    background: "#f5f5f5",
                    padding: "16px",
                    textAlign: "center"
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "normal",
                    textDecoration: "none",
                    color: "#888",
                    textAlign: "center"
                  }}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
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