"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, calculateDiscount } from "@/lib/utils";

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
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const discount = calculateDiscount(product.price, product.comparePrice || 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      slug: product.slug,
      stock: product.stock,
    });
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ overflow: "hidden", position: "relative" }}>
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: "var(--bg-elevated)" }}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            sizes="(max-width: 768px) 100vw, 33vw"
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          {/* Badges */}
          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {product.isFeatured && <span className="badge badge-primary">⭐ Featured</span>}
            {discount > 0 && <span className="badge badge-danger">-{discount}%</span>}
            {product.stock === 0 && <span className="badge" style={{ background: "rgba(0,0,0,0.7)", color: "var(--text-muted)" }}>Out of Stock</span>}
          </div>
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 36, height: 36, borderRadius: "50%",
              background: isWishlisted ? "var(--secondary)" : "rgba(0,0,0,0.5)",
              border: "none", cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "16px" }}>
          {product.category && (
            <p style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {product.category.name}
            </p>
          )}
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <div className="stars" style={{ fontSize: "0.8rem" }}>
                {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>({product.reviewCount})</span>
            </div>
          )}

          {/* Price + Cart */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <div>
              <span className="price" style={{ fontSize: "1.1rem" }}>{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="price-compare" style={{ marginLeft: 8, fontSize: "0.85rem" }}>
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary btn-sm"
              style={{ minWidth: 44, padding: "8px 12px" }}
            >
              {product.stock === 0 ? "—" : "🛒"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
