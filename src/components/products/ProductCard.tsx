"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  category?: { name: string; slug: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/products/${product.slug}`)}`);
      return;
    }
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      slug: product.slug,
    });
  };

  const imageUrl = product.images?.[0] || "/placeholder-product.jpg";

  return (
    <Link href={`/products/${product.slug}`} style={styles.card}>
      {/* Image Container */}
      <div style={styles.imageWrapper} className="hover-parent">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          unoptimized={true}
          style={styles.image}
          className="hover-image"
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        
        {/* Hover Overlay */}
        <div style={styles.overlay} className="hover-overlay">
          <span style={styles.viewText}>View Product</span>
        </div>

        {/* Wishlist Toggle */}
        <button
          onClick={handleWishlist}
          style={styles.wishlistBtn}
          aria-label="Add to Wishlist"
          title="Add to Wishlist"
          suppressHydrationWarning
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={mounted && isWishlisted ? "#e11d48" : "none"}
            stroke={mounted && isWishlisted ? "#e11d48" : "#000"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            suppressHydrationWarning
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Featured Tag */}
        {product.isFeatured && (
          <div style={styles.featuredTag}>Selected</div>
        )}
      </div>

      {/* Product Information */}
      <div style={styles.content}>
        <div style={styles.categoryArea}>
          {product.category && (
            <span style={styles.category}>{product.category.name}</span>
          )}
        </div>
        
        <h3 style={styles.name}>{product.name}</h3>
        
        <div style={styles.priceRow}>
          <span style={styles.price}>{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span style={styles.comparePrice}>{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>

      <style>{`
        .hover-parent:hover .hover-image {
          transform: scale(1.05);
        }
        .hover-parent:hover .hover-overlay {
          opacity: 1;
        }
        .hover-image {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </Link>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: "block",
    textDecoration: "none",
    color: "#000",
    position: "relative",
  },
  imageWrapper: {
    position: "relative",
    aspectRatio: "11/14",
    background: "#f9f9f9",
    overflow: "hidden",
    marginBottom: "24px",
  },
  image: {
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.4s ease",
  },
  viewText: {
    fontSize: "0.6rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#000",
    background: "#fff",
    padding: "12px 24px",
    border: "1px solid #000",
  },
  wishlistBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontSize: "14px",
    color: "#000",
    zIndex: 10,
    transition: "transform 0.3s ease",
  },
  featuredTag: {
    position: "absolute",
    top: "0",
    left: "0",
    background: "#000",
    color: "#fff",
    padding: "6px 12px",
    fontSize: "0.55rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
  },
  content: {
    padding: "0 4px",
  },
  categoryArea: {
    marginBottom: "8px",
    height: "12px",
  },
  category: {
    fontSize: "0.6rem",
    color: "#ccc",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
  },
  name: {
    fontSize: "0.95rem",
    fontWeight: 500,
    letterSpacing: "0.02em",
    lineHeight: 1.4,
    marginBottom: "10px",
    textTransform: "uppercase",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
  },
  price: {
    fontSize: "0.9rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
  comparePrice: {
    fontSize: "0.8rem",
    color: "#ccc",
    textDecoration: "line-through",
  },
};
