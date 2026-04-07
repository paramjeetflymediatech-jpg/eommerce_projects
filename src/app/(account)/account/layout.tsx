"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/account", label: "Overview", icon: "⌂" },
  { href: "/account/orders", label: "Order History", icon: "📦" },
  { href: "/account/profile", label: "My Profile", icon: "👤" },
  { href: "/account/addresses", label: "Addresses", icon: "📍" },
  { href: "/account/wishlist", label: "Wishlist", icon: "♥" },
  { href: "/account/security", label: "Security", icon: "🔒" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/account");
  }, [status, router]);

  if (status === "loading") return <div style={s.center}>Authenticating...</div>;

  return (
    <div style={s.layout}>
      <div className="container-app" style={s.container}>
        {/* Header Title */}
        <header style={s.pageHeader}>
          <h1 style={s.title}>My Account</h1>
          <p style={s.subtitle}>Manage your profile, orders and preferences with Aion Luxury.</p>
        </header>

        <div style={s.mainGrid} className="account-main-grid">
          {/* Account Sidebar */}
          <aside style={s.sidebar} className="account-sidebar">
            <nav style={s.nav} className="account-nav">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      ...s.navItem,
                      color: active ? "#000" : "#888",
                      fontWeight: active ? 700 : 500,
                      background: active ? "#fff" : "transparent",
                      boxShadow: active ? "0 4px 12px rgba(0,0,0,0.04)" : "none",
                      borderLeft: active ? "2px solid #000" : "2px solid transparent",
                    }}
                  >
                    <span style={s.navIcon}>{item.icon}</span>
                    <span style={s.navLabel}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div style={s.sidebarInfo}>
              <p style={s.userEmail}>{session?.user?.email}</p>
              <button 
                onClick={() => router.push("/api/auth/signout")} 
                style={s.logoutBtn}
              >
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Account Content */}
          <main style={s.content}>
            {children}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .account-main-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .account-sidebar {
            position: relative !important;
            top: 0 !important;
          }
          .account-nav {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
            gap: 8px !important;
            margin-bottom: 32px !important;
          }
          .account-sidebar-info {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  layout: { minHeight: "100vh", background: "#fcfcfc", paddingTop: "clamp(120px, 15vh, 160px)", paddingBottom: 100 },
  container: { display: "flex", flexDirection: "column" },
  pageHeader: { marginBottom: "clamp(32px, 8vw, 64px)", borderBottom: "1px solid #eee", paddingBottom: 32 },
  title: { fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 500, fontFamily: "var(--font-serif)", color: "#000", margin: "0 0 12px 0" },
  subtitle: { fontSize: "clamp(0.85rem, 2vw, 0.95rem)", color: "#666", fontWeight: 300, letterSpacing: "0.02em" },
  mainGrid: { display: "grid", gridTemplateColumns: "240px 1fr", gap: "clamp(32px, 5vw, 64px)" },
  sidebar: { position: "sticky", top: 120, height: "fit-content" },
  nav: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 },
  navItem: { 
    display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", 
    textDecoration: "none", fontSize: "0.85rem", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    textTransform: "uppercase", letterSpacing: "0.08em"
  },
  navIcon: { fontSize: "1.1rem", opacity: 0.8 },
  navLabel: { transition: "transform 0.2s" },
  sidebarInfo: { padding: "20px", background: "#fff", border: "1px solid #eee" },
  userEmail: { fontSize: "0.75rem", color: "#888", marginBottom: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" },
  logoutBtn: { 
    width: "100%", padding: "10px", background: "#000", color: "#fff", border: "none", 
    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" 
  },
  content: { background: "#fff", border: "1px solid #eee", padding: "clamp(24px, 5vw, 48px)", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", color: "#888" },
};
