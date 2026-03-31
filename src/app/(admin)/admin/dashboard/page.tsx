import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard | ShopNest" };

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const [prodRes, orderRes, catRes] = await Promise.all([
      fetch(`${baseUrl}/api/products?limit=1`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/orders`, { next: { revalidate: 30 } }), // assuming orders API exists or returns empty
      fetch(`${baseUrl}/api/categories`, { next: { revalidate: 300 } }),
    ]);

    const prodData = await prodRes.json().catch(() => ({}));
    const orderData = await orderRes.json().catch(() => ({}));
    const catData = await catRes.json().catch(() => ({}));

    return {
      products: prodData.pagination?.totalCount || 0,
      orders: orderData.totalCount || 0,
      categories: catData.categories?.length || 0,
      revenue: orderData.totalRevenue || 0,
    };
  } catch (error) {
    console.error("Stats fetch error:", error);
    return { products: 0, orders: 0, categories: 0, revenue: 0 };
  }
}

export default async function AdminDashboard() {
  const data = await getStats();

  const stats = [
    { icon: "📦", label: "Total Products", value: data.products, color: "#111" },
    { icon: "🛒", label: "Total Orders", value: data.orders, color: "#111" },
    { icon: "🏷️", label: "Categories", value: data.categories, color: "#111" },
    { icon: "💰", label: "Estimated Revenue", value: `$${data.revenue.toLocaleString()}`, color: "#111" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "clamp(1.2rem,4vw,1.5rem)", fontWeight: 700, margin: 0 }}>Overview</h2>
        <p style={{ color: "#666", fontSize: "clamp(0.75rem,2vw,0.875rem)", marginTop: 4 }}>Welcome back to your store management.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map(({ icon, label, value }) => (
          <div key={label} style={s.statCard}>
            <div style={s.statIcon}>{icon}</div>
            <div style={s.statContent}>
              <p style={s.statLabel}>{label}</p>
              <p style={s.statValue}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-tools-grid">
        <div style={s.toolCard}>
          <h3 style={s.toolTitle}>Inventory Management</h3>
          <p style={s.toolDesc}>Add new items or update your existing product catalog with ease.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/admin/products" style={s.toolBtn}>View Products</a>
            <a href="/admin/products" style={{ ...s.toolBtn, background: "#f0f0f0", color: "#000", border: "1px solid #ddd" }}>Add New</a>
          </div>
        </div>

        <div style={s.toolCard}>
          <h3 style={s.toolTitle}>Orders & Fulfilment</h3>
          <p style={s.toolDesc}>Track customer purchases and manage the status of shipments.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/admin/orders" style={s.toolBtn}>Manage Orders</a>
          </div>
        </div>

        <div style={s.toolCard}>
          <h3 style={s.toolTitle}>Customer Accounts</h3>
          <p style={s.toolDesc}>Oversee user registrations, verify identities, and manage access roles.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/admin/users" style={s.toolBtn}>User Management</a>
          </div>
        </div>

        <div style={s.toolCard}>
          <h3 style={s.toolTitle}>Inventory Taxonomy</h3>
          <p style={s.toolDesc}>Define hierarchical categories and subcategories to structure your catalog.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/admin/categories" style={s.toolBtn}>Classification</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  statCard: {
    background: "#fff",
    border: "1px solid #eee",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  },
  statIcon: {
    width: 56,
    height: 56,
    background: "#f9f9f7",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    borderRadius: 0,
  },
  statContent: { display: "flex", flexDirection: "column" },
  statLabel: { fontSize: "0.75rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" },
  statValue: { fontSize: "1.75rem", fontWeight: 700, color: "#000", margin: 0 },
  toolCard: {
    background: "#fff",
    border: "1px solid #eee",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  toolTitle: { fontSize: "1.1rem", fontWeight: 700, margin: 0 },
  toolDesc: { fontSize: "0.9rem", color: "#666", lineHeight: 1.6, margin: "0 0 12px 0" },
  toolBtn: {
    background: "#000",
    color: "#fff",
    textDecoration: "none",
    padding: "10px 20px",
    fontSize: "0.8rem",
    fontWeight: 700,
    textAlign: "center" as const,
  },
};
