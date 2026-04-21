"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AccountOverviewPage() {
  const { data: session } = useSession();

  const dashboardItems = [
    { href: "/account/orders", label: "My Orders", desc: "Track, return, or buy items again", icon: "📦" },
    { href: "/account/addresses", label: "Saved Addresses", desc: "Manage your delivery locations", icon: "📍" },
    { href: "/account/profile", label: "Profile Settings", desc: "Update your name and photo", icon: "👤" },
    { href: "/account/wishlist", label: "My Wishlist", icon: "🖤", desc: "View items you've saved for later" },
    { href: "/account/security", label: "Security", icon: "🔐", desc: "Change password and manage sessions" },
  ];

  return (
    <div style={s.page}>
      {/* WELCOME HEADER */}
      <section style={s.header}>
        <div style={s.avatarContainer}>
          {session?.user?.avatar || session?.user?.image ? (
            <img 
              src={(session.user.avatar || session.user.image) as string} 
              alt="Profile" 
              style={s.avatarImg} 
            />
          ) : (
            <div style={s.avatarFallback}>
              {(session?.user?.name || "U")[0].toUpperCase()}
            </div>
          )}
        </div>
        <div style={s.welcomeText}>
          <p style={s.greeting}>Welcome back,</p>
          <h2 style={s.userName}>{session?.user?.name || "User"}</h2>
          <div style={s.badge}>Aion Member</div>
        </div>
      </section>

      {/* QUICK STATS (Optional/Visual) */}
      <div style={s.statsRow} className="stats-row">
        <div style={s.statItem}>
          <span style={s.statVal}>Active</span>
          <span style={s.statLbl}>Account Status</span>
        </div>
        <div style={s.statDivider} className="stat-divider" />
        <div style={s.statItem}>
          <span style={s.statVal}>{session?.user?.email}</span>
          <span style={s.statLbl}>Verified Email</span>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div style={s.grid} className="overview-grid">
        {dashboardItems.map((item) => (
          <Link key={item.href} href={item.href} style={s.card} className="dashboard-card">
            <div style={s.cardIcon}>{item.icon}</div>
            <div style={s.cardContent}>
              <h3 style={s.cardTitle}>{item.label}</h3>
              <p style={s.cardDesc}>{item.desc}</p>
            </div>
            <div style={s.cardArrow}>→</div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .dashboard-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s;
        }
        .dashboard-card:hover {
          transform: translateY(-4px);
          border-color: #000;
          box-shadow: 0 12px 30px rgba(0,0,0,0.05);
        }
        .dashboard-card:hover :global(.card-arrow) {
          transform: translateX(4px);
          opacity: 1;
        }
        @media (max-width: 768px) {
          .stats-row {
            flex-direction: column;
            width: 100% !important;
            gap: 20px !important;
          }
          .stat-divider {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { animation: "fadeIn 0.5s ease-out" },
  header: { display: "flex", alignItems: "center", gap: 32, marginBottom: 48, flexWrap: "wrap" },
  avatarContainer: { width: 100, height: 100, borderRadius: "50%", overflow: "hidden", background: "#f5f5f5", border: "1px solid #eee", flexShrink: 0 },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarFallback: { width: "100%", height: "100%", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: 700 },
  welcomeText: { display: "flex", flexDirection: "column", gap: 4 },
  greeting: { fontSize: "0.9rem", color: "#888", fontWeight: 300, margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" },
  userName: { fontSize: "2.4rem", color: "#000", fontWeight: 500, margin: 0, fontFamily: "var(--font-serif)" },
  badge: { fontSize: "0.65rem", background: "#f0f0f0", padding: "4px 12px", borderRadius: "100px", color: "#666", width: "fit-content", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 8 },
  statsRow: { display: "flex", gap: 32, padding: "24px 32px", background: "#fff", border: "1px solid #eee", marginBottom: 64, width: "fit-content", borderRadius: "2px", overflow: "hidden" },
  statItem: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  statVal: { fontSize: "0.9rem", fontWeight: 700, color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  statLbl: { fontSize: "0.75rem", color: "#888", fontWeight: 400 },
  statDivider: { width: 1, background: "#eee" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 64 },
  card: { display: "flex", alignItems: "center", gap: 24, background: "#fff", border: "1px solid #eee", padding: "32px", textDecoration: "none", color: "#000", position: "relative", borderRadius: "1px" },
  cardIcon: { fontSize: "1.8rem", width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", borderRadius: "50%", flexShrink: 0 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" },
  cardDesc: { fontSize: "0.85rem", color: "#888", margin: 0, fontWeight: 300, lineHeight: 1.5 },
  cardArrow: { fontSize: "1.2rem", color: "#000", opacity: 0.3, transition: "all 0.2s" }
};
