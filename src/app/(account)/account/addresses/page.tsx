"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const emptyForm = { name: "", street: "", city: "", state: "", zip: "", country: "IN", phone: "" };

export default function AddressesPage() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setMsg({ text: "", type: "" });
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setForm({
      name: addr.name,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      phone: addr.phone,
    });
    setEditId(addr.id);
    setMsg({ text: "", type: "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.street || !form.city || !form.state || !form.zip || !form.phone) {
      setMsg({ text: "All fields are required.", type: "error" });
      return;
    }
    setSaving(true);
    setMsg({ text: "", type: "" });
    try {
      const res = await fetch("/api/addresses", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { id: editId, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ text: data.error || "Failed to save address.", type: "error" });
      } else {
        setMsg({ text: editId ? "Address updated!" : "Address saved!", type: "success" });
        setShowForm(false);
        fetchAddresses();
      }
    } catch (e) {
      setMsg({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await fetch("/api/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true }),
      });
      fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Saved Addresses</h2>
          <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>{addresses.length} address{addresses.length !== 1 ? "es" : ""} found</p>
        </div>
        <button
          onClick={openAdd}
          style={{ background: "#000", color: "#fff", border: "none", padding: "12px 24px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
        >
          + Add New
        </button>
      </div>

      {/* Message */}
      {msg.text && !showForm && (
        <div style={{
          padding: "12px 16px",
          marginBottom: 16,
          background: msg.type === "error" ? "#FFF5F5" : "#F0FDF4",
          border: `1px solid ${msg.type === "error" ? "#FECACA" : "#BBF7D0"}`,
          color: msg.type === "error" ? "#DC2626" : "#15803D",
          fontSize: "0.85rem",
        }}>
          {msg.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ paddingBottom: 40, borderBottom: "1px solid #eee", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>{editId ? "Edit Address" : "New Address"}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: "1rem", cursor: "pointer", color: "#888" }}>✕</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={s.label}>Full Name *</label>
              <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={s.label}>Phone *</label>
              <input style={s.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label style={s.label}>Pincode *</label>
              <input style={s.input} value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={s.label}>Address *</label>
              <input style={s.input} value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
            </div>
            <div>
              <label style={s.label}>City *</label>
              <input style={s.input} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label style={s.label}>State *</label>
              <input style={s.input} value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: "#000", color: "#fff", border: "none", padding: "12px 28px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "1px solid #ddd", padding: "12px 24px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      {loading ? (
        <p style={{ fontStyle: "italic", color: "#888", fontSize: "0.85rem" }}>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", border: "1px dashed #eee" }}>
          <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: 20 }}>No addresses found.</p>
          <button onClick={openAdd} style={{ background: "#000", color: "#fff", border: "none", padding: "12px 24px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>Add First Address</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {addresses.map((addr) => (
            <div key={addr.id} style={{
              border: `1px solid ${addr.isDefault ? "#000" : "#eee"}`,
              padding: "24px",
              position: "relative",
              background: "#fff",
            }}>
              {addr.isDefault && (
                <span style={{ position: "absolute", top: 12, right: 12, background: "#000", color: "#fff", fontSize: "0.6rem", fontWeight: 800, padding: "2px 6px", letterSpacing: "0.05em" }}>DEFAULT</span>
              )}
              <h4 style={{ margin: "0 0 12px", fontSize: "0.95rem", fontWeight: 700 }}>{addr.name}</h4>
              <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#555" }}>{addr.street}</p>
              <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#555" }}>{addr.city}, {addr.state} - {addr.zip}</p>
              <p style={{ margin: "0 0 20px", fontSize: "0.8rem", color: "#888" }}>Phone: {addr.phone}</p>

              <div style={{ display: "flex", gap: 16, borderTop: "1px solid #f9f9f9", paddingTop: 16 }}>
                <button onClick={() => openEdit(addr)} style={s.actionLink}>Edit</button>
                <button onClick={() => handleDelete(addr.id)} style={{ ...s.actionLink, color: "#dc2626" }}>Delete</button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} style={{ ...s.actionLink, marginLeft: "auto" }}>Set Default</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  label: { display: "block", fontSize: "0.65rem", fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 },
  input: { width: "100%", padding: "12px 0", border: "none", borderBottom: "1px solid #eee", fontSize: "0.9rem", outline: "none", marginBottom: 12 },
  actionLink: { background: "none", border: "none", padding: 0, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", color: "#000" },
};
