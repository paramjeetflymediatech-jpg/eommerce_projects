import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Aion Luxury",
  description: "Learn how we collect, use, and safeguard your data at Aion Luxury.",
};

export default function PrivacyPage() {
  const lastUpdated = "April 25, 2026";

  return (
    <div className="container-app section-padding animate-fade">
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <header style={{ marginBottom: 80, textAlign: "center" }}>
          <h1 style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "clamp(2.5rem, 8vw, 3.5rem)", 
            marginBottom: 24,
            fontWeight: 400,
            letterSpacing: "-0.03em"
          }}>
            Privacy Policy
          </h1>
          <div style={{ 
            height: 1, 
            width: 60, 
            background: "var(--accent)", 
            margin: "0 auto 24px" 
          }} />
          <p style={{ 
            color: "var(--text-muted)", 
            fontSize: "0.9rem", 
            textTransform: "uppercase", 
            letterSpacing: "0.1em" 
          }}>
            Effective Date: {lastUpdated}
          </p>
        </header>

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 60, 
          lineHeight: 1.8, 
          color: "var(--text-secondary)" 
        }}>
          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              1. Introduction
            </h2>
            <p>
              At Aion Luxury, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              2. Information We Collect
            </h2>
            <p style={{ marginBottom: 20 }}>We may collect the following types of information:</p>
            <ul style={{ 
              listStyle: "none", 
              paddingLeft: 0, 
              display: "grid", 
              gap: 16 
            }}>
              <li style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>•</span>
                <span><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing address.</span>
              </li>
              <li style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>•</span>
                <span><strong>Payment Information:</strong> Payment details (processed securely via third-party payment gateways).</span>
              </li>
              <li style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>•</span>
                <span><strong>Technical Data:</strong> IP address, browser type, device information, and browsing behavior.</span>
              </li>
              <li style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>•</span>
                <span><strong>Order Information:</strong> Products purchased, order history, and preferences.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              3. How We Use Your Information
            </h2>
            <p style={{ marginBottom: 20 }}>We use your information to:</p>
            <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 12 }}>
              <li>• Process and deliver your orders</li>
              <li>• Communicate order updates and customer support</li>
              <li>• Improve our website, products, and services</li>
              <li>• Send promotional emails, offers, or updates (only with your consent)</li>
              <li>• Prevent fraudulent transactions and enhance security</li>
            </ul>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              4. Sharing of Information
            </h2>
            <p>
              We do not sell or rent your personal information. However, we may share your data with trusted third-party service providers (payment gateways, shipping partners), legal authorities if required by law, or marketing tools and analytics services to improve your experience.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              5. Cookies & Tracking Technologies
            </h2>
            <p>
              Our website uses cookies and similar technologies to enhance your browsing experience. Cookies help us understand user behavior, remember preferences, and improve website performance. You can choose to disable cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              6. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no online transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              7. Your Rights
            </h2>
            <p>
              You have the right to access, update, or delete your personal information, opt-out of marketing communications, and request details about how your data is being used. To exercise these rights, please contact us through our website.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              8. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites. Aion Luxury is not responsible for the privacy practices or content of these external sites.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              9. Children’s Privacy
            </h2>
            <p>
              Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              10. Changes to This Policy
            </h2>
            <p>
              Aion Luxury reserves the right to update or modify this Privacy Policy at any time. Changes will be posted on this page, and continued use of the website implies acceptance of the updated policy.
            </p>
          </section>

          <section style={{ 
            marginTop: 40, 
            padding: 48, 
            background: "var(--bg-muted)", 
            textAlign: "center" 
          }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 16, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              11. Contact Us
            </h2>
            <p style={{ marginBottom: 32 }}>
              If you have any questions or concerns regarding this Privacy Policy or your data, please reach out to us.
            </p>
            <a href="/contact" className="btn btn-primary">Contact Support</a>
          </section>
        </div>
      </div>
    </div>
  );
}
