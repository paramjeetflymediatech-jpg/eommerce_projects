"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, Suspense } from "react";

import NotificationToast from "@/components/common/Toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force manual scroll restoration to always start from top on refresh
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <SessionProvider>
      <Suspense>
        <NotificationToast />
      </Suspense>
      {children}
    </SessionProvider>
  );
}
