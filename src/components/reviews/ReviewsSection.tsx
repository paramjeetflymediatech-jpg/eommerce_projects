"use client";
import React, { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

interface Review {
  id: number;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  videoUrl?: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export default function ReviewsSection({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avg: 0, total: 0 });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        if (data.reviews?.length > 0) {
          const sum = data.reviews.reduce((acc: number, r: Review) => acc + r.rating, 0);
          setStats({ avg: sum / data.reviews.length, total: data.reviews.length });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) return <div style={styles.loading}>Loading reviews...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.summary}>
          <h2 style={styles.title}>Customer Reviews</h2>
          <div style={styles.ratingRow}>
            <span style={styles.avgRating}>{stats.avg.toFixed(1)}</span>
            <div style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ color: s <= Math.round(stats.avg) ? "#000" : "#ddd" }}>★</span>
              ))}
            </div>
            <span style={styles.count}>({stats.total} reviews)</span>
          </div>
        </div>
      </header>

      {reviews.length === 0 ? (
        <div style={styles.empty}>No reviews yet. Be the first to share your thoughts!</div>
      ) : (
        <div style={styles.list}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.userInfo}>
                  <div style={styles.avatar}>
                    {review.user.avatar ? (
                      <img src={review.user.avatar} alt="" style={styles.avatarImg} />
                    ) : (
                      review.user.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p style={styles.userName}>
                      {review.user.name}
                      {review.isVerified && <span style={styles.verifiedTag}>Verified Purchase</span>}
                    </p>
                    <div style={styles.itemStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} style={{ color: s <= review.rating ? "#000" : "#ddd", fontSize: "0.8rem" }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>

              {review.title && <h4 style={styles.reviewTitle}>{review.title}</h4>}
              <p style={styles.comment}>{review.comment}</p>

              {/* Review Gallery */}
              {review.images && review.images.length > 0 && (
                <div style={styles.reviewMedia}>
                  {review.images.map((url, idx) => (
                    <img key={idx} src={url} alt="" style={styles.reviewImg} onClick={() => setSelectedImage(url)} />
                  ))}
                </div>
              )}

              {/* Review Video */}
              {review.videoUrl && (
                <div style={styles.reviewVideoContainer}>
                  <video src={review.videoUrl} style={styles.reviewVideo} controls />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Full screen view" 
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", background: "#000" }} 
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#fff", fontSize: "2rem", cursor: "pointer" }}
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "48px 0",
    borderTop: "1px solid #eee",
    marginTop: "48px",
  },
  loading: {
    padding: "48px 0",
    textAlign: "center",
    color: "#888",
    fontSize: "0.9rem",
  },
  header: {
    marginBottom: "40px",
  },
  summary: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: 0,
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avgRating: {
    fontSize: "1.5rem",
    fontWeight: 800,
  },
  stars: {
    fontSize: "1.2rem",
    letterSpacing: "2px",
  },
  count: {
    fontSize: "0.85rem",
    color: "#888",
  },
  empty: {
    padding: "40px 0",
    color: "#aaa",
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  reviewCard: {
    paddingBottom: "32px",
    borderBottom: "1px solid #f9f9f9",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  userInfo: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#f1f1f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: 700,
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  userName: {
    fontSize: "0.9rem",
    fontWeight: 700,
    margin: "0 0 4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  verifiedTag: {
    fontSize: "0.6rem",
    color: "#34C759",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 800,
  },
  itemStars: {
    display: "flex",
    gap: "2px",
  },
  date: {
    fontSize: "0.75rem",
    color: "#aaa",
  },
  reviewTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    margin: "0 0 8px",
  },
  comment: {
    fontSize: "0.9rem",
    lineHeight: 1.6,
    color: "#444",
    margin: "0 0 20px",
  },
  reviewMedia: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  reviewImg: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    cursor: "pointer",
    border: "1px solid #eee",
  },
  reviewVideoContainer: {
    width: "100%",
    maxWidth: "400px",
    background: "#000",
    borderRadius: "4px",
    overflow: "hidden",
  },
  reviewVideo: {
    width: "100%",
    display: "block",
  },
};
