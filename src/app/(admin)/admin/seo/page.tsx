"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Seo {
  id: number;
  pagePath: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  metaRobots: string;
  twitterCard: string;
  customSchema: string;
  ogTitle: string;
  ogImageUrl: string;
  ogDescription: string;
}



export default function AdminSeoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [seos, setSeos] = useState<Seo[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/admin/login");
  }, [status, session, router]);

  const loadSeos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo");
      if (res.ok) {
        const data = await res.json();
        setSeos(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") loadSeos();
  }, [status]);

  const openCreate = () => {
    router.push("/admin/seo/new");
  };

  const openEdit = (s: Seo) => {
    router.push(`/admin/seo/${s.id}`);
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: "Delete SEO Config?",
      text: "Are you sure you want to delete this SEO configuration?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      confirmButtonText: "Yes, delete",
    });
    if (!res.isConfirmed) return;

    try {
      await fetch(`/api/admin/seo/${id}`, { method: "DELETE" });
      setMsg({ text: "SEO config deleted.", type: "success" });
      loadSeos();
    } catch {
      setMsg({ text: "Failed to delete.", type: "error" });
    }
  };

  if (status === "loading") return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.mainContainer}>
      <div style={s.actionHeader}>
        <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>Manage Page-Level SEO Settings.</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => router.push("/admin/global-seo")} style={{ ...s.addBtn, background: "#f4f5f7", color: "#000", border: "1px solid #ddd" }}>Global SEO</button>
          <button onClick={openCreate} style={s.addBtn}>+ New Page SEO</button>
        </div>
      </div>

      {msg.text && (
        <div style={{ ...s.alert, background: msg.type === "error" ? "#FFF5F5" : "#F0FDF4", color: msg.type === "error" ? "#DC2626" : "#15803D" }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={s.center}>Loading SEO settings...</div>
      ) : seos.length === 0 ? (
        <div style={s.empty}>
          <p style={{ color: "#888", marginBottom: 16 }}>No page SEO found.</p>
          <button onClick={openCreate} style={s.addBtn}>Add SEO for a page</button>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>URL Path</th>
                <th style={s.th}>Title</th>
                <th style={s.th}>Robots</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seos.map(seo => (
                <tr key={seo.id} style={s.tr}>
                  <td style={s.td}><strong>{seo.pagePath}</strong></td>
                  <td style={s.td}>{seo.seoTitle || "—"}</td>
                  <td style={s.td}>{seo.metaRobots}</td>
                  <td style={s.td}>
                    <button onClick={() => openEdit(seo)} style={s.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(seo.id)} style={s.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  mainContainer: { padding: "20px", background: "#f4f5f7", minHeight: "100vh", color: "#000" },
  actionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  addBtn: { background: "#000", color: "#fff", padding: "8px 16px", border: "none", cursor: "pointer", borderRadius: "4px", fontSize: "0.85rem" },
  alert: { padding: "12px", marginBottom: "20px", borderRadius: "4px" },
  center: { textAlign: "center", padding: "40px", color: "#888" },
  empty: { textAlign: "center", padding: "40px", border: "1px dashed #ccc", borderRadius: "8px" },
  tableWrap: { overflowX: "auto", border: "1px solid #eee", borderRadius: "8px", background: "#fff" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" },
  th: { background: "#f9f9f9", padding: "12px", textAlign: "left", borderBottom: "1px solid #eee", color: "#666" },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "12px", verticalAlign: "top" },
  editBtn: { background: "#f0f0f0", border: "none", padding: "6px 12px", marginRight: "8px", cursor: "pointer", borderRadius: "4px" },
  deleteBtn: { background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" },
};
