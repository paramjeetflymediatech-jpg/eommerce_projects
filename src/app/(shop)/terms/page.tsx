import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the rules and guidelines for using the ShopNest platform.",
};

export default function TermsPage() {
  const lastUpdated = "March 27, 2026";

  return (
    <div className="container-app" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 16 }}>Terms of Service</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 48, fontSize: "0.95rem" }}>Last updated: {lastUpdated}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 40, lineHeight: 1.8, color: "var(--text-secondary)" }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>1. Use of our Services</h2>
            <p style={{ marginBottom: 16 }}>By using our services, you agree to comply with these terms. You are responsible for all activity that occurs under your account. You must provide accurate information and maintain the security of your account credentials.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>2. Products & Pricing</h2>
            <p>We strive to provide accurate product information and pricing. However, we reserve the right to correct errors and cancel orders if a product is listed at an incorrect price. All prices are in USD unless otherwise specified.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>3. Intellectual Property</h2>
            <p>All content on the ShopNest platform, including logos, text, and images, is the property of ShopNest and is protected by copyright and intellectual property laws. You may not use our content without explicit permission.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>4. Limitation of Liability</h2>
            <p>ShopNest is provided "as is" without warranties. We are not liable for any damages arising from your use of our services, except as required by law.</p>
          </section>

          <div className="card" style={{ padding: 32, marginTop: 24, textAlign: "center" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Legal Questions?</h3>
            <p style={{ marginBottom: 20 }}>If you have any questions about these terms, please contact our legal department.</p>
            <a href="/contact" className="btn btn-primary btn-sm">Contact Legal</a>
          </div>
        </div>
      </div>
    </div>
  );
}
