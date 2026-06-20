"use client";
import { useState } from "react";

const faqs = [
  { 
    q: "What is Aion Luxury?", 
    a: "Aion Luxury is a premium everyday wear and luxury lifestyle brand delivering high-quality essentials, watches, and accessories designed for comfort, durability, and style." 
  },
  { 
    q: "Where are your products manufactured?", 
    a: "Our products are proudly made in India (Bharat Nirmit), designed with high-quality materials and craftsmanship to match global luxury standards." 
  },
  { 
    q: "What is your return/replacement policy?", 
    a: "We offer a dedicated 7-day return and replacement policy from the date of delivery. Items must be unused, unworn, unwashed, and in their original packaging with tags intact. You can start a return via our Return & Refund Policy page." 
  },
  { 
    q: "How long does shipping take?", 
    a: "Standard shipping across India takes 3 to 5 business days. Premium and custom-ordered items (such as selected automatic watches) undergo professional handling and verification, requiring 14 to 21 days for white-glove delivery." 
  },
  { 
    q: "How do I track my order?", 
    a: "Once your order has been dispatched, you will receive a tracking link and a reference code via email or SMS to trace the real-time status of your delivery." 
  },
  { 
    q: "What payment methods do you accept?", 
    a: "We accept all major payment methods including credit/debit cards, UPI, net banking, and secure wallet transfers through our verified checkout options." 
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="container-app section-padding animate-fade">
      {/* Inject FAQ Schema in Head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 60, textAlign: "center" }}>
          <h1 style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "clamp(2.5rem, 8vw, 3.5rem)", 
            marginBottom: 20,
            fontWeight: 400,
            letterSpacing: "-0.03em"
          }}>
            Frequently Asked Questions
          </h1>
          <div style={{ 
            height: 1, 
            width: 60, 
            background: "var(--accent)", 
            margin: "0 auto 24px" 
          }} />
          <p style={{ 
            color: "var(--text-secondary)", 
            fontSize: "1.1rem", 
            fontFamily: "var(--font-body)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Find answers to commonly asked questions about Aion Luxury, orders, shipping, returns, and payments.
          </p>
        </header>

        {/* Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #eaeaea", paddingBottom: 60 }}>
          {faqs.map(({ q, a }, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                style={{ 
                  borderBottom: "1px solid #eaeaea", 
                  padding: "24px 0",
                  cursor: "pointer"
                }}
                onClick={() => toggleFAQ(i)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <h3 style={{ 
                    fontSize: "1.05rem", 
                    fontWeight: 500, 
                    margin: 0, 
                    color: "var(--text-primary)", 
                    fontFamily: "var(--font-body)"
                  }}>
                    {q}
                  </h3>
                  <span style={{ 
                    fontSize: "1.2rem", 
                    fontWeight: 300, 
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", 
                    transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                    display: "inline-block",
                    userSelect: "none"
                  }}>
                    ＋
                  </span>
                </div>
                <div style={{ 
                  maxHeight: isOpen ? "250px" : "0",
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  opacity: isOpen ? 1 : 0
                }}>
                  <p style={{ 
                    color: "var(--text-secondary)", 
                    lineHeight: 1.8, 
                    fontSize: "0.95rem", 
                    margin: "16px 0 0 0",
                    fontFamily: "var(--font-body)"
                  }}>
                    {a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Support Section */}
        <div style={{ 
          marginTop: 40, 
          padding: 48, 
          background: "var(--bg-muted)", 
          textAlign: "center",
          border: "1px solid var(--border-subtle)"
        }}>
          <h2 style={{ 
            fontSize: "1.5rem", 
            fontWeight: 500, 
            marginBottom: 16, 
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)"
          }}>
            Still have questions?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: "0.95rem", lineHeight: 1.6 }}>
            Our support desk is ready to assist you with order modifications, product styling advice, and delivery details.
          </p>
          <a href="/contact" className="btn btn-primary">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
