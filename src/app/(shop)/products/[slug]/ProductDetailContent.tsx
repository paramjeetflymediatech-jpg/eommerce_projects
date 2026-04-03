"use client";
import { useState, useMemo } from "react";
import ProductGallery from "./ProductGallery";
import AddToCartSection from "./AddToCartSection";
import s from "./product-detail.module.css";

interface Variant {
  id: number;
  size: string;
  color?: string | null;
  price?: number | null;
  stock: number;
  images?: string[] | null;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  slug: string;
  stock: number;
  description: string;
  shortDescription?: string;
  category?: { name: string };
  variants?: Variant[];
}

export default function ProductDetailContent({ product }: { product: Product }) {
  // Extract unique colors to set initial state
  const uniqueColors = useMemo(() => 
    Array.from(new Set(product.variants?.map(v => v.color).filter(Boolean))) as string[]
  , [product.variants]);

  const [selectedColor, setSelectedColor] = useState<string | null>(uniqueColors[0] || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Determine which images to show in the gallery
  const displayImages = useMemo(() => {
    if (!selectedColor || !product.variants) return product.images;
    
    // Find images for the selected color
    // We look for any variant that matches this color and has images defined
    const colorVariant = product.variants.find(v => v.color === selectedColor && v.images && v.images.length > 0);
    
    if (colorVariant && colorVariant.images) {
      return colorVariant.images;
    }
    
    return product.images;
  }, [product.images, product.variants, selectedColor]);

  return (
    <div className={s.mainGrid}>
      {/* Left: Imagery */}
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

          <div className={s.descriptionArea}>
            <p className={s.shortDesc}>{product.shortDescription || "A testament to minimalist architectural design."}</p>
          </div>

          <div className={s.actionArea}>
            <AddToCartSection 
              product={product} 
              externalSelectedColor={selectedColor}
              onColorChange={setSelectedColor}
              externalSelectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />
          </div>

          <div className={s.accordion}>
            <details className={s.details} open>
              <summary className={s.summary}>Product Description</summary>
              <div className={s.fullDesc} dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br/>") }} />
            </details>
            <details className={s.details}>
              <summary className={s.summary}>Shipping & Authentication</summary>
              <p className={s.detailsContent}>This piece is subject to professional handling and white-glove delivery within 14-21 days of purchase. Each architectural component is authenticated by ShopNest.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}


