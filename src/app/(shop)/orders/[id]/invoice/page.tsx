import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Order, OrderItem, Product, User } from "@/lib/models";
import { formatPrice } from "@/lib/utils";
import PrintButton from "@/components/orders/PrintButton";

export const metadata: Metadata = { title: "Invoice | Aion Luxury" };

async function getOrder(id: string) {
  await ensureDB();
  const session = await getServerSession(authOptions as any);
  if (!session) return null;

  const order = await Order.findByPk(id, {
    include: [
      { model: User, as: "user", attributes: ["name", "email"] },
      { 
        model: OrderItem, 
        as: "items", 
        include: [{ model: Product, as: "product", attributes: ["name", "price"] }] 
      }
    ]
  });

  if (!order) return null;

  // Check authorization: must be owner or admin
  const isOwner = Number(order.userId) === Number((session as any).user.id);
  const isAdmin = (session as any).user.role === "ADMIN";

  if (!isOwner && !isAdmin) return null;

  return order;
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Aion Luxury";
  const subtotal = order.items?.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) || 0;

  return (
    <div style={styles.invoicePage}>
      {/* ── Print Controls (Hidden in Print) ── */}
      <div className="no-print" style={styles.controls}>
        <PrintButton style={styles.printBtn} />
      </div>

      <div style={styles.invoiceContainer}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.brand}>
            <h1 style={styles.logo}>{appName.toUpperCase()}</h1>
            <p style={styles.tagline}>Premium Online Showroom</p>
          </div>
          <div style={styles.meta}>
            <h2 style={styles.invoiceTitle}>INVOICE</h2>
            <div style={styles.metaRow}>
              <span>Order Reference:</span>
              <strong>#{order.id.toString().padStart(6, "0")}</strong>
            </div>
            <div style={styles.metaRow}>
              <span>Date:</span>
              <strong>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </div>
          </div>
        </header>

        <div style={styles.divider} />

        {/* Addresses */}
        <section style={styles.addressGrid}>
          <div style={styles.addressCol}>
            <h3 style={styles.sectionLabel}>FROM</h3>
            <p style={styles.addressText}>
              <strong>{appName}</strong><br />
              123 Premium Avenue<br />
              Digital City, 540001<br />
              support@aionluxury.com
            </p>
          </div>
          <div style={styles.addressCol}>
            <h3 style={styles.sectionLabel}>BILL TO</h3>
            <p style={styles.addressText}>
              <strong>{order.shippingAddress.name}</strong><br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>
        </section>

        {/* Items Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>ITEM DESCRIPTION</th>
              <th style={styles.thCenter}>QTY</th>
              <th style={styles.thRight}>UNIT PRICE</th>
              <th style={styles.thRight}>SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any, i: number) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>{item.product?.name}</td>
                <td style={styles.tdCenter}>{item.quantity}</td>
                <td style={styles.tdRight}>{formatPrice(item.price)}</td>
                <td style={styles.tdRight}>{formatPrice(Number(item.price) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <footer style={styles.footer}>
          <div style={styles.totalGrid}>
            <div style={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Shipping</span>
              <span>MRP: ₹0.00</span>
            </div>
            <div style={styles.dividerLight} />
            <div style={{ ...styles.totalRow, ...styles.grandTotal }}>
              <span>Grand Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </footer>

        <div style={styles.notes}>
          <p>Important: This is a computer-generated document and does not require a physical signature. Thank you for choosing {appName} for your premium collection.</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          @page { margin: 20mm; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      `}} />
    </div>
  );
}

const styles: Record<string, any> = {
  invoicePage: {
    background: "#f4f4f4",
    minHeight: "100vh",
    padding: "60px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  controls: {
    maxWidth: "800px",
    margin: "0 auto 24px",
    textAlign: "right",
  },
  printBtn: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    cursor: "pointer",
    borderRadius: "4px",
  },
  invoiceContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#fff",
    padding: "64px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: 800,
    letterSpacing: "0.2em",
    margin: 0,
  },
  tagline: {
    fontSize: "0.65rem",
    color: "#888",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    marginTop: "4px",
  },
  invoiceTitle: {
    fontSize: "2.4rem",
    fontWeight: 400,
    letterSpacing: "0.2em",
    margin: "0 0 16px",
    textAlign: "right",
  },
  meta: { textAlign: "right" },
  metaRow: {
    fontSize: "0.8rem",
    color: "#666",
    marginBottom: "4px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  divider: { height: "2px", background: "#000", margin: "40px 0" },
  dividerLight: { height: "1px", background: "#eee", margin: "16px 0" },
  addressGrid: { display: "flex", gap: "64px", marginBottom: "64px" },
  addressCol: { flex: 1 },
  sectionLabel: { fontSize: "0.65rem", fontWeight: 800, color: "#aaa", letterSpacing: "0.1em", marginBottom: "12px" },
  addressText: { fontSize: "0.9rem", color: "#333", lineHeight: 1.6, margin: 0 },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "64px" },
  thRow: { borderBottom: "1px solid #eee" },
  th: { textAlign: "left", padding: "16px 0", fontSize: "0.65rem", color: "#aaa", letterSpacing: "0.1em" },
  thCenter: { textAlign: "center", padding: "16px 0", fontSize: "0.65rem", color: "#aaa", letterSpacing: "0.1em" },
  thRight: { textAlign: "right", padding: "16px 0", fontSize: "0.65rem", color: "#aaa", letterSpacing: "0.1em" },
  tr: { borderBottom: "1px solid #f9f9f9" },
  td: { padding: "20px 0", fontSize: "0.9rem", fontWeight: 600 },
  tdCenter: { padding: "20px 0", fontSize: "0.9rem", textAlign: "center" },
  tdRight: { padding: "20px 0", fontSize: "0.9rem", textAlign: "right", fontWeight: 600 },
  footer: { display: "flex", justifyContent: "flex-end" },
  totalGrid: { width: "100%", maxWidth: "300px" },
  totalRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem", color: "#666" },
  grandTotal: { fontSize: "1.2rem", fontWeight: 700, color: "#000", marginTop: "8px" },
  notes: { marginTop: "120px", fontSize: "0.75rem", color: "#aaa", fontStyle: "italic", lineHeight: 1.6, textAlign: "center" },
};
