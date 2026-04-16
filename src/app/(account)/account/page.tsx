"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AccountOverviewPage() {
  const { data: session } = useSession();

  return (
    <div>
      {/* Profile Overview */}
      <section style={{ marginBottom: 48, display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ width: 100, height: 100, background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: 700, flexShrink: 0 }}>
          {(session?.user?.name || "U")[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0 0 8px" }}>{session?.user?.name || "Welcome Back"}</h2>
          <p style={{ fontSize: "0.95rem", color: "#888", margin: 0, fontWeight: 300 }}>{session?.user?.email}</p>
        </div>
      </section>

      {/* Grid Quick Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {[
          { href: "/account/orders", label: "My Orders", desc: "Track and manage your order history", icon: "▤" },
          { href: "/account/addresses", label: "Saved Addresses", desc: "Management of shipping locations", icon: "◎" },
          { href: "/account/profile", label: "Profile Settings", desc: "Update your personal credentials", icon: "👤" },
          { href: "/account/wishlist", label: "My Wishlist", icon: "♥", desc: "Browse your saved favorite items" },
        ].map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            style={{ 
              background: "#fff", border: "1px solid #eee", padding: "32px", 
              textDecoration: "none", color: "#000", transition: "all 0.2s" 
            }}
          >
            <div style={{ fontSize: "1.2rem", color: "#888", marginBottom: 16 }}>{item.icon}</div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "normal", margin: "0 0 8px" }}>{item.label}</h3>
            <p style={{ fontSize: "0.85rem", color: "#888", margin: 0, fontWeight: 300, lineHeight: 1.6 }}>{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid #eee" }}>
         <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ background: "#000", color: "#fff", border: "none", padding: "16px 32px", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", cursor: "pointer" }}
          >
            Sign Out Permanently
          </button>
      </div>
    </div>
  );
}
