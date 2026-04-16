"use client";
import { useState, useMemo } from "react";
import ProductGallery from "./ProductGallery";
import AddToCartSection from "./AddToCartSection";
import { getColorFromName } from "@/lib/colors";
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
  description: string;
  shortDescription?: string;
  category?: { name: string };
  variants?: Variant[];
}

export default function ProductDetailContent({ product }: { product: Product }) {
  // Build unique color list (preserving order)
  const uniqueColors = useMemo(() =>
    Array.from(new Set(
      (product.variants ?? [])
        .map(v => v.color)
        .filter((c): c is string => Boolean(c))
    ))
  , [product.variants]);

  // Auto-select first color if colors exist
  const [selectedColor, setSelectedColor] = useState<string | null>(
    uniqueColors[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // When color changes, reset size
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  // Sizes available for the selected color (or all sizes if no color)
  const sizesForActiveColor = useMemo(() => {
    if (!product.variants?.length) return [];
    const rows = selectedColor
      ? product.variants.filter(v => v.color === selectedColor)
      : product.variants;
    return Array.from(new Set(rows.map(v => v.size))) as string[];
  }, [product.variants, selectedColor]);

  // Gallery images: colour-specific images take priority over product images
  const displayImages = useMemo(() => {
    if (!selectedColor || !product.variants?.length) return product.images;

    // Collect all images from all variants of the active color
    const colorImages: string[] = [];
    for (const v of product.variants) {
      if (v.color === selectedColor && Array.isArray(v.images)) {
        for (const img of v.images) {
          if (img && !colorImages.includes(img)) colorImages.push(img);
        }
      }
    }

    return colorImages.length > 0 ? colorImages : product.images;
  }, [product.images, product.variants, selectedColor]);


  return (
    <div className={s.mainGrid}>
      {/* Left: Gallery — switches images on color change */}
      <ProductGallery images={displayImages} productName={product.name} />

      {/* Right: Details */}
      <div className={s.detailsColumn}>
        <div className={s.stickyDetails}>
          <header className={s.header}>
            {product.category && (
              <span className={s.categoryLabel}>{product.category.name}</span>
            )}
            <h1 className={s.title}>{product.name}</h1>
          </header>

          {/* Color Selector (visual swatches) */}
          {uniqueColors.length > 0 && (
            <div className={s.variantsSection} style={{ marginBottom: 4 }}>
              <div style={{ marginBottom: 10 }}>
                <span className={s.variantLabel}>
                  Color:{" "}
                  <span style={{ color: "#000", fontWeight: 700 }}>
                    {selectedColor ?? "—"}
                  </span>
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {uniqueColors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    title={color}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "6px 14px 6px 8px",
                      border: selectedColor === color
                        ? "2px solid #000"
                        : "1px solid #ddd",
                      background: "#fff",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      letterSpacing: "normal",
                      transition: "border 0.15s",
                    }}
                  >
                    <span style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: getColorFromName(color),
                      border: "1px solid rgba(0,0,0,0.15)",
                      flexShrink: 0,
                      display: "inline-block",
                    }} />
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={s.actionArea}>
            <AddToCartSection
              product={product}
              externalSelectedColor={selectedColor}
              onColorChange={handleColorChange}
              externalSelectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              /* Pass only sizes for current color so the section renders them correctly */
              filteredSizes={sizesForActiveColor}
            />
          </div>

          <div className={s.accordion}>
            <details className={s.details} open>
              <summary className={s.summary}>Product Description</summary>
              <div
                className={s.fullDesc}
                dangerouslySetInnerHTML={{
                  __html: product.description.replace(/\n/g, "<br/>"),
                }}
              />
            </details>
            <details className={s.details}>
              <summary className={s.summary}>Shipping &amp; Authentication</summary>
              <p className={s.detailsContent}>
                This piece is subject to professional handling and white-glove delivery within
                14–21 days of purchase. Each piece is authenticated by Aion Luxury.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
