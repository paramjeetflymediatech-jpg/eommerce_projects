"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import FallbackImage from "@/components/common/FallbackImage";

interface Category {
  id: string | number;
  name: string;
  image: string;
}

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
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
          const itemWidth = (firstItem as HTMLElement).offsetWidth + 16;
          // If at the end, scroll back to start, otherwise scroll by one item
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
  }, [categories]);
  
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstItem = scrollRef.current.querySelector(".slider-item");
      if (firstItem) {
        const itemWidth = (firstItem as HTMLElement).offsetWidth + 16;
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
          aria-label="Previous categories"
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
          aria-label="Next categories"
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
        {categories.map((cat) => (
          <div key={cat.id} style={styles.item} className="slider-item">
            <Link
              href={`/products?category=${cat.id}`}
              className="hover-zoom-container"
              style={styles.link}
            >
              <div style={styles.imageWrapper}>
                <Image
                  src={cat.image || `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIGZpbGw9IiNGNEY0RjQiLz48L3N2Zz4=`}
                  alt={cat.name}
                  fill
                  className="hover-zoom"
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div style={styles.overlay}>
                <div style={{ color: "#fff" }}>
                  <p className="text-tracked" style={styles.tagline}>Discovery</p>
                  <h3 style={styles.title}>{cat.name}</h3>
                </div>
              </div>
            </Link>
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
            flex: 0 0 calc(50% - 8px) !important;
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
    gap: "16px",
    scrollBehavior: "smooth",
  },
  item: {
    flex: "0 0 calc(33.333% - 10.66px)",
    scrollSnapAlign: "start",
  },
  link: {
    position: "relative",
    aspectRatio: "3 / 4",
    height: "auto",
    display: "block",
    overflow: "hidden",
    textDecoration: "none",
  },
  imageWrapper: {
    position: "absolute",
    inset: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
    display: "flex",
    alignItems: "flex-end",
    padding: "clamp(32px, 4vw, 60px)",
  },
  tagline: {
    fontSize: "0.6rem",
    fontWeight: 700,
    marginBottom: 8,
    opacity: 0.7,
    textTransform: "uppercase",
  },
  title: {
    fontSize: "1.8rem",
    letterSpacing: "normal",
    fontWeight: 500,
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
