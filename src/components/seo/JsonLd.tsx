interface ProductJsonLdProps {
  product: {
    name: string;
    description: string;
    images: string[];
    price: number;
    slug: string;
    rating?: number;
    reviewCount?: number;
    stock?: number;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map((img) =>
      img.startsWith("http") ? img : `${appUrl}${img}`
    ),
    url: `${appUrl}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        (product.stock ?? 1) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${appUrl}/products/${product.slug}`,
    },
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd({ globalSeo }: { globalSeo?: any }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  let socialLinks: string[] = [];
  try {
    if (globalSeo?.socialProfileUrls) {
      socialLinks = JSON.parse(globalSeo.socialProfileUrls);
    }
  } catch (e) {}

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: globalSeo?.businessName || "Aion Luxury",
    url: appUrl,
    logo: globalSeo?.logoUrl || `${appUrl}/logo.png`,
    sameAs: socialLinks,
  };

  if (globalSeo?.phoneNumber || globalSeo?.emailAddress) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      telephone: globalSeo?.phoneNumber,
      email: globalSeo?.emailAddress,
      contactType: "customer service"
    };
  }

  if (globalSeo?.streetAddress || globalSeo?.city) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: globalSeo?.streetAddress,
      addressLocality: globalSeo?.city,
      addressRegion: globalSeo?.state,
      postalCode: globalSeo?.postalCode,
      addressCountry: globalSeo?.countryCode
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
