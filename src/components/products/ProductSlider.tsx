"use client";
import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

interface ProductSliderProps {
  products: any[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }

    // Auto-play every 5 seconds - One by one scroll
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const firstItem = scrollRef.current.querySelector(".slider-item");
        if (firstItem) {
          const itemWidth = (firstItem as HTMLElement).offsetWidth + 24; // Including gap
          if (scrollLeft >= scrollWidth - clientWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
          }
        }
      }
    }, 5000);

    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearInterval(interval);
    };
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstItem = scrollRef.current.querySelector(".slider-item");
      if (firstItem) {
        const itemWidth = (firstItem as HTMLElement).offsetWidth + 24; // Including gap
        const scrollAmount = direction === "left" ? -itemWidth : itemWidth;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation Buttons */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          style={{ ...styles.navBtn, left: "-24px" }}
          className="nav-btn-slider"
          aria-label="Previous products"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          style={{ ...styles.navBtn, right: "-24px" }}
          className="nav-btn-slider"
          aria-label="Next products"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Slider Content */}
      <div
        ref={scrollRef}
        style={styles.slider}
        className="hide-scrollbar"
      >
        {products.map((product) => (
          <div key={product.id} style={styles.item} className="slider-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 1024px) {
          .slider-item {
            flex: 0 0 calc(50% - 12px) !important;
          }
        }
        @media (max-width: 768px) {
          .nav-btn-slider {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .slider-item {
            flex: 0 0 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",
    width: "100%",
  },
  slider: {
    display: "flex",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    padding: "10px 4px",
    gap: "24px",
    scrollBehavior: "smooth",
  },
  item: {
    flex: "0 0 calc(33.333% - 16px)",
    scrollSnapAlign: "start",
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "#fff",
    color: "#000",
    border: "1px solid #eee",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
};
