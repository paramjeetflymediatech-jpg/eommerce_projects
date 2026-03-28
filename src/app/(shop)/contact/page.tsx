import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the ShopNest team. We're here to help with your orders and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 16 }}>Let's Connect</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
            Have a question about an order, a product, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 64, alignItems: "start" }}>
          {/* Info Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>📍 Visit Us</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                123 Commerce Avenue<br />
                Tech Plaza, Suite 400<br />
                New York, NY 10001
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>📞 Call Us</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Main: +1 (555) 123-4567<br />
                Support: +1 (555) 987-6543
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>✉️ Email Us</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                General: hello@shopnest.com<br />
                Support: help@shopnest.com
              </p>
            </div>
            <div className="card" style={{ padding: 24, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10, color: "var(--primary-light)" }}>24/7 Support</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Our AI support system is always online, and our human team responds within 24 hours.</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="card" style={{ padding: 48 }}>
            <form style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ gridColumn: "1/2" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600 }}>First Name</label>
                <input required className="input" placeholder="John" />
              </div>
              <div style={{ gridColumn: "2/3" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600 }}>Last Name</label>
                <input required className="input" placeholder="Doe" />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600 }}>Email Address</label>
                <input required type="email" className="input" placeholder="john@example.com" />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600 }}>Subject</label>
                <input required className="input" placeholder="Order inquiry, partnership, etc." />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600 }}>Message</label>
                <textarea required rows={5} className="input" placeholder="Tell us more about how we can help..." style={{ resize: "vertical" }} />
              </div>
              <div style={{ gridColumn: "1/-1", marginTop: 8 }}>
                <button type="button" className="btn btn-primary btn-lg" style={{ width: "100%" }}>Send Message →</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
