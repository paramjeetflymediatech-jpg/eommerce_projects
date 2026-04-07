import type { Metadata } from "next";
import Link from "next/link";
import { Product, Order, User, Category, ensureDB } from "@/lib/models";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard | Aion Luxury" };
export const dynamic = "force-dynamic";

async function getStats() {
  await ensureDB();
  try {
    const [productCount, orderCount, userCount, categoryCount, totalRevenueResult] = await Promise.all([
      Product.count(),
      Order.count(),
      User.count(),
      Category.count(),
      Order.sum("total")
    ]);

    return {
      products: productCount || 0,
      orders: orderCount || 0,
      users: userCount || 0,
      categories: categoryCount || 0,
      revenue: totalRevenueResult || 0,
    };
  } catch (error) {
    console.error("Stats fetch error:", error);
    return { products: 0, orders: 0, users: 0, categories: 0, revenue: 0 };
  }
}

export default async function AdminDashboard() {
  const data = await getStats();

  const stats = [
    { icon: "📦", label: "Total Products", value: data.products, color: "#111" },
    { icon: "🛒", label: "Total Orders", value: data.orders, color: "#111" },
    { icon: "👥", label: "Total Customers", value: data.users, color: "#111" },
    { icon: "🏷️", label: "Categories", value: data.categories, color: "#111" },
    { icon: "💰", label: "Estimated Revenue", value: formatPrice(data.revenue), color: "#111" },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header Bar */}
      <div style={{ 
        marginBottom: 40, 
        padding: "32px 0",
        borderBottom: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}>
        <h2 style={{ 
          fontSize: "clamp(1.5rem, 5vw, 2.2rem)", 
          fontWeight: 500, 
          margin: 0,
          fontFamily: "var(--font-serif)",
          letterSpacing: "-0.02em",
          color: "#111"
        }}>
          Overview
        </h2>
        <p style={{ 
          color: "#666", 
          fontSize: "0.9rem", 
          margin: 0,
          opacity: 0.8
        }}>
          Manage your store's performance and inventory from a single dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid" style={{ marginBottom: 48 }}>
        {stats.map(({ icon, label, value }) => (
          <div key={label} style={s.statCard}>
            <div style={s.statContent}>
              <p style={s.statLabel}>{label}</p>
              <h3 style={s.statValue}>{value}</h3>
            </div>
            <div style={s.statIcon}>{icon}</div>
          </div>
        ))}
      </div>

      {/* Tools Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ 
          fontSize: "1rem", 
          fontWeight: 600, 
          textTransform: "uppercase", 
          letterSpacing: "0.1em",
          color: "#888",
          marginBottom: 24
        }}>
          Quick Management
        </h3>
      </div>

      <div className="admin-tools-grid">
        <div style={s.toolCard}>
          <div style={s.toolHeader}>
            <span style={s.toolBadge}>Inventory</span>
            <h3 style={s.toolTitle}>Products</h3>
          </div>
          <p style={s.toolDesc}>Complete oversight of your digital showroom. Add, edit, or curate your collection.</p>
          <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
            <Link href="/admin/products" style={s.toolBtn}>View All</Link>
            <Link href="/admin/products" style={s.toolBtnSecondary}>Add New</Link>
          </div>
        </div>

        <div style={s.toolCard}>
          <div style={s.toolHeader}>
            <span style={s.toolBadge}>Sales</span>
            <h3 style={s.toolTitle}>Orders</h3>
          </div>
          <p style={s.toolDesc}>Track customer acquisitions and manage fulfillment statuses in real-time.</p>
          <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
            <Link href="/admin/orders" style={s.toolBtn}>Manage Orders</Link>
          </div>
        </div>

        <div style={s.toolCard}>
          <div style={s.toolHeader}>
            <span style={s.toolBadge}>CRM</span>
            <h3 style={s.toolTitle}>Customers</h3>
          </div>
          <p style={s.toolDesc}>Insights into your client base. Manage registrations and account security.</p>
          <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
            <Link href="/admin/users" style={s.toolBtn}>User Records</Link>
          </div>
        </div>

        <div style={s.toolCard}>
          <div style={s.toolHeader}>
            <span style={s.toolBadge}>Structure</span>
            <h3 style={s.toolTitle}>Taxonomy</h3>
          </div>
          <p style={s.toolDesc}>Organize your catalog into elegant hierarchies and categories.</p>
          <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
            <Link href="/admin/categories" style={s.toolBtn}>Classify</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  statCard: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    padding: "32px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    position: "relative",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  statIcon: {
    padding: "12px",
    background: "#f9f9f9",
    borderRadius: "12px",
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8
  },
  statContent: { display: "flex", flexDirection: "column", gap: 4 },
  statLabel: { 
    fontSize: "0.75rem", 
    color: "#999", 
    fontWeight: 600, 
    textTransform: "uppercase", 
    letterSpacing: "0.1em", 
    margin: 0 
  },
  statValue: { 
    fontSize: "2.2rem", 
    fontWeight: 400, 
    color: "#000", 
    margin: 0,
    fontFamily: "var(--font-serif)"
  },
  toolCard: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    height: "100%",
    minHeight: 280,
    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
  },
  toolHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 8
  },
  toolBadge: {
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#ccc",
  },
  toolTitle: { 
    fontSize: "1.4rem", 
    fontWeight: 500, 
    margin: 0,
    fontFamily: "var(--font-serif)",
    color: "#111"
  },
  toolDesc: { 
    fontSize: "0.95rem", 
    color: "#777", 
    lineHeight: 1.7, 
    margin: 0,
    fontWeight: 300
  },
  toolBtn: {
    background: "#000",
    color: "#fff",
    textDecoration: "none",
    padding: "14px 28px",
    fontSize: "0.85rem",
    fontWeight: 500,
    textAlign: "center" as const,
    transition: "opacity 0.2s",
    letterSpacing: "0.02em"
  },
  toolBtnSecondary: {
    background: "transparent",
    color: "#000",
    textDecoration: "none",
    padding: "14px 28px",
    fontSize: "0.85rem",
    fontWeight: 500,
    textAlign: "center" as const,
    border: "1px solid #eee",
    transition: "background 0.2s"
  },
};
