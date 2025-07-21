import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/settings/",
        "/dashboard/errors/",
        "/api/",
        "/_next/",
        "/admin/",
      ],
    },
    sitemap: "https://blog-fe-nld.vercel.app/sitemap.xml",
  };
}
