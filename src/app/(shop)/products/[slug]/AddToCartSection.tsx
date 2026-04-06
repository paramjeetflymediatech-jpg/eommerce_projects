"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useNotificationStore } from "@/store/notificationStore";
import { formatPrice } from "@/lib/utils";
import s from "./product-detail.module.css";

interface Variant {
  id: number;
  size: string;
  color?: string | null;
  price?: number | null;
  comparePrice?: number | null;
  stock: number;
  images?: string[] | null;
}

interface Product {
  id: number;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  slug: string;
  stock: number;
  variants?: Variant[];
}

interface AddToCartSectionProps {
  product: Product;
  externalSelectedColor?: string | null;
  onColorChange?: (color: string) => void;
  externalSelectedSize?: string | null;
  onSizeChange?: (size: string) => void;
  /** Sizes pre-filtered for the active color — passed in from parent */
  filteredSizes?: string[];
}

export default function AddToCartSection({
  product,
  externalSelectedColor,
  onColorChange,
  externalSelectedSize,
  onSizeChange,
  filteredSizes,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const currentItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const handleWishlistClick = () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    toggleItem({
      id: product.id, name: product.name, price: product.price,
      images: product.images, slug: product.slug,
    });
  };

  const selectedColor = externalSelectedColor ?? null;
  const selectedSize = externalSelectedSize ?? null;

  // Sizes to display: use filtered list from parent if provided, else derive
  const sizesToShow: string[] = useMemo(() => {
    if (filteredSizes && filteredSizes.length > 0) return filteredSizes;
    if (!product.variants?.length) return [];
    const rows = selectedColor
      ? product.variants.filter(v => v.color === selectedColor)
      : product.variants;
    return Array.from(new Set(rows.map(v => v.size)));
  }, [filteredSizes, product.variants, selectedColor]);

  // Whether any colors exist (used to decide if we need color validation)
  const hasColors = useMemo(
    () => (product.variants ?? []).some(v => v.color),
    [product.variants]
  );

  // Find the exact variant for the current color + size selection
  const selectedVariant: Variant | null = useMemo(() => {
    if (!product.variants?.length || !selectedSize) return null;
    return (
      product.variants.find(v =>
        v.size === selectedSize &&
        (!hasColors || v.color === selectedColor)
      ) ?? null
    );
  }, [product.variants, selectedSize, selectedColor, hasColors]);

  const currentItemInCart = currentItems.find(
    i => i.product.id === product.id && i.variant?.id === selectedVariant?.id
  );
  const currentItemQuantity = currentItemInCart?.quantity ?? 0;
  const maxAllowed = 10 - currentItemQuantity;
  const isLimitReached = currentItemQuantity >= 10;

  useEffect(() => {
    setMounted(true);
    if (maxAllowed < quantity && maxAllowed > 0) setQuantity(maxAllowed);
    else if (isLimitReached) setQuantity(1);
  }, [maxAllowed, isLimitReached, quantity]);

  const handleAddToCart = () => {
    if (!product.variants || product.variants.length === 0) {
      addItem(
        { id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug, stock: product.stock },
        quantity
      );
    } else {
      if (!selectedSize || (hasColors && !selectedColor)) {
        useNotificationStore.getState().showNotification(
          `Please select a ${!selectedSize ? "size" : "color"}.`, "error"
        );
        return;
      }
      if (!selectedVariant) {
        useNotificationStore.getState().showNotification(
          "This combination is unavailable.", "error"
        );
        return;
      }
      if (quantity > maxAllowed) {
        useNotificationStore.getState().showNotification(
          `You already have ${currentItemQuantity} in your cart. Maximum 10 per product.`, "error"
        );
        return;
      }
      addItem(
        { id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug, stock: product.stock },
        quantity,
        { id: selectedVariant.id, size: selectedVariant.size, color: selectedVariant.color, price: selectedVariant.price }
      );
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayComparePrice = selectedVariant
    ? (selectedVariant.comparePrice ?? product.comparePrice)
    : product.comparePrice;
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  const atcLabel = () => {
    if (added) return "Item Added ✓";
    if (product.stock === 0) return "Sold Out";
    if (sizesToShow.length > 0 && !selectedSize) return "Select Size";
    return "Add to Cart";
  };

  return (
    <div>
      {/* Price Area */}
      <div className={s.priceArea}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span className={s.price}>{formatPrice(displayPrice)}</span>
          {displayComparePrice && displayComparePrice > displayPrice && (
            <span className={s.oldPrice}>{formatPrice(displayComparePrice)}</span>
          )}
        </div>

        {/* Stock Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: displayStock > 0
              ? (displayStock < 5 ? "#F59E0B" : "#10B981")
              : "#EF4444",
          }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#666" }}>
            {displayStock > 0
              ? (displayStock < 5 ? `Low Stock — Only ${displayStock} left` : "In Stock — Ready to Ship")
              : "Sold Out"}
          </span>
        </div>
      </div>

      {/* Size Selector — filtered to active color */}
      {sizesToShow.length > 0 && (
        <div className={s.variantsSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className={s.variantLabel}>
              Size:{" "}
              {selectedSize && (
                <span style={{ color: "#000", fontWeight: 700 }}>{selectedSize}</span>
              )}
            </span>
            <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#000", textDecoration: "underline", cursor: "pointer" }}>
              Size Guide
            </span>
          </div>
          <div className={s.variantGrid}>
            {sizesToShow.map(size => {
              const variantForSize = product.variants?.find(v =>
                v.size === size && (!hasColors || v.color === selectedColor)
              );
              const outOfStock = !variantForSize || variantForSize.stock === 0;
              return (
                <button
                  key={size}
                  disabled={outOfStock}
                  onClick={() => onSizeChange?.(size)}
                  className={`${s.sizeBtn} ${selectedSize === size ? s.activeBtn : ""} ${outOfStock ? s.disabledBtn : ""}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className={s.quantityGroup}>
        <span className={s.variantLabel} style={{ marginBottom: 0 }}>Quantity</span>
        <div className={s.qBox}>
          <button
            disabled={quantity <= 1 || isLimitReached}
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className={s.qBtn}
          >—</button>
          <span className={s.qVal} style={{ opacity: isLimitReached ? 0.3 : 1 }}>{quantity}</span>
          <button
            disabled={
              quantity >= maxAllowed ||
              (selectedVariant ? selectedVariant.stock <= currentItemQuantity + quantity : product.stock <= quantity)
            }
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
            className={s.qBtn}
          >+</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={s.mainActions}>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLimitReached}
          className={s.atcBtn}
        >
          {atcLabel()}
        </button>
        <button
          onClick={handleWishlistClick}
          className={s.wishBtn}
          title={mounted && isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Add to Wishlist"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={mounted && isWishlisted ? "#e11d48" : "none"}
            stroke={mounted && isWishlisted ? "#e11d48" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
