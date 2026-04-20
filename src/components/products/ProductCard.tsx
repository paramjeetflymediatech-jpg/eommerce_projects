"use client";
import Link from "next/link";
import Image from "next/image";
import FallbackImage from "@/components/common/FallbackImage";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string | number;
  originalId?: number;
  variantId?: number;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  color?: string;
  isFeatured?: boolean;
  category?: { name: string; slug: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const productId = product.id;
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(productId));
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/products/${product.slug}`)}`);
      return;
    }
    toggleItem({
      id: productId,
      name: product.name,
      price: product.price,
      images: product.images,
      slug: product.slug,
    });
  };

  const imageUrl = product.images?.[0] || "/placeholder-product.jpg";
  const hoverImageUrl = product.images?.length > 1 ? product.images[1] : null;
  const productUrl = `/products/${product.slug}${product.variantId ? `?variant=${product.variantId}` : ""}`;

  return (
    <Link href={productUrl} style={styles.card}>
      {/* Image Container */}
      <div style={styles.imageWrapper} className="hover-parent">
        <FallbackImage
          src={imageUrl}
          alt={product.name}
          fill
          unoptimized={true}
          style={styles.image}
          className="hover-image-front"
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        
        {hoverImageUrl && (
          <FallbackImage
            src={hoverImageUrl}
            alt={`${product.name} - Back View`}
            fill
            unoptimized={true}
            style={styles.image}
            className="hover-image-back"
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        )}
        
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
        .hover-image-back {
          opacity: 0;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
        }
        .hover-image-front {
          opacity: 1;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
        }
        .hover-parent:hover .hover-image-front {
          opacity: 0;
          transform: scale(1.05);
        }
        .hover-parent:hover .hover-image-back {
          opacity: 1 !important;
          transform: scale(1.05);
        }
        .hover-parent:hover .hover-overlay {
          opacity: 1;
        }
        /* Fallback for scaled images that might look blurry */
        .hover-image-front, .hover-image-back {
          backface-visibility: hidden;
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
    background: "white",
    overflow: "hidden",
    marginBottom: "16px",
  },
  image: {
    objectFit: "contain",
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
    fontSize: "0.8rem",
    fontWeight: 500,
    letterSpacing: "normal",
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
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "normal",
  },
  content: {
    padding: "0 4px",
  },
  categoryArea: {
    marginBottom: "8px",
    height: "12px",
  },
  category: {
    fontSize: "0.65rem",
    color: "#888",
    fontWeight: 500,
    letterSpacing: "normal",
  },
  name: {
    fontSize: "0.95rem",
    fontWeight: 500,
    letterSpacing: "normal",
    lineHeight: 1.3,
    marginBottom: "8px",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
  },
  price: {
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "normal",
  },
  comparePrice: {
    fontSize: "0.8rem",
    color: "#ccc",
    textDecoration: "line-through",
  },
};
