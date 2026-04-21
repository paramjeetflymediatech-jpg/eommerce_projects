"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top of the page when the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
