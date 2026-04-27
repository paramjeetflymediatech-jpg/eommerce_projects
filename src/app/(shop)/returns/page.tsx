import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy | Aion Luxury",
  description: "Learn about our hassle-free refund and return process at Aion Luxury.",
};

export default function ReturnsPage() {
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
            Refund & Return Policy
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
            At Aion Luxury, customer satisfaction is our priority. If you are not completely satisfied with your purchase, we offer a hassle-free return and refund process.
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
              We strive to ensure every piece you receive from Aion Luxury meets our highest standards. However, if you're not entirely happy with your order, we are here to assist you with returns or exchanges subject to the terms below.
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
              2. Return Eligibility
            </h2>
            <p style={{ marginBottom: 20 }}>You may request a return or exchange under the following conditions:</p>
            <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 12 }}>
              <li>• The product must be unused, unworn, and unwashed</li>
              <li>• The item must be in its original packaging with all tags intact</li>
              <li>• The return request must be made within <strong>7 days</strong> of delivery</li>
              <li>• The product should not be damaged or altered in any way</li>
            </ul>
            <p style={{ marginTop: 20, fontStyle: "italic" }}>Items that do not meet these conditions will not be eligible for return.</p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              3. Non-Returnable Items
            </h2>
            <p style={{ marginBottom: 20 }}>The following items are not eligible for return or refund:</p>
            <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 12 }}>
              <li>• Innerwear or thermal wear if opened or used (for hygiene reasons)</li>
              <li>• Products purchased during clearance or sale (unless defective)</li>
              <li>• Gift cards or promotional items</li>
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
              4. Return Process
            </h2>
            <p style={{ marginBottom: 20 }}>To initiate a return:</p>
            <ol style={{ paddingLeft: 20, display: "grid", gap: 16 }}>
              <li>Contact our customer support team with your order details.</li>
              <li>Share the reason for return along with product images (if required).</li>
              <li>Once approved, we will arrange a pickup or provide return instructions.</li>
              <li>Ensure the product is securely packed to avoid damage during transit.</li>
            </ol>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              5. Refund Policy
            </h2>
            <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 12 }}>
              <li>• Refunds will be processed only after the returned product passes quality inspection.</li>
              <li>• Once approved, refunds will be credited to the original payment method within <strong>5–7 business days</strong>.</li>
              <li>• In case of Cash on Delivery (COD) orders, refunds may be processed via bank transfer or store credit.</li>
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
              6. Exchange Policy
            </h2>
            <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 12 }}>
              <li>• Exchanges are subject to product availability.</li>
              <li>• If the requested size or item is unavailable, a refund or instant store credit will be provided.</li>
              <li>• We will deliver the exchange product within 5-7 days.</li>
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
              7. Damaged or Incorrect Products
            </h2>
            <p>If you receive a damaged, defective, or incorrect item, please notify us within <strong>48 hours</strong> of delivery. Share clear images or videos as proof. We will arrange a replacement or full refund at no additional cost.</p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              8. Shipping Charges
            </h2>
            <p>Return shipping may be free or chargeable depending on location and reason for return. Original shipping charges (if any) are non-refundable unless the return is due to our error.</p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 500, 
              marginBottom: 24, 
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)"
            }}>
              9. Cancellation Policy
            </h2>
            <p>Orders can be cancelled before they are shipped. Once shipped, orders cannot be cancelled and must go through the return process.</p>
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
              10. Contact Us
            </h2>
            <p style={{ marginBottom: 32 }}>
              For return or refund assistance, please reach out to our customer support team. We are here to help ensure a smooth experience.
            </p>
            <a href="/contact" className="btn btn-primary">Start a Return</a>
          </section>
        </div>
      </div>
    </div>
  );
}
