import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Order, OrderItem, Product } from "@/lib/models";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "My Orders | Aion Luxury" };
export const dynamic = "force-dynamic";

async function getOrders() {
  await ensureDB();
  const session = await getServerSession(authOptions as any);
  if (!session) return null;

  const userId = Number((session as any).user.id);

  return await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [{ model: Product, as: "product", attributes: ["id", "name", "images"] }],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

const STATUS_STYLING: Record<string, any> = {
  PENDING: { color: "#8E8E93", background: "#f1f1f2" },
  PROCESSING: { color: "#007AFF", background: "#e5f1ff" },
  SHIPPED: { color: "#AF52DE", background: "#f6ecfb" },
  DELIVERED: { color: "#34C759", background: "#ecf9f0" },
  CANCELLED: { color: "#FF3B30", background: "#ffebea" },
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions as any);
  if (!session) redirect("/login?callback=/orders");

  const orders = await getOrders();

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.title}>My Orders</h1>
        <p style={s.subtitle}>Track your purchases and view historical invoices.</p>
      </header>

      {!orders || orders.length === 0 ? (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}>📦</div>
          <p style={s.emptyText}>You haven't placed any orders yet.</p>
          <Link href="/products" style={s.shopBtn}>Explore Collections</Link>
        </div>
      ) : (
        <div style={s.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={s.orderCard}>
              <div style={s.orderHeader}>
                <div style={s.orderMeta}>
                  <p style={s.metaLabel}>Order Ref</p>
                  <p style={s.metaValue}>#{order.id.toString().padStart(6, "0")}</p>
                </div>
                <div style={s.orderMeta}>
                  <p style={s.metaLabel}>Date Placed</p>
                  <p style={s.metaValue}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div style={s.orderMeta}>
                  <p style={s.metaLabel}>Total</p>
                  <p style={{ ...s.metaValue, fontWeight: 700 }}>{formatPrice(order.total)}</p>
                </div>
                <div style={s.statusBadge}>
                   <span style={{ 
                     ...s.statusText, 
                     color: STATUS_STYLING[order.status]?.color, 
                     background: STATUS_STYLING[order.status]?.background 
                   }}>
                     {order.status}
                   </span>
                </div>
                <div style={s.actions}>
                   <Link href={`/orders/${order.id}/invoice`} target="_blank" style={s.invoiceLink}>
                     VIEW INVOICE
                   </Link>
                </div>
              </div>

              <div style={s.orderItems}>
                {order.items?.map((item: any) => (
                  <div key={item.id} style={s.itemRow}>
                    <p style={s.itemName}>{item.product?.name}</p>
                    <p style={s.itemQty}>QTY: {item.quantity}</p>
                    <p style={s.itemPrice}>{formatPrice(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s: Record<string, any> = {
  container: {
    padding: "clamp(24px, 5vw, 80px) 24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "48px",
    textAlign: "center",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "2.8rem",
    fontWeight: 400,
    marginBottom: "12px",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "#888",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  emptyState: {
    textAlign: "center",
    padding: "100px 0",
    border: "1px dashed #eee",
    background: "#fafafa",
  },
  emptyIcon: { fontSize: "3rem", marginBottom: "20px", filter: "grayscale(1)" },
  emptyText: { color: "#888", fontSize: "1rem", marginBottom: "32px" },
  shopBtn: {
    display: "inline-block",
    padding: "14px 32px",
    background: "#000",
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  orderList: { display: "flex", flexDirection: "column", gap: "24px" },
  orderCard: {
    background: "#fff",
    border: "1px solid #eee",
    padding: "0",
    transition: "all 0.3s ease",
  },
  orderHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    padding: "24px 32px",
    background: "#fafafa",
    borderBottom: "1px solid #eee",
    alignItems: "center",
    gap: "20px",
  },
  orderMeta: {},
  metaLabel: { 
    fontSize: "0.65rem", 
    fontWeight: 800, 
    color: "#aaa", 
    textTransform: "uppercase", 
    letterSpacing: "0.1em",
    marginBottom: "4px"
  },
  metaValue: { fontSize: "0.85rem", color: "#000", fontWeight: 500, margin: 0 },
  statusText: {
    fontSize: "0.6rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
    padding: "4px 12px",
    borderRadius: "100px",
    textTransform: "uppercase",
  },
  actions: { textAlign: "right" },
  invoiceLink: {
    fontSize: "0.7rem",
    fontWeight: 800,
    color: "#000",
    textDecoration: "none",
    borderBottom: "1px solid #000",
    paddingBottom: "2px",
    letterSpacing: "0.05em",
  },
  orderItems: { padding: "24px 32px" },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    fontSize: "0.9rem",
    color: "#444",
  },
  itemName: { flex: 1, margin: 0, fontWeight: 500 },
  itemQty: { width: "80px", textAlign: "center", fontSize: "0.75rem", color: "#888" },
  itemPrice: { width: "100px", textAlign: "right", fontWeight: 600, color: "#000" },
};
