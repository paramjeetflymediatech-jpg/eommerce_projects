import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "var(--bg-card)",
      borderTop: "1px solid var(--border)",
      marginTop: 80,
      padding: "64px 0 32px",
    }}>
      <div className="container-app">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--gradient-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 800, color: "white",
              }}>S</div>
              <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "white" }}>
                Shop<span style={{ color: "var(--primary-light)" }}>Nest</span>
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 280 }}>
              Your premium destination for quality products. Fast shipping, easy returns, and exceptional customer service.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {["Twitter", "Instagram", "Facebook"].map((s) => (
                <a key={s} href="#" style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--primary-light)", textDecoration: "none", fontSize: "0.75rem",
                  transition: "all 0.2s ease",
                  fontWeight: 600,
                }}>{s[0]}</a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Shop</h4>
            {[
              { label: "All Products", href: "/products" },
              { label: "Categories", href: "/categories" },
              { label: "New Arrivals", href: "/products?sort=createdAt_desc" },
              { label: "Featured", href: "/products?featured=true" },
              { label: "Sale", href: "/products?sale=true" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ display: "block", color: "var(--text-secondary)", textDecoration: "none", marginBottom: 12, fontSize: "0.9rem", transition: "color 0.2s" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Account</h4>
            {[
              { label: "My Profile", href: "/account/profile" },
              { label: "My Orders", href: "/account/orders" },
              { label: "Wishlist", href: "/account/wishlist" },
              { label: "Sign In", href: "/login" },
              { label: "Register", href: "/register" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ display: "block", color: "var(--text-secondary)", textDecoration: "none", marginBottom: 12, fontSize: "0.9rem" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Support</h4>
            {[
              { label: "Help Center", href: "/help" },
              { label: "Contact Us", href: "/contact" },
              { label: "Return Policy", href: "/returns" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ display: "block", color: "var(--text-secondary)", textDecoration: "none", marginBottom: 12, fontSize: "0.9rem" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <hr className="divider" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            © {year} ShopNest. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Visa", "Mastercard", "PayPal", "Stripe"].map((p) => (
              <span key={p} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                borderRadius: 6, padding: "4px 10px",
                fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600,
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
