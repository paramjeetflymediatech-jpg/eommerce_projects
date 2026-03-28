import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Learn about our 30-day hassle-free return and exchange policy.",
};

export default function ReturnsPage() {
  return (
    <div className="container-app" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 16 }}>Return & Exchange Policy</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 48, fontSize: "1.1rem" }}>We want you to be 100% satisfied with your purchase. If you're not, we're here to help.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 40, lineHeight: 1.8, color: "var(--text-secondary)" }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>1. 30-Day Policy</h2>
            <p style={{ marginBottom: 16 }}>You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
            <p>Your item must be in the original packaging and needs to have the receipt or proof of purchase.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>2. Refunds</h2>
            <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
            <p style={{ marginTop: 16 }}>If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>3. Shipping</h2>
            <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
          </section>

          <div className="card" style={{ padding: 32, marginTop: 24, textAlign: "center", border: "1px dashed var(--border)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Start a Return</h3>
            <p style={{ marginBottom: 20 }}>Ready to return an item? Please have your order number ready and contact our support team.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <a href="/account/orders" className="btn btn-primary btn-sm">Find My Order</a>
              <a href="/contact" className="btn btn-secondary btn-sm">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
