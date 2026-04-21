"use client";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import ImageCropper from "@/components/account/ImageCropper";

export default function AccountProfilePage() {
  const { data: session, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    avatar: session?.user?.image || session?.user?.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  
  // Image Adjustment state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear input so same file can be picked again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = async (croppedBlob: Blob) => {
    setSelectedImage(null);
    setUploading(true);
    setMsg({ text: "", type: "" });

    const formData = new FormData();
    formData.append("files", croppedBlob, "avatar.jpg");
    formData.append("folder", "avatars");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.urls?.[0]) {
        const newAvatar = data.urls[0];
        setForm(prev => ({ ...prev, avatar: newAvatar }));
        setMsg({ text: "Portrait adjusted successfully! Save profile to finalize.", type: "success" });
      } else {
        setMsg({ text: data.error || "Upload failed", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Upload error. Please try again.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ text: "Profile updated successfully.", type: "success" });
        // Sync NextAuth session
        await update({ 
          name: form.name, 
          avatar: form.avatar 
        });
      } else {
        setMsg({ text: data.error || "Update failed.", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={s.title}>Profile Settings</h2>
      <p style={s.desc}>Personalize your account identity and contact information.</p>

      {/* CROPPER MODAL */}
      {selectedImage && (
        <ImageCropper 
          image={selectedImage} 
          onCropComplete={onCropComplete} 
          onCancel={() => setSelectedImage(null)} 
        />
      )}

      {msg.text && (
        <div style={{ 
          ...s.alert, 
          background: msg.type === "error" ? "#fff5f5" : "#f0fdf4", 
          color: msg.type === "error" ? "#dc2626" : "#15803d", 
          borderColor: msg.type === "error" ? "#fecaca" : "#bbf7d0" 
        }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleUpdate} style={s.form}>
        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.lbl}>Profile Picture</label>
            <div style={s.avatarWrap}>
              <div style={s.avatarPreview}>
                {form.avatar ? (
                  <img src={form.avatar} alt="Profile" style={s.avatarImg} />
                ) : (
                  (form.name || session?.user?.name || "A")[0].toUpperCase()
                )}
                {uploading && (
                  <div style={s.uploadOverlay}>
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  style={s.uploadBtn}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Adjust & Upload New"}
                </button>
                <p style={{ fontSize: "0.75rem", color: "#888", margin: 0 }}>
                  Adjust zoom and position after selecting.
                </p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: "none" }} 
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.lbl}>Full Name</label>
            <input
              style={s.inp}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              required
            />
          </div>

          <div style={s.field}>
            <label style={s.lbl}>Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...s.inp, background: "#fcfcfc", cursor: "not-allowed", color: "#999", paddingRight: 40 }}
                value={session?.user?.email || ""}
                readOnly
              />
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem", color: "#ccc" }}>
                🔒
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#999", marginTop: 4 }}>
              Email cannot be changed. Contact support for help.
            </p>
          </div>
        </div>

        <button disabled={loading || uploading} type="submit" style={{ ...s.saveBtn, opacity: (loading || uploading) ? 0.7 : 1 }}>
          {loading ? "Saving Changes..." : "Save Profile Details"}
        </button>
      </form>

      <style jsx>{`
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #fff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  title: { fontSize: "1.8rem", fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 8 },
  desc: { fontSize: "0.9rem", color: "#888", fontWeight: 300, marginBottom: 48 },
  alert: { padding: "16px", border: "1px solid", marginBottom: 32, fontSize: "0.85rem", fontWeight: 500 },
  form: { maxWidth: 600 },
  grid: { display: "flex", flexDirection: "column", gap: 32, marginBottom: 48 },
  field: { display: "flex", flexDirection: "column", gap: 10 },
  lbl: { fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", color: "#000" },
  inp: { width: "100%", padding: "14px 18px", border: "1px solid #ddd", fontSize: "0.9rem", outline: "none", color: "#000", background: "#fff", transition: "border-color 0.2s" },
  avatarWrap: { display: "flex", alignItems: "center", gap: 24 },
  avatarPreview: { width: 80, height: 80, background: "#f5f5f5", color: "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 600, position: "relative", overflow: "hidden", borderRadius: "1px", border: "1px solid #eee" },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  uploadOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
  uploadBtn: { background: "none", border: "1px solid #000", padding: "10px 20px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "normal", cursor: "pointer", transition: "all 0.2s" },
  saveBtn: { padding: "16px 48px", background: "#000", color: "#fff", border: "none", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal", cursor: "pointer", transition: "opacity 0.2s" }
};
