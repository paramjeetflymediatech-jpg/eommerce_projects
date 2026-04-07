import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to frequently asked questions and get support for your Aion Luxury account.",
};

export default function HelpPage() {
  const faqs = [
    { q: "How do I track my order?", a: "Once your order has shipped, you will receive an email with a tracking number and a link to track your package." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Google Pay." },
    { q: "Can I change or cancel my order?", a: "To ensure fast delivery, we process orders quickly. You can change or cancel your order within 30 minutes of placing it." },
    { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries worldwide. International shipping rates and delivery times vary by location." },
    { q: "How do I use a discount code?", a: "Add your desired items to the cart and proceed to checkout. On the checkout page, enter your code in the 'Discount Code' field and click 'Apply'." },
    { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. See our full Return Policy page for details." },
  ];

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 16 }}>Help Center</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
            Search our frequently asked questions or browse by topic to find the help you need.
          </p>

          <div style={{ position: "relative", maxWidth: 600, margin: "40px auto 0" }}>
            <input className="input" placeholder="Search for answers..." style={{ padding: "16px 24px 16px 52px", fontSize: "1.1rem", borderRadius: 16 }} />
            <span style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>🔍</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, marginBottom: 64 }}>
          {[
            { icon: "📦", title: "Orders & Shipping", desc: "Track your orders, shipping times, and delivery issues." },
            { icon: "💳", title: "Billing & Payments", desc: "Manage payments, invoices, and refund questions." },
            { icon: "👤", title: "Account & Profile", desc: "Manage your account, settings, and login issues." },
            { icon: "🔄", title: "Returns & Exchanges", desc: "Start a return, check return status, and our policies." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card h-full" style={{ padding: 32, textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>{title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 32, textAlign: "center" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="card" style={{ padding: 24 }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>{q}</h4>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ textAlign: "center", marginTop: 80, padding: "48px 0" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 16 }}>Still need help?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Our customer support team is available 24/7 to assist you.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <a href="/contact" className="btn btn-primary">Contact Support</a>
            <button className="btn btn-secondary">Live Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
