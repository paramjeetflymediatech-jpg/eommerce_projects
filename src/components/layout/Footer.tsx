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
        // marginTop: "clamp(48px, 8vw, 80px)",
        padding: "clamp(40px, 6vw, 64px) 0 clamp(24px, 4vw, 40px)",
      }}
    >
      <div className="container-app">
        <div className="footer-grid" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", 
          gap: "clamp(32px, 5vw, 48px)", 
          marginBottom: "clamp(40px, 6vw, 64px)" 
        }}>
          {/* Brand */}
          <div style={{ maxWidth: "320px" }}>
            <div style={{ marginBottom: 32 }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Image 
                  src="/logo.png" 
                  alt="Aion Luxury" 
                  width={200} 
                  height={60} 
                  style={{ height: "auto", width: "auto", maxHeight: "50px" }}
                />
              </Link>
            </div>
            <p style={{ color: "#777", lineHeight: 1.8, fontSize: "0.95rem", fontWeight: 300 }}>
              The French Art de Vivre. Discover iconic furniture and interior designs curated for the modern legacy.
            </p>
          </div>

          {/* Navigation Columns */}
          {[
            { title: "Collections", links: [{ label: "All Items", href: "/products" }, { label: "New Arrivals", href: "/products" }, { label: "Featured", href: "/products" }, { label: "Sale", href: "/products" }] },
            { title: "The Brand", links: [{ label: "Our Story", href: "/about" }, { label: "Designers", href: "/products" }, { label: "Showrooms", href: "/" }, { label: "Contact", href: "/" }] },
            { title: "Services", links: [{ label: "Delivery", href: "/" }, { label: "Returns", href: "/" }, { label: "Track Order", href: "/track" }, { label: "FAQ", href: "/" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ 
                fontSize: "0.85rem", 
                fontWeight: 700, 
                marginBottom: 24, 
                color: "#000", 
                letterSpacing: "0.02em" 
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

        <div className="footer-bottom" style={{ 
          borderTop: "1px solid #f5f5f5", 
          paddingTop: 40, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24
        }}>
          <p style={{ color: "#999", fontSize: "0.85rem", letterSpacing: "normal", fontWeight: 400 }}>
            © {year} Aion Luxury Paris. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "clamp(24px, 4vw, 40px)", flexWrap: "wrap" }}>
            {["Instagram", "Pinterest", "LinkedIn"].map((s) => (
              <a key={s} href="#" style={{ 
                color: "#000", 
                textDecoration: "none", 
                fontSize: "0.85rem", 
                fontWeight: 500, 
                letterSpacing: "normal",
                transition: "opacity 0.3s ease"
              }}>{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>

  );
}
