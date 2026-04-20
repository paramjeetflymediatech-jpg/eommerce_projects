import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer 
      suppressHydrationWarning
      style={{
        background: "#ffffff",
        borderTop: "1px solid #f5f5f5",
        padding: "24px 0",
      }}
    >
      <div className="container-app">
        <div className="footer-grid">
          {/* Brand & Socials */}
          <div className="footer-brand-section" style={{ maxWidth: "320px" }}>
            <div style={{ marginBottom: 32 }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Image 
                  src="/logo.png" 
                  alt="Aion Luxury" 
                  width={200} 
                  height={60} 
                  style={{ height: "auto", width: "auto", maxHeight: "40px" }}
                />
              </Link>
            </div>
            <p style={{ color: "#777", lineHeight: 1.8, fontSize: "0.9rem", fontWeight: 300, marginBottom: 24 }}>
              Aion Luxury delivers premium everyday wear designed for comfort, durability, and style. Shop high-quality essentials for men, women, and kids, crafted to elevate your daily wardrobe experience.
            </p>
            
            {/* Social Icons - Now here */}
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <a href="#" aria-label="Instagram" style={{ color: "#000", opacity: 0.8, transition: "opacity 0.3s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Pinterest" style={{ color: "#000", opacity: 0.8, transition: "opacity 0.3s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22s1.5-5 1.5-8c0-2-1-3-1-4.5 0-2 1.5-3.5 3-3.5 2 0 3 1.5 3 3.5 0 2-1 4-1 6s1 3 2.5 3 4.5-2 4.5-6c0-5-3.5-9-9-9s-9 4-9 9c0 2.5 1 4.5 2.5 5"></path><line x1="12" y1="9" x2="12" y2="16"></line></svg>
              </a>
              <a href="#" aria-label="LinkedIn" style={{ color: "#000", opacity: 0.8, transition: "opacity 0.3s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" aria-label="Twitter" style={{ color: "#000", opacity: 0.8, transition: "opacity 0.3s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {[
            { title: "Collections", links: [{ label: "All Items", href: "/products" }, { label: "New Arrivals", href: "/products" }, { label: "Featured Items", href: "/products" }, { label: "Limited Sale", href: "/products" }] },
            { title: "The Brand", links: [{ label: "Our Story", href: "/about" }, { label: "Design Philosophy", href: "/about" }, { label: "Craftsmanship", href: "/" }, { label: "Contact Us", href: "/" }] },
            { title: "Concierge", links: [{ label: "Delivery Info", href: "/" }, { label: "Returns Policy", href: "/" }, { label: "Track Your Order", href: "/track" }, { label: "Help Center", href: "/" }] },
          ].map((col) => (
            <div key={col.title} className="footer-nav-col">
              <h4 style={{ 
                fontSize: "0.75rem", 
                fontWeight: 700, 
                marginBottom: 24, 
                color: "#000", 
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}>{col.title}</h4>
              <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {col.links.map((link) => (
                  <Link key={link.label} href={link.href} style={{ 
                    color: "#666", 
                    textDecoration: "none", 
                    fontSize: "0.85rem", 
                    fontWeight: 400,
                    transition: "color 0.3s ease"
                  }}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p style={{ color: "#999", fontSize: "0.8rem", letterSpacing: "normal", fontWeight: 400 }}>
            &copy; {year} Aion Luxury Paris. All rights reserved.
          </p>
          <div style={{ fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.05em", color: "#666" }}>
            Designed and developed by{" "}
            <a 
              href="https://flymediatech.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: "#000000", textDecoration: "none", textUnderlineOffset: "4px", fontWeight: 700 }}
            >
              Fly Media Technology
            </a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 40px;
        }
        .footer-bottom {
          border-top: 1px solid #f5f5f5;
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            margin-bottom: 60px;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
          .footer-brand-section {
            max-width: 100% !important;
            margin: 0 auto;
          }
          .footer-brand-section div {
             justify-content: center;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
            padding-top: 30px;
          }
        }
      `}} />
    </footer>

  );
}
