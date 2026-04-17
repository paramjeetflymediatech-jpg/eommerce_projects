"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import FallbackImage from "@/components/common/FallbackImage";
import s from "./product-detail.module.css";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset index when images list changes (e.g. color swap)
  useEffect(() => {
    setActiveImageIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [images]);

  const scrollToImage = (index: number) => {
    const el = document.getElementById(`prod-img-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      setActiveImageIndex(index);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImageIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveImageIndex(newIndex);
    }
  };

  const nextImage = useCallback(() => {
    const newIndex = (activeImageIndex + 1) % images.length;
    scrollToImage(newIndex);
  }, [activeImageIndex, images.length]);

  const prevImage = useCallback(() => {
    const newIndex = (activeImageIndex - 1 + images.length) % images.length;
    scrollToImage(newIndex);
  }, [activeImageIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage]);

  return (
    <div className={s.imageColumn}>
      {/* Main Gallery Area */}
      <div style={{ position: "relative", width: "100%", borderRadius: "12px", overflow: "hidden" }} className="gallery-main-container">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className={`${s.galleryWrapper} product-gallery-scroll`}
        >
          {images.length > 0 ? (
            images.map((img: string, i: number) => (
              <div 
                key={img + i} 
                id={`prod-img-${i}`} 
                className={s.galleryItem}
                onClick={() => setIsLightboxOpen(true)}
              >
                <FallbackImage 
                  src={img} 
                  alt={`${productName} view ${i + 1}`} 
                  fill 
                  unoptimized={true}
                  style={{ objectFit: "contain" }} 
                  sizes="(max-width: 1000px) 100vw, 60vw" 
                  priority={i === 0}
                />
              </div>
            ))
          ) : (
            <div className={s.galleryItem}>
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: "0.8rem", letterSpacing: "0.1em" }}>PIECE PREVIEW UNAVAILABLE</div>
            </div>
          )}
        </div>

        {/* Premium Navigation Arrows (Glassmorphism) */}
        {images.length > 1 && (
          <div className="gallery-nav-overlay">
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className={`${s.navButton} glass-nav-btn`}
              style={{ left: 16 }}
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className={`${s.navButton} glass-nav-btn`}
              style={{ right: 16 }}
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}

        {/* Pagination Dots (Flipkart Style) */}
        {images.length > 1 && (
          <div className={s.paginationDots}>
            {images.map((_, i) => (
              <div 
                key={i} 
                className={s.dot}
                style={{
                  width: activeImageIndex === i ? 24 : 6,
                  background: activeImageIndex === i ? "#000" : "rgba(0,0,0,0.2)",
                  opacity: activeImageIndex === i ? 1 : 0.5
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className={s.thumbnailGrid}>
          {images.map((img: string, i: number) => (
            <div 
              key={img + i} 
              className={`${s.thumb} ${activeImageIndex === i ? s.thumbActive : ""}`}
              style={{
                opacity: activeImageIndex === i ? 1 : 0.5
              }}
              onClick={() => scrollToImage(i)}
            >
              <FallbackImage src={img} alt={`${productName} thumbnail ${i}`} fill unoptimized={true} style={{ objectFit: "cover" }} sizes="100px" />
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className={s.lightboxOverlay} onClick={() => setIsLightboxOpen(false)}>
          <button 
            className={s.closeButton}
            onClick={() => setIsLightboxOpen(false)}
          >
            ✕
          </button>
          <div className={s.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div className={s.lightboxImageWrapper}>
              <FallbackImage 
                src={images[activeImageIndex]} 
                alt={`${productName} fullscreen`}
                fill
                unoptimized={true}
                style={{ objectFit: "contain" }}
                sizes="100vw"
              />
            </div>
            {images.length > 1 && (
              <>
                <button className={s.lightboxNav} style={{ left: 40 }} onClick={prevImage}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button className={s.lightboxNav} style={{ right: 40 }} onClick={nextImage}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <div className={s.lightboxCounter}>
                  {activeImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
