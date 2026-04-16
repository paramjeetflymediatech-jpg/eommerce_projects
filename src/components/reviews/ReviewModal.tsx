"use client";
import React, { useState, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import Swal from "sweetalert2";

interface ReviewModalProps {
  product: {
    id: number;
    name: string;
    images: string[];
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ product, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "image" && images.length + files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("folder", "reviews");
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.urls) {
        if (type === "image") {
          setImages([...images, ...data.urls]);
        } else {
          setVideoUrl(data.urls[0]);
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!comment) {
      alert("Please enter a comment");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating,
          title: title || undefined,
          comment,
          images,
          videoUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Review Submitted!",
          text: "Thank you for your feedback.",
          showConfirmButton: false,
          timer: 2000,
        });
        onSuccess();
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Write a Review</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.productInfo}>
          <img src={product.images[0]} alt={product.name} style={styles.productImg} />
          <div>
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.productSub}>Tell us what you think about your purchase.</p>
          </div>
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Overall Rating</label>
          <div style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  ...styles.starBtn,
                  color: star <= rating ? "#FFD700" : "#ddd",
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Review Title (Optional)</label>
          <input
            type="text"
            placeholder="Sum up your experience"
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Your Review</label>
          <textarea
            placeholder="What did you like or dislike?"
            style={{ ...styles.input, height: 100, paddingTop: 12, resize: "none" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Add Photos ({images.length}/5)</label>
          <div style={styles.mediaGrid}>
            {images.map((url, idx) => (
              <div key={idx} style={styles.mediaSlot}>
                <img src={url} alt="" style={styles.mediaPreview} />
                <button style={styles.removeBtn} onClick={() => handleRemoveImage(idx)}>✕</button>
              </div>
            ))}
            {images.length < 5 && (
              <button 
                style={styles.addMediaBtn} 
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
              >
                + Image
              </button>
            )}
          </div>
          <input
            type="file"
            ref={imageInputRef}
            style={{ display: "none" }}
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "image")}
          />
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Add Video (Max 1)</label>
          {videoUrl ? (
            <div style={styles.videoSlot}>
              <video src={videoUrl} style={styles.videoPreview} controls />
              <button style={styles.removeBtn} onClick={() => setVideoUrl(null)}>✕</button>
            </div>
          ) : (
            <button 
              style={styles.addMediaBtn}
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
            >
              + Video
            </button>
          )}
          <input
            type="file"
            ref={videoInputRef}
            style={{ display: "none" }}
            accept="video/*"
            onChange={(e) => handleFileUpload(e, "video")}
          />
        </div>

        <button 
          style={{ ...styles.submitBtn, opacity: uploading || submitting ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={uploading || submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "#fff",
    width: "100%",
    maxWidth: "500px",
    padding: "32px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  headerTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "normal",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    padding: "4px",
  },
  productInfo: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    marginBottom: "32px",
    paddingBottom: "24px",
    borderBottom: "1px solid #f1f1f1",
  },
  productImg: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    background: "#f9f9f9",
  },
  productName: {
    fontSize: "0.9rem",
    fontWeight: 700,
    margin: "0 0 4px",
  },
  productSub: {
    fontSize: "0.8rem",
    color: "#888",
    margin: 0,
  },
  formSection: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "normal",
    color: "#aaa",
    marginBottom: "12px",
  },
  starRow: {
    display: "flex",
    gap: "8px",
  },
  starBtn: {
    background: "none",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    padding: 0,
    transition: "transform 0.2s ease",
  },
  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #eee",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "inherit",
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "12px",
  },
  mediaSlot: {
    width: "80px",
    height: "80px",
    position: "relative",
    border: "1px solid #eee",
  },
  mediaPreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "#000",
    color: "#fff",
    border: "none",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    fontSize: "0.6rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addMediaBtn: {
    width: "80px",
    height: "80px",
    background: "#f9f9f9",
    border: "1px dashed #ddd",
    fontSize: "0.7rem",
    fontWeight: 600,
    cursor: "pointer",
    color: "#888",
  },
  videoSlot: {
    width: "100%",
    height: "200px",
    position: "relative",
    background: "#f9f9f9",
    border: "1px solid #eee",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    background: "#000",
    color: "#fff",
    border: "none",
    fontSize: "0.9rem",
    fontWeight: 600,
    letterSpacing: "normal",
    marginTop: "16px",
    cursor: "pointer",
  },
};
