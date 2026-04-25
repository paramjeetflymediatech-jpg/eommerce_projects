import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Aion Luxury",
  description: "Learn about our shipping process, timelines, and terms at Aion Luxury.",
};

export default function ShippingPage() {
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
            Shipping Policy
          </h1>
          <div style={{ 
            height: 1, 
            width: 60, 
            background: "var(--accent)", 
            margin: "0 auto 24px" 
          }} />
          <p style={{ 
            color: "var(--text-muted)", 
            fontSize: "1.1rem", 
            fontFamily: "var(--font-body)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            At Aion Luxury, we are committed to delivering your orders quickly, safely, and efficiently. Our goal is to provide a seamless delivery experience.
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
              1. Overview
            </h2>
            <p>
              This Shipping Policy outlines our commitment to excellence in logistics. From the moment you place an order to its arrival at your doorstep, we prioritize care and precision.
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
              2. Order Processing
            </h2>
            <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 12 }}>
              <li>• All orders are processed within <strong>1–2 business days</strong> after confirmation.</li>
              <li>• Orders placed on weekends or public holidays will be processed on the next working day.</li>
              <li>• You will receive a confirmation email and tracking details once your order is shipped.</li>
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
              3. Shipping Timelines
            </h2>
            <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 12 }}>
              <li>• <strong>Standard Delivery:</strong> 3–7 business days</li>
              <li>• Delivery timelines may vary depending on your location and courier service availability.</li>
              <li>• Remote or rural areas may require additional delivery time.</li>
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
              4. Shipping Charges
            </h2>
            <p>Shipping charges (if applicable) will be calculated and displayed at checkout. Free shipping may be offered on selected products or during promotional campaigns.</p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              5. Order Tracking
            </h2>
            <p>Once your order is shipped, you will receive a tracking link via email or SMS. You can use this link to track your shipment in real time through our courier partner's portal.</p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              6. Delivery Partners
            </h2>
            <p>We work with trusted courier partners to ensure safe and timely delivery. However, Aion Luxury is not responsible for delays caused by courier services or unforeseen circumstances such as weather conditions or strikes.</p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              7. Delivery Attempts
            </h2>
            <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 12 }}>
              <li>• Our courier partners will make multiple delivery attempts.</li>
              <li>• If delivery fails due to an incorrect address or unavailability, the package may be returned to us.</li>
              <li>• Additional shipping charges may apply for re-delivery.</li>
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
              8. Address & Contact Details
            </h2>
            <p>Customers are responsible for providing accurate shipping details. Aion Luxury will not be liable for delays or losses due to incorrect or incomplete address information.</p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              9. Damaged or Missing Packages
            </h2>
            <p>If your order arrives damaged or incomplete, please notify us within <strong>48 hours</strong> of delivery. Share relevant images or details for verification, and we will assist you with a replacement or resolution.</p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              10. International Shipping
            </h2>
            <p>Currently, international shipping availability and charges vary based on destination. Additional customs duties or taxes may apply and must be borne by the customer. Please contact us for specific international inquiries.</p>
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
              For any shipping-related queries or assistance, please reach out to our customer support team.
            </p>
            <a href="/contact" className="btn btn-primary">Contact Support</a>
          </section>
        </div>
      </div>
    </div>
  );
}
