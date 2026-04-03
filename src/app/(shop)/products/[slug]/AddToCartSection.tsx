"use client";
import { useState, useEffect, useMemo } from "react";
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
  stock: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
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
}

export default function AddToCartSection({ 
  product, 
  externalSelectedColor, 
  onColorChange,
  externalSelectedSize,
  onSizeChange
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const currentItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  // Derived selectors
  const uniqueColors = useMemo(() => Array.from(new Set(product.variants?.map((v: any) => v.color).filter(Boolean))) as string[], [product.variants]);
  const uniqueSizes = useMemo(() => Array.from(new Set(product.variants?.map((v: any) => v.size))) as string[], [product.variants]);

  // Use props if provided, otherwise fallback (for safety)
  const selectedColor = externalSelectedColor || null;
  const selectedSize = externalSelectedSize || null;

  // Find the exact variant based on selection
  const selectedVariant = product.variants?.find((v: any) => 
    v.size === selectedSize && (!uniqueColors.length || v.color === selectedColor)
  ) || null;

  const currentItemInCart = currentItems.find(i => 
    i.product.id === product.id && i.variant?.id === selectedVariant?.id
  );
  
  const currentItemQuantity = currentItemInCart?.quantity || 0;
  const maxAllowed = 10 - currentItemQuantity;
  const isLimitReachedForThisItem = currentItemQuantity >= 10;

  useEffect(() => {
    setMounted(true);
    if (maxAllowed < quantity && maxAllowed > 0) setQuantity(maxAllowed);
    else if (isLimitReachedForThisItem) setQuantity(1);
  }, [maxAllowed, isLimitReachedForThisItem, quantity]);

  const handleAddToCart = () => {
    if (!product.variants || product.variants.length === 0) {
      if (quantity > 10) {
        useNotificationStore.getState().showNotification("You can purchase a maximum of 10 units of this product.", "error");
        return;
      }
      addItem({ id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug, stock: product.stock }, quantity);
    } else {
      if (!selectedSize || (uniqueColors.length && !selectedColor)) {
        useNotificationStore.getState().showNotification(`Please select a ${!selectedSize ? 'size' : 'color'}.`, "error");
        return;
      }
      if (!selectedVariant) {
        useNotificationStore.getState().showNotification("This combination is currently unavailable.", "error");
        return;
      }
      if (quantity > maxAllowed) {
        useNotificationStore.getState().showNotification(`You already have ${currentItemQuantity} of this item in your cart. Maximum 10 per product.`, "error");
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
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  return (
    <div>
      {/* Dynamic Price Area */}
      <div className={s.priceArea}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span className={s.price}>
            {formatPrice(displayPrice)}
          </span>
          {product.price > displayPrice && (
            <span className={s.oldPrice}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        {/* Availability Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <div style={{ 
            width: 8, height: 8, borderRadius: "50%", 
            background: displayStock > 0 ? (displayStock < 5 ? "#F59E0B" : "#10B981") : "#EF4444" 
          }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#666" }}>
            {displayStock > 0 
              ? (displayStock < 5 ? `Low Stock: Only ${displayStock} left` : "In Stock — Ready to Ship") 
              : "Sold Out"}
          </span>
        </div>
      </div>

      {/* Colors */}
      {uniqueColors.length > 0 && (
        <div className={s.variantsSection}>
          <div style={{ marginBottom: 12 }}>
            <span className={s.variantLabel}>
              Selected Color: <span style={{ color: "#000" }}>{selectedColor || "None"}</span>
            </span>
          </div>
          <div className={s.variantGrid}>
            {uniqueColors.map((color: string) => (
              <button
                key={color}
                onClick={() => onColorChange?.(color)}
                className={`${s.colorBtn} ${selectedColor === color ? s.activeBtn : ""}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variants / Sizes */}
      {uniqueSizes.length > 0 && (
        <div className={s.variantsSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className={s.variantLabel}>Select Size</span>
            <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#000", textDecoration: "underline", cursor: "pointer" }}>Size Guide</span>
          </div>
          <div className={s.variantGrid}>
            {uniqueSizes.map((size: string) => {
              const variantForThisSize = product.variants?.find((v: any) => v.size === size && (!selectedColor || v.color === selectedColor));
              const isOutOfStock = !variantForThisSize || variantForThisSize.stock === 0;

              return (
                <button
                  key={size}
                  disabled={isOutOfStock}
                  onClick={() => onSizeChange?.(size)}
                  className={`${s.sizeBtn} ${selectedSize === size ? s.activeBtn : ""} ${isOutOfStock ? s.disabledBtn : ""}`}
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
            disabled={quantity <= 1 || isLimitReachedForThisItem}
            onClick={() => setQuantity(Math.max(1, quantity - 1))} 
            className={s.qBtn}
          >
            —
          </button>
          <span className={s.qVal} style={{ opacity: isLimitReachedForThisItem ? 0.3 : 1 }}>{quantity}</span>
          <button 
            disabled={quantity >= maxAllowed || (selectedVariant ? selectedVariant.stock <= (currentItemQuantity + quantity) : product.stock <= quantity)} 
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
            className={s.qBtn}
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={s.mainActions}>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLimitReachedForThisItem}
          className={s.atcBtn}
        >
          {added ? "Item Added" : product.stock === 0 ? "Sold Out" : (uniqueSizes.length ? (selectedSize ? "Add to Cart" : "Select Size") : "Add to Cart")}
        </button>
        <button
          onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, images: product.images, slug: product.slug })}
          className={s.wishBtn}
          title={mounted ? (isWishlisted ? "Remove from List" : "Add to List") : "Add to List"}
        >
          {mounted ? (isWishlisted ? "●" : "○") : "○"}
        </button>
      </div>
    </div>
  );
}
