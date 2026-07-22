import "./globals.css";
import Providers from "./providers";
import StorefrontLayout from "@/components/layout/StorefrontLayout";
import ScrollToTop from "@/components/common/ScrollToTop";
import { GlobalSeo, Seo, Blog, ensureDB } from "@/lib/models";
import { headers } from "next/headers";
import parse from "html-react-parser";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

function formatDynamicMetadata(path: string, businessName = "Aion Luxury") {
  if (!path || path === "/" || path === "/index") {
    return {
      title: `${businessName} — Premium Online Store`,
      description:
        "Discover thousands of premium products at unbeatable prices. Fast shipping, easy returns, and exceptional quality.",
    };
  }

  const cleanPath = path.replace(/^\/+|\/+$/g, "").split("?")[0];
  const segments = cleanPath.split("/");
  const lastSegment = segments[segments.length - 1];

  let formattedTitle = lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} | ${businessName}`,
    description: `Explore our premium ${formattedTitle} collection at ${businessName}. Discover high-end products at unbeatable prices.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  let pathname = headersList.get("x-pathname") || "/";

  if (!pathname || pathname === "" || pathname === "index") {
    pathname = "/";
  }

  await ensureDB();

  // 1. Fetch Global SEO
  let globalSeo: any = null;
  try {
    globalSeo = await GlobalSeo.findOne({ where: { id: 1 }, raw: true });
  } catch (e) {
    console.error("Failed to fetch global seo", e);
  }

  const businessName = globalSeo?.businessName || "Aion Luxury";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // 2. Fetch Page SEO
  let pageSeo: any = null;
  const cleanTargetPath = pathname.replace(/^\/+|\/+$/g, "").split("?")[0] || "/";
  
  try {
    const allPageSeos = await Seo.findAll({ raw: true });
    pageSeo = allPageSeos.find((item: any) => {
      let cleanItemPath = (item.pagePath || "").replace(/^\/+|\/+$/g, "").split("?")[0];
      if (!cleanItemPath) cleanItemPath = "/";
      return cleanItemPath === cleanTargetPath;
    }) || null;
  } catch (e) {
    console.error("Failed to fetch page seo", e);
  }

  // 3. Fetch Blog SEO fallback
  let blogSeo: any = null;
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  if (!pageSeo && lastSegment) {
    try {
      blogSeo = await Blog.findOne({
        where: { slug: lastSegment },
        raw: true,
      });
    } catch (e) {
      // safe fallback
    }
  }

  // 4. Resolve Dynamic SEO
  const dynamicSeo = formatDynamicMetadata(pathname, businessName);

  // 5. Finalize Priority Variables
  const finalTitle =
    pageSeo?.seoTitle ||
    blogSeo?.metaTitle ||
    blogSeo?.title ||
    dynamicSeo.title;

  const finalDesc =
    pageSeo?.metaDescription ||
    blogSeo?.metaDescription ||
    dynamicSeo.description;

  const finalKeywords =
    pageSeo?.keywords ||
    blogSeo?.keywords ||
    "ecommerce, online shopping, premium products, deals";

  const finalCanonical =
    pageSeo?.canonicalUrl ||
    `${appUrl}${pathname}`;

  const robotsValue =
    pageSeo?.metaRobots ||
    "index, follow";

  let ogImage =
    pageSeo?.ogImageUrl ||
    blogSeo?.image ||
    `${appUrl}/aion-fav-new.png`;

  // Global Tracking and Schemas
  const headerScripts = globalSeo?.headerScripts || "";
  const footerScripts = globalSeo?.footerScripts || "";
  const globalSchema = globalSeo?.customGlobalSchema || "";
  const gaId = globalSeo?.googleAnalyticsId || "";
  const gtmId = globalSeo?.googleTagManagerId || "";
  const pageSchema = pageSeo?.customSchema || "";

  return (
    <html lang="en">
      <head>
        {/* BASIC SEO */}
        <title>{finalTitle}</title>
        <meta name="description" content={finalDesc} />
        <meta name="keywords" content={finalKeywords} />
        <meta name="robots" content={robotsValue} />
        <meta
          name="googlebot"
          content={`${robotsValue}, max-video-preview:-1, max-image-preview:large, max-snippet:-1`}
        />
        <link rel="canonical" href={finalCanonical} />

        {/* OPEN GRAPH */}
        <meta property="og:title" content={pageSeo?.ogTitle || finalTitle} />
        <meta property="og:description" content={pageSeo?.ogDescription || finalDesc} />
        <meta property="og:url" content={finalCanonical} />
        <meta property="og:site_name" content={businessName} />
        <meta
          property="og:type"
          content={pathname.includes("/blogs/") ? "article" : "website"}
        />
        {ogImage && <meta property="og:image" content={ogImage} />}

        {/* TWITTER */}
        <meta name="twitter:card" content={pageSeo?.twitterCard || "summary_large_image"} />
        <meta name="twitter:title" content={pageSeo?.ogTitle || finalTitle} />
        <meta name="twitter:description" content={pageSeo?.ogDescription || finalDesc} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        {/* FAVICON */}
        <link rel="icon" href="/aion-fav-new.png" />
        <link rel="apple-touch-icon" href="/aion-fav-new.png" />

        {/* SCRIPTS AND SCHEMAS */}
        {headerScripts && parse(headerScripts)}
        {globalSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: globalSchema }}
          />
        )}
        {pageSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: pageSchema }}
          />
        )}
        <OrganizationJsonLd />
        
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
      </head>

      <body suppressHydrationWarning>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        <ScrollToTop />
        <Providers>
          <StorefrontLayout>{children}</StorefrontLayout>
        </Providers>
        {footerScripts && parse(footerScripts)}
      </body>
    </html>
  );
}
