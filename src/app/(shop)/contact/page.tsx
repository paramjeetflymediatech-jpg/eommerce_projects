"use client";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app section-padding animate-fade">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 80, textAlign: "center" }}>
          <h1 style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)", 
            marginBottom: 24,
            fontWeight: 400,
            letterSpacing: "-0.03em"
          }}>
            Get in Touch
          </h1>
          <div style={{ 
            height: 1, 
            width: 60, 
            background: "var(--accent)", 
            margin: "0 auto 24px" 
          }} />
          <p style={{ 
            color: "var(--text-secondary)", 
            fontSize: "1.1rem", 
            fontFamily: "var(--font-body)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Whether you have a question about our collections or need assistance with an order, our team is here to provide exceptional service.
          </p>
        </header>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1.2fr", 
          gap: 80, 
          alignItems: "start" 
        }}>
          {/* Info Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <section>
              <h2 style={{ 
                fontSize: "0.75rem", 
                fontWeight: 700, 
                textTransform: "uppercase", 
                letterSpacing: "0.2em",
                color: "var(--text-muted)",
                marginBottom: 24
              }}>
                The Atelier
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: 12, color: "var(--text-primary)" }}>Our Location</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1rem" }}>
                    M/S JOGINDER PAL VIJAY KUMAR<br />
                    SADAR BAZAR, TAPA, Distt: BARNALA<br />
                    Punjab, 148108
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: 12, color: "var(--text-primary)" }}>Contact Details</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1rem" }}>
                    <strong>Email:</strong> honey.sood1987@gmail.com<br />
                    <strong>Phone:</strong> +91 9463873415
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: 12, color: "var(--text-primary)" }}>Business Hours</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1rem" }}>
                    Monday – Saturday: 10:00 AM – 8:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </section>

            <div style={{ 
              padding: 40, 
              background: "var(--bg-muted)", 
              border: "1px solid var(--border-subtle)" 
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 12 }}>Corporate Inquiries</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                For partnership opportunities, wholesale inquiries, or media relations, please contact our corporate team at honey.sood1987@gmail.com.
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div style={{ 
            background: "#fff", 
            padding: "0 0 0 0" 
          }}>
            {success ? (
              <div className="animate-fade" style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  background: "var(--accent)", 
                  color: "#fff", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "2rem", 
                  margin: "0 auto 32px" 
                }}>
                  ✓
                </div>
                <h2 style={{ fontSize: "2rem", fontWeight: 500, marginBottom: 16 }}>Message Sent</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>
                  Thank you for reaching out. A member of our concierge team will respond to your inquiry shortly.
                </p>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="btn btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div className="field-group">
                    <label style={labelStyle}>First Name</label>
                    <input name="firstName" required style={inputStyle} placeholder="John" />
                  </div>
                  <div className="field-group">
                    <label style={labelStyle}>Last Name</label>
                    <input name="lastName" required style={inputStyle} placeholder="Doe" />
                  </div>
                </div>

                <div className="field-group">
                  <label style={labelStyle}>Email Address</label>
                  <input name="email" required type="email" style={inputStyle} placeholder="john@example.com" />
                </div>

                <div className="field-group">
                  <label style={labelStyle}>Subject</label>
                  <select name="subject" required style={inputStyle}>
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Product Feedback">Product Feedback</option>
                  </select>
                </div>

                <div className="field-group">
                  <label style={labelStyle}>Message</label>
                  <textarea 
                    name="message" 
                    required 
                    rows={6} 
                    style={{ ...inputStyle, resize: "none" }} 
                    placeholder="How can we assist you today?" 
                  />
                </div>

                {error && (
                  <p style={{ color: "#EF4444", fontSize: "0.9rem", marginTop: -16 }}>{error}</p>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn btn-primary" 
                  style={{ 
                    padding: "20px", 
                    fontSize: "0.9rem", 
                    letterSpacing: "0.1em",
                    marginTop: 12
                  }}
                >
                  {loading ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--text-primary)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 0",
  fontSize: "1rem",
  border: "none",
  borderBottom: "1px solid var(--border)",
  outline: "none",
  background: "transparent",
  transition: "border-color 0.3s ease",
  borderRadius: 0,
};
