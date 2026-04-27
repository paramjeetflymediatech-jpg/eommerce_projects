import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Aion Luxury",
  description:
    "Read the Terms & Conditions for using Aion Luxury. Understand our policies on orders, payments, shipping, returns, intellectual property, and more.",
};

const sections = [
  {
    title: "1. Introduction",
    content:
      "Welcome to Aion Luxury. By accessing or using our website, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our services.",
  },
  {
    title: "2. Use of Website",
    content:
      "By using this website, you confirm that you are at least 18 years old or accessing the site under the supervision of a parent or guardian. You agree to use this website only for lawful purposes and not for any fraudulent or unauthorized activities.",
  },
  {
    title: "3. Products & Pricing",
    content:
      "All products listed on Aion Luxury are subject to availability. We strive to ensure that all product descriptions, images, and prices are accurate; however, errors may occur. We reserve the right to correct any errors, update information, or cancel orders if any information is inaccurate at any time without prior notice.",
  },
  {
    title: "4. Orders & Payments",
    content:
      "Once you place an order, you will receive a confirmation email. This does not guarantee acceptance of your order. We reserve the right to refuse or cancel any order due to product unavailability, pricing errors, or suspected fraudulent activity. Payments must be completed through our secure payment gateways.",
  },
  {
    title: "5. Shipping & Delivery",
    content:
      "We aim to deliver your products within the estimated time; however, delays may occur due to unforeseen circumstances. Aion Luxury is not responsible for delays caused by courier services or external factors beyond our control.",
  },
  {
    title: "6. Returns & Refunds",
    content:
      "Customers may request returns or exchanges within the specified return period, provided the product is unused, unworn, and in its original packaging. Refunds will be processed after inspection of the returned product. Shipping charges may be non-refundable unless the return is due to our error.",
  },
  {
    title: "7. Intellectual Property",
    content:
      "All content on this website, including text, images, logos, and designs, is the property of Aion Luxury and is protected by applicable copyright and trademark laws. Unauthorized use of any content is strictly prohibited.",
  },
  {
    title: "8. User Accounts",
    content:
      "If you create an account on our website, you are responsible for maintaining the confidentiality of your account information. Aion Luxury will not be liable for any unauthorized use of your account.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      "Aion Luxury shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our website or products.",
  },
  {
    title: "10. Privacy Policy",
    content:
      "Your use of our website is also governed by our Privacy Policy. By using our services, you consent to the collection and use of your information as described in the policy.",
  },
  {
    title: "11. Changes to Terms",
    content:
      "Aion Luxury reserves the right to update or modify these Terms & Conditions at any time without prior notice. Continued use of the website constitutes acceptance of the updated terms.",
  },
  {
    title: "12. Governing Law",
    content:
      "These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of the appropriate courts.",
  },
];

export default function TermsPage() {
  return (
    <div className="container-app section-padding animate-fade">
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        {/* Page Header */}
        <header style={{ marginBottom: 80, textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
              marginBottom: 24,
              fontWeight: 400,
              letterSpacing: "-0.03em",
            }}
          >
            Terms &amp; Conditions
          </h1>
          <div
            style={{
              height: 1,
              width: 60,
              background: "var(--accent)",
              margin: "0 auto 24px",
            }}
          />
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              fontFamily: "var(--font-body)",
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            Please read these Terms &amp; Conditions carefully before accessing
            or using the Aion Luxury website and services.
          </p>
        </header>

        {/* Sections */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 60,
            lineHeight: 1.8,
            color: "var(--text-secondary)",
          }}
        >
          {sections.map((section) => (
            <section key={section.title}>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 500,
                  marginBottom: 24,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {section.title}
              </h2>
              <p>{section.content}</p>
            </section>
          ))}

          {/* Contact Us Section */}
          <section
            style={{
              marginTop: 40,
              padding: 48,
              background: "var(--bg-muted)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 500,
                marginBottom: 16,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              13. Contact Us
            </h2>
            <p style={{ marginBottom: 32 }}>
              If you have any questions regarding these Terms &amp; Conditions,
              please contact us through our website or customer support channels.
            </p>
            <a href="/contact" className="btn btn-primary">
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
