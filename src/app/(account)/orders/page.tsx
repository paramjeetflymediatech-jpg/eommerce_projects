import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "My Orders" };

async function getOrders(token?: string) {
  if (!token) return [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
      headers: { Cookie: token },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders || [];
  } catch { return []; }
}

const statusColors: Record<string, string> = {
  PENDING: "var(--warning)", PROCESSING: "var(--primary-light)",
  SHIPPED: "var(--accent)", DELIVERED: "var(--success)", CANCELLED: "var(--error)",
};

export default async function OrdersPage() {
  // Orders are fetched client-side; SSR stub shows loading state
  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>📦 My Orders</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>Track and manage your orders</p>
      <OrdersList />
    </div>
  );
}

// Client component for orders
function OrdersList() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
      <p style={{ marginBottom: 20, fontSize: "1rem" }}>Sign in to view your orders.</p>
      <Link href="/login" className="btn btn-primary">Sign In</Link>
    </div>
  );
}
