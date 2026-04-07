import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how we protect and manage your personal data at Aion Luxury.",
};

export default function PrivacyPage() {
  const lastUpdated = "March 27, 2026";

  return (
    <div className="container-app" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 16 }}>Privacy Policy</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 48, fontSize: "0.95rem" }}>Last updated: {lastUpdated}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 40, lineHeight: 1.8, color: "var(--text-secondary)" }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>1. Information We Collect</h2>
            <p style={{ marginBottom: 16 }}>We collect information you provide directly to us (name, email, shipping address, payment information) and information about your use of our services (IP address, browser type, device information).</p>
            <ul style={{ paddingLeft: 20 }}>
              <li>Account information when you create a profile.</li>
              <li>Transaction details when you make a purchase.</li>
              <li>Communication history with our support team.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>2. How We Use Your Information</h2>
            <p>We use the collected data to process your orders, maintain your account, improve our services, and detect/prevent fraud. We only share information with third parties (like Stripe for payments) necessary to provide our services.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>3. Security & Data Protection</h2>
            <p>We implement industry-standard security measures, including 256-bit SSL encryption for all transactions. Your payment data is handled securely by our payment processor and never stored on our servers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>4. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time. You can do this through your account profile or by contacting our support team.</p>
          </section>

          <div className="card" style={{ padding: 32, marginTop: 24, textAlign: "center" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Questions?</h3>
            <p style={{ marginBottom: 20 }}>If you have any questions about our privacy practices, please reach out to us.</p>
            <a href="/contact" className="btn btn-primary btn-sm">Contact Privacy Team</a>
          </div>
        </div>
      </div>
    </div>
  );
}
