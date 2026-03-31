"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function Header() {
  const { data: session } = useSession();
  const cartCount = useCartStore((s) => s.getCount());
  const openCart = useCartStore((s) => s.openCart);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const navLinks = [
    { label: "COLLECTION", href: "/products" },
    { label: "DESIGNERS", href: "/products" },
    { label: "STORY", href: "/about" },
    { label: "STORES", href: "/" },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          height: 64,
          color: "#000",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="header-container">
          {/* LEFT - MENU */}
          <div style={{ minWidth: 60 }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#000",
                whiteSpace: "nowrap",
              }}
            >
              MENU
            </button>
          </div>

          {/* CENTER - LOGO */}
          <div style={{ textAlign: "center" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1rem, 4vw, 1.3rem)",
                  fontWeight: 500,
                  color: "#000",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                ShopNest
              </span>
            </Link>
          </div>

          {/* RIGHT - BAG */}
          <div style={{ minWidth: 60, textAlign: "right" }}>
            <button
              onClick={() => {
                setMobileOpen(false);
                openCart();
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#000",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                whiteSpace: "nowrap",
              }}
            >
              BAG ({mounted ? cartCount : 0})
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
          transition: "opacity 0.3s ease",
        }}
      />

      {/* DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "85vw",
          maxWidth: "320px",
          background: "#fff",
          zIndex: 1100,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.4s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* DRAWER HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
            borderBottom: "1px solid #eee",
          }}
        >
          <span style={{ fontWeight: 600 }}>ShopNest</span>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* NAV */}
        <div style={{ padding: "20px", flex: 1 }}>
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                marginBottom: "20px",
                fontSize: "1.2rem",
                color: "#000",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}

          <hr style={{ margin: "20px 0" }} />

          {session ? (
            <>
              <Link
                href="/account"
                style={{ display: "block", marginBottom: "10px" }}
              >
                {session.user?.name}
              </Link>
              <button
                onClick={() => signOut()}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#000",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{ display: "block", marginBottom: "10px" }}
              >
                SIGN IN
              </Link>
              <Link href="/register">CREATE ACCOUNT</Link>
            </>
          )}
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .header-container {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          width: 100%;
          padding: 12px 16px; /* mobile */
          gap: 8px;
        }

        @media (min-width: 1024px) {
          .header-container {
            padding-left: 80px;
            padding-right: 80px;
          }
        }
      `}</style>
    </>
  );
}