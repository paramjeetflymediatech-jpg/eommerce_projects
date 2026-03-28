import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your account settings and personal information.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/account/profile");
  }

  const user = session.user;
  const initials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "U";

  return (
    <div className="container-app" style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 32 }}>Account Overview</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
          {/* Card Side */}
          <div className="card" style={{ padding: 32, textAlign: "center", height: "fit-content" }}>
            <div style={{ position: "relative", width: 100, height: 100, borderRadius: "50%", background: "var(--gradient-primary)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: 800, color: "white" }}>
              {user?.image ? (
                <Image src={user.image} alt={user.name || "User"} fill style={{ borderRadius: "50%", objectFit: "cover" }} />
              ) : initials}
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 4 }}>{user?.name || "Member"}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 20 }}>{user?.email}</p>
            <div className={`badge ${user?.role === "ADMIN" ? "badge-primary" : "badge-secondary"}`} style={{ display: "inline-block", padding: "6px 16px" }}>
              {user?.role || "CUSTOMER"}
            </div>
          </div>

          {/* Details Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>Personal Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div><label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>Full Name</label><p style={{ fontWeight: 600 }}>{user?.name || "—"}</p></div>
                <div><label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>Email Address</label><p style={{ fontWeight: 600 }}>{user?.email}</p></div>
                <div><label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>Account Status</label><p style={{ color: "var(--success)", fontWeight: 600 }}>Active</p></div>
                <div><label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>Member Since</label><p style={{ fontWeight: 600 }}>March 2026</p></div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 32 }}>Edit Profile</button>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>Privacy & Security</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><p style={{ fontWeight: 600, marginBottom: 2 }}>Password</p><p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Last updated 3 months ago</p></div>
                  <button className="btn btn-ghost btn-sm">Change</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><p style={{ fontWeight: 600, marginBottom: 2 }}>Two-Factor Authentication</p><p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Not enabled</p></div>
                  <button className="btn btn-ghost btn-sm">Enable</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
