/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/", "/(admin)/", "/(account)/"] },
    ],
  },
  exclude: ["/api/*", "/admin/*", "/account/*"],
  additionalPaths: async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/sitemap`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((path) => ({
        loc: path,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }));
    } catch (err) {
      console.warn("⚠️ [next-sitemap]: Could not fetch dynamic paths from API. Sitemap may be incomplete.");
      return [];
    }
  },
};
