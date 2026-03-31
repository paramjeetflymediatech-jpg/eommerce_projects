import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "#ffffff",
      borderTop: "1px solid #eee",
      marginTop: 120,
      padding: "100px 0 60px",
    }}>
      <div className="container-app">
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 80, marginBottom: 80 }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontFamily: "Lora, serif", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                ShopNest
              </span>
            </div>
            <p style={{ color: "#888", lineHeight: 1.8, fontSize: "0.9rem", maxWidth: 300, fontWeight: 300 }}>
              The French Art de Vivre. Discover iconic furniture and interior designs curated for the modern legacy.
            </p>
          </div>

          {/* Navigation Columns */}
          {[
            { title: "Collections", links: [{ label: "All Products", href: "/products" }, { label: "New Arrivals", href: "/products" }, { label: "Featured", href: "/products" }, { label: "Sale", href: "/products" }] },
            { title: "The Brand", links: [{ label: "Our Story", href: "/about" }, { label: "Designers", href: "/products" }, { label: "Showrooms", href: "/" }, { label: "Contact", href: "/" }] },
            { title: "Services", links: [{ label: "Delivery", href: "/" }, { label: "Returns", href: "/" }, { label: "Warranty", href: "/" }, { label: "FAQ", href: "/" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: 32, color: "#000", letterSpacing: "0.2em", textTransform: "uppercase" }}>{col.title}</h4>
              <nav style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {col.links.map((link) => (
                  <Link key={link.label} href={link.href} style={{ color: "#666", textDecoration: "none", fontSize: "0.85rem", fontWeight: 400 }}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="footer-bottom" style={{ borderTop: "1px solid #eee", paddingTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#aaa", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            © {year} SHOPNEST PARIS. ALL RIGHTS RESERVED.
          </p>
          <div style={{ display: "flex", gap: 32 }}>
            {["INSTAGRAM", "PINTEREST", "LINKEDIN"].map((s) => (
              <a key={s} href="#" style={{ color: "#000", textDecoration: "none", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em" }}>{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>

  );
}
