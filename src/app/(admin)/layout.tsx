"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/admin/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/admin/products", icon: "📦", label: "Products" },
  { href: "/admin/orders", icon: "🛒", label: "Orders" },
  { href: "/admin/users", icon: "👥", label: "Users" },
  { href: "/admin/categories", icon: "🏷️", label: "Categories" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/admin/login");
    }
  }, [status, session, router]);

  // Close sidebar on route change on mobile
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const isLoginPage = pathname === "/admin/login";

  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff"
      }}>
        <div style={{ textAlign: "center", animation: "pulse 2s infinite ease-in-out" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            letterSpacing: "normal",
            marginBottom: "8px",
            fontWeight: 400
          }}>
            Aion Luxury
          </h2>
          <p style={{
            fontSize: "0.85rem",
            letterSpacing: "normal",
            opacity: 0.6,
            marginLeft: "0.4em"
          }}>
            Accessing Portal
          </p>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // Pure login page without sidebar/header
  if (isLoginPage) return <>{children}</>;

  const pageName = NAV.find(n => pathname?.startsWith(n.href))?.label || "Admin";

  return (
    <>
      <div style={styles.root}>
        {/* ── SIDEBAR ── */}
        <>
          {/* Mobile backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              ...styles.backdrop,
              opacity: sidebarOpen ? 1 : 0,
              pointerEvents: sidebarOpen ? "auto" : "none",
            }}
          />

          <aside
            style={{
              ...styles.sidebar,
              width: collapsed ? 64 : 240,
            }}
            className={`admin-sidebar${sidebarOpen ? " sidebar-open" : ""}`}
          >
            {/* Sidebar Logo */}
            <div style={{ ...styles.sidebarTop, justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "20px 0" : "24px 20px" }}>
              {!collapsed && (
                <Link href="/admin/dashboard" style={styles.logo}>
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={120} 
                    height={40} 
                    style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} 
                  />
                </Link>
              )}
              {collapsed && (
                <Link href="/admin/dashboard" style={{ display: "flex", justifyContent: "center" }}>
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={32} 
                    height={32} 
                    style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} 
                  />
                </Link>
              )}
              {/* Collapse toggle — desktop only */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                style={styles.collapseBtn}
                className="desktop-only-flex"
                title={collapsed ? "Expand" : "Collapse"}
              >
                {collapsed ? "→" : "←"}
              </button>
            </div>

            {/* Nav Links */}
            <nav style={styles.nav}>
              {NAV.map(({ href, icon, label }) => {
                const active = pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    style={{
                      ...styles.navLink,
                      background: active ? "rgba(255,255,255,0.05)" : "transparent",
                      color: active ? "#fff" : "#888",
                      justifyContent: collapsed ? "center" : "flex-start",
                    }}
                  >
                    <span style={{ 
                      fontSize: 18, 
                      flexShrink: 0, 
                      opacity: active ? 1 : 0.7,
                      color: active ? "#fff" : "inherit"
                    }}>{icon}</span>
                    {!collapsed && <span style={{
                      ...styles.navLabel,
                      fontWeight: active ? 600 : 400
                    }}>{label}</span>}
                    {active && !collapsed && (
                      <div style={{
                        position: "absolute",
                        right: 0,
                        top: "20%",
                        bottom: "20%",
                        width: 3,
                        background: "#fff",
                        borderRadius: "2px 0 0 2px"
                      }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div style={{ ...styles.sidebarFooter, justifyContent: collapsed ? "center" : "flex-start" }}>
              {!collapsed && (
                <div style={styles.adminInfo}>
                  <div style={styles.avatar}>
                    {(session?.user?.name || "A")[0].toUpperCase()}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <p style={styles.adminName}>{session?.user?.name || "Admin"}</p>
                    <p style={styles.adminRole}>Administrator</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                title="Sign out"
                style={{ ...styles.signOutBtn, marginLeft: collapsed ? 0 : "auto" }}
              >
                ⏻
              </button>
            </div>
          </aside>
        </>

        {/* ── MAIN AREA ── */}
        <div style={{ ...styles.main, marginLeft: collapsed ? 64 : 240 }} className="admin-main">
          {/* Top Header Bar */}
          <header style={styles.header}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={styles.hamburger}
              className="mobile-only"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            <div style={styles.headerLeft}>
              <h1 style={styles.pageTitle}>{pageName}</h1>
            </div>

            <div style={styles.headerRight}>
              <Link href="/" target="_blank" style={styles.headerAction} title="View Store">
                🏪 Store
              </Link>
              <div style={styles.headerAvatar}>
                {(session?.user?.name || "A")[0].toUpperCase()}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main style={styles.pageContent} className="admin-page-content">
            {children}
          </main>
        </div>
      </div>

      <style>{`
        /* ── Base ─────────────────────────────── */
        .admin-sidebar {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 200;
          transition: width 0.3s ease, transform 0.3s ease;
        }
        .admin-main {
          transition: margin-left 0.3s ease;
          min-height: 100vh;
        }
        .desktop-only-flex { display: flex !important; }
        .mobile-only { display: none !important; }

        /* ── Responsive Tables → Cards ─────────── */
        .admin-table-wrap { overflow-x: auto; }

        /* ── Admin Grid Utilities ───────────────── */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .admin-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        /* ── Mobile ───────────────────────────── */
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 260px !important;
            transform: translateX(-100%);
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0) !important;
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .desktop-only-flex { display: none !important; }
          .mobile-only { display: flex !important; }

          /* Fluid font scaling */
          h1, h2, h3 { font-size: clamp(1rem, 4vw, 1.8rem) !important; }
          p, span, td, th, label, input, select, textarea, button { font-size: clamp(0.7rem, 2.5vw, 0.95rem) !important; }

          /* Stats cards stack 2-col on mobile */
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .admin-tools-grid {
            grid-template-columns: 1fr !important;
          }

          /* Tables → Card layout on mobile */
          .admin-table-wrap table { display: none !important; }
          .admin-card-list { display: flex !important; }

          /* Page content padding */
          .admin-page-content { padding: 12px !important; }

          /* Action headers stack */
          .admin-action-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .admin-action-header button,
          .admin-action-header a {
            width: 100% !important;
            text-align: center !important;
            justify-content: center !important;
          }

          /* Make filter row wrap */
          .admin-filter-row {
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          .admin-filter-row select,
          .admin-filter-row input {
            width: 100% !important;
          }

          /* Categories page: collapse 2-col grid */
          .admin-cat-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-cat-tree {
            display: none !important;
          }
        }

        /* ── Tablet ──────────────────────────── */
        @media (min-width: 769px) and (max-width: 1024px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .admin-tools-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .admin-card-list { display: none !important; }
        }

        /* ── Desktop ──────────────────────────── */
        @media (min-width: 1025px) {
          .admin-stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .admin-card-list { display: none !important; }
        }

        /* Card list item design */
        .admin-card-item {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 0;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .admin-card-item + .admin-card-item { margin-top: 8px; }
        .admin-card-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .admin-card-label {
          font-size: 0.8rem !important;
          font-weight: 700;
          letter-spacing: normal;
          color: #888;
        }
        .admin-card-value {
          font-size: 0.85rem !important;
          font-weight: 600;
          color: #000;
          text-align: right;
        }
        .admin-card-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
          padding-top: 10px;
          border-top: 1px solid #f0f0f0;
        }
        .admin-card-actions button {
          flex: 1;
          padding: 8px 4px !important;
        }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f5f7",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 199,
    transition: "opacity 0.3s",
  },
  sidebar: {
    background: "#0a0a0a",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flexShrink: 0,
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },
  sidebarTop: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    minHeight: 80,
    gap: 8,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    flex: 1,
    overflow: "hidden",
  },
  collapseBtn: {
    background: "none",
    border: "none",
    color: "#555",
    cursor: "pointer",
    fontSize: 14,
    padding: 4,
    flexShrink: 0,
    fontFamily: "monospace",
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "12px 0",
    gap: 2,
    overflowY: "auto",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 20px",
    textDecoration: "none",
    fontSize: "0.875rem",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
  },
  navLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  sidebarFooter: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    gap: 10,
    minHeight: 80,
  },
  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    background: "#333",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  adminName: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    margin: 0,
  },
  adminRole: {
    fontSize: "0.7rem",
    color: "#666",
    margin: 0,
    whiteSpace: "nowrap",
  },
  signOutBtn: {
    background: "none",
    border: "1px solid #333",
    color: "#666",
    cursor: "pointer",
    fontSize: 16,
    padding: "4px 8px",
    flexShrink: 0,
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  header: {
    background: "#fff",
    borderBottom: "1px solid #eee",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    height: 64,
    gap: 16,
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  hamburger: {
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    padding: "4px 8px",
    color: "#000",
    flexShrink: 0,
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    overflow: "hidden",
  },
  pageTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#000",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexShrink: 0,
  },
  headerAction: {
    fontSize: "0.8rem",
    color: "#666",
    textDecoration: "none",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 4,
    whiteSpace: "nowrap",
  },
  headerAvatar: {
    width: 34,
    height: 34,
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  pageContent: {
    flex: 1,
    padding: 24,
    overflow: "auto",
  },
};
