"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function Header() {
  const { data: session } = useSession();
  const cartCount = useCartStore((s) => s.getCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openCart);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          background: scrolled
            ? "rgba(15, 15, 20, 0.95)"
            : "rgba(15, 15, 20, 0.6)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
      >
        <div className="container-app" style={{ display: "flex", alignItems: "center", gap: 24, height: 72 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--gradient-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "white",
              boxShadow: "0 4px 15px rgba(99,102,241,0.5)",
            }}>S</div>
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "white" }}>
              Shop<span style={{ color: "var(--primary-light)" }}>Nest</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: 480, display: "flex" }}>
            <form
              onSubmit={(e) => { e.preventDefault(); window.location.href = `/search?q=${searchQuery}`; }}
              style={{ display: "flex", width: "100%", gap: 0 }}
            >
              <input
                type="search"
                className="input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: "12px 0 0 12px", flex: 1 }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ borderRadius: "0 12px 12px 0", padding: "12px 18px" }}
              >
                🔍
              </button>
            </form>
          </div>

          {/* Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/products" className="btn btn-ghost" style={{ fontSize: "0.9rem" }}>
              Shop
            </Link>
            <Link href="/categories" className="btn btn-ghost" style={{ fontSize: "0.9rem" }}>
              Categories
            </Link>

            {/* Wishlist */}
            <Link href="/account/wishlist" style={{ position: "relative", textDecoration: "none" }}>
              <button className="btn btn-ghost" style={{ padding: "10px 12px", fontSize: "1.2rem" }}>
                🤍
                {wishlistCount > 0 && (
                  <span style={{
                    position: "absolute", top: 4, right: 4,
                    background: "var(--secondary)", color: "white",
                    borderRadius: "50%", width: 18, height: 18,
                    fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700,
                  }}>{wishlistCount}</span>
                )}
              </button>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="btn btn-ghost"
              style={{ position: "relative", padding: "10px 12px", fontSize: "1.2rem" }}
            >
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 4, right: 4,
                  background: "var(--primary)", color: "white",
                  borderRadius: "50%", width: 18, height: 18,
                  fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700,
                }}>{cartCount}</span>
              )}
            </button>

            {/* Auth */}
            {session ? (
              <div style={{ position: "relative" }}>
                <details style={{ listStyle: "none" }}>
                  <summary style={{
                    cursor: "pointer", listStyle: "none",
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 12px", borderRadius: 10,
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "var(--text-primary)",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "var(--gradient-primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.8rem", fontWeight: 700,
                    }}>
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{session.user?.name?.split(" ")[0]}</span>
                    ▾
                  </summary>
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    minWidth: 200, zIndex: 100,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 14, overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  }}>
                    <Link href="/account/profile" style={{ display: "block", padding: "12px 16px", color: "var(--text-primary)", textDecoration: "none", fontSize: "0.9rem" }}>
                      👤 My Profile
                    </Link>
                    <Link href="/account/orders" style={{ display: "block", padding: "12px 16px", color: "var(--text-primary)", textDecoration: "none", fontSize: "0.9rem" }}>
                      📦 My Orders
                    </Link>
                    <Link href="/account/wishlist" style={{ display: "block", padding: "12px 16px", color: "var(--text-primary)", textDecoration: "none", fontSize: "0.9rem" }}>
                      🤍 Wishlist
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link href="/admin/dashboard" style={{ display: "block", padding: "12px 16px", color: "var(--primary-light)", textDecoration: "none", fontSize: "0.9rem" }}>
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", background: "none", border: "none", color: "var(--error)", cursor: "pointer", fontSize: "0.9rem" }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </details>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: 72 }} />
    </>
  );
}
