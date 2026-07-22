"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Blog {
  id: number;
  title: string;
  slug: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/admin/login");
  }, [status, session, router]);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") loadBlogs();
  }, [status]);

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: "Delete Blog?",
      text: "Are you sure you want to delete this blog post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      confirmButtonText: "Yes, delete",
    });
    if (!res.isConfirmed) return;

    try {
      await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      setMsg({ text: "Blog deleted.", type: "success" });
      loadBlogs();
    } catch {
      setMsg({ text: "Failed to delete.", type: "error" });
    }
  };

  // Pagination logic
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const currentBlogs = blogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (status === "loading") return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.mainContainer}>
      <div style={s.actionHeader}>
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Blogs</h2>
        <button onClick={() => router.push("/admin/blogs/new")} style={s.addBtn}>+ New Blog</button>
      </div>

      {msg.text && (
        <div style={{ ...s.alert, background: msg.type === "error" ? "#FFF5F5" : "#F0FDF4", color: msg.type === "error" ? "#DC2626" : "#15803D" }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={s.center}>Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div style={s.empty}>
          <p style={{ color: "#888", marginBottom: 16 }}>No blogs found.</p>
          <button onClick={() => router.push("/admin/blogs/new")} style={s.addBtn}>Create your first blog</button>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Image</th>
                <th style={s.th}>Title</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBlogs.map(b => (
                <tr key={b.id} style={s.tr}>
                  <td style={s.td}>
                    {b.image ? <img src={b.image} alt={b.title} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: "4px" }} /> : "—"}
                  </td>
                  <td style={s.td}>
                    <strong>{b.title}</strong><br />
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>{b.slug}</span>
                  </td>
                  <td style={s.td}>
                    {b.isPublished ? <span style={{ color: "green", fontWeight: 600 }}>Published</span> : <span style={{ color: "red", fontWeight: 600 }}>Draft</span>}
                  </td>
                  <td style={s.td}>{new Date(b.updatedAt).toLocaleDateString()}</td>
                  <td style={s.td}>
                    <button onClick={() => router.push(`/admin/blogs/${b.id}/edit`)} style={s.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(b.id)} style={s.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div style={s.pagination}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ ...s.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <span style={{ fontSize: "0.9rem", color: "#666" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ ...s.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  mainContainer: { padding: "30px", background: "#f8fafc", minHeight: "100vh", color: "#000" },
  actionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  addBtn: { background: "#000", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" },
  alert: { padding: "12px", marginBottom: "20px", borderRadius: "4px" },
  center: { textAlign: "center", padding: "40px", color: "#888" },
  empty: { textAlign: "center", padding: "40px", border: "1px dashed #ccc", borderRadius: "8px", background: "#fff" },
  tableWrap: { overflowX: "auto", border: "1px solid #eee", borderRadius: "8px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" },
  th: { background: "#f1f5f9", padding: "14px 20px", textAlign: "left", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: 600 },
  tr: { borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" },
  td: { padding: "14px 20px", verticalAlign: "middle" },
  editBtn: { background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", padding: "6px 16px", marginRight: "8px", cursor: "pointer", borderRadius: "4px", fontWeight: 600 },
  deleteBtn: { background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", padding: "6px 16px", cursor: "pointer", borderRadius: "4px", fontWeight: 600 },
  pagination: { padding: "16px 20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" },
  pageBtn: { padding: "8px 16px", background: "#fff", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontWeight: 600, color: "#334155" }
};
