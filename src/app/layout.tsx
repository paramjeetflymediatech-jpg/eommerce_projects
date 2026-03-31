import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import StorefrontLayout from "@/components/layout/StorefrontLayout";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "ShopNest";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${appName} — Premium Online Store`,
    template: `%s | ${appName}`,
  },
  description:
    "Discover thousands of premium products at unbeatable prices. Fast shipping, easy returns, and exceptional quality.",
  keywords: ["ecommerce", "online shopping", "premium products", "deals"],
  authors: [{ name: appName }],
  creator: appName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: appName,
    title: `${appName} — Premium Online Store`,
    description: "Discover thousands of premium products at unbeatable prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} — Premium Online Store`,
    description: "Discover thousands of premium products at unbeatable prices.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <StorefrontLayout>{children}</StorefrontLayout>
        </Providers>
      </body>
    </html>
  );
}
