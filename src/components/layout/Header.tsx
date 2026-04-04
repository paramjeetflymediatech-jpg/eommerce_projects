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
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const navLinks = [
    { label: "SHOP ALL", href: "/products" },
    { label: "STORY", href: "/about" },
    { label: "STORES", href: "/" },
    { label: "ACCOUNT", href: session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/account" },
  ];

  const headerBg = isHome && !scrolled ? "transparent" : "#fff";
  const headerBorder = isHome && !scrolled ? "none" : "1px solid #e0e0e0";
  const textColor = isHome && !scrolled ? "#fff" : "#000";

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
          height: 64,
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
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "var(--nav-text)",
                display: "inline-block",
                marginTop: 1,
                transition: "color 0.4s"
              }}>
                MENU
              </span>
            </button>
          </div>

          {/* CENTER - LOGO */}
          <div style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <Image
                src="/logo.png"
                alt="ShopNest"
                width={200}
                height={60}
                priority
                style={{ height: "auto", width: "auto", maxHeight: "50px" }}
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
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                transition: "color 0.4s"
              }}
            >
              BAG <span style={{ opacity: 0.5 }}>({mounted ? cartCount : 0})</span>
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
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase"
          }}>
            ShopNest
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
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
                    style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none", color: "#000" }}
                  >
                    {session?.user?.role === "ADMIN" ? "ADMIN PORTAL" : "MY ACCOUNT"}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#888",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      padding: 0
                    }}
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textDecoration: "none",
                    color: "#000",
                    background: "#f5f5f5",
                    padding: "16px",
                    textAlign: "center"
                  }}
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textDecoration: "none",
                    color: "#888",
                    textAlign: "center"
                  }}
                >
                  CREATE ACCOUNT
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