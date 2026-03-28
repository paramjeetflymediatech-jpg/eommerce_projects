import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

async function getStats() {
  try {
    const [prodRes, orderRes, catRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=1`, { next: { revalidate: 60 } }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, { next: { revalidate: 30 } }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, { next: { revalidate: 300 } }),
    ]);
    const prodData = await prodRes.json().catch(() => ({}));
    const orderData = await orderRes.json().catch(() => ({}));
    const catData = await catRes.json().catch(() => ({}));
    return {
      products: prodData.pagination?.total || 0,
      orders: orderData.total || 0,
      categories: catData.categories?.length || 0,
    };
  } catch { return { products: 0, orders: 0, categories: 0 }; }
}

export default function AdminDashboard() {
  const stats = [
    { icon: "📦", label: "Total Products", value: "—", color: "var(--primary)" },
    { icon: "🛒", label: "Total Orders", value: "—", color: "var(--success)" },
    { icon: "👥", label: "Customers", value: "—", color: "var(--accent)" },
    { icon: "💰", label: "Revenue", value: "—", color: "var(--warning)" },
  ];

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>⚙️ Admin Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage your store</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 48 }}>
        {stats.map(({ icon, label, value, color }) => (
          <div key={label} className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontSize: "1.5rem" }}>{icon}</span>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}` }} />
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 800, color, marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        {[
          { href: "/admin/products", icon: "📦", label: "Manage Products", desc: "Add, edit, delete products" },
          { href: "/admin/orders", icon: "🛒", label: "Manage Orders", desc: "View and update order status" },
          { href: "/admin/users", icon: "👥", label: "Manage Users", desc: "View and manage customers" },
          { href: "/admin/categories", icon: "🏷️", label: "Categories", desc: "Manage product categories" },
        ].map(({ href, icon, label, desc }) => (
          <a key={label} href={href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: 28, cursor: "pointer" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: 16 }}>{icon}</span>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>{label}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
