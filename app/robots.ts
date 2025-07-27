import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/admin/",
        "/private/",
        "/*.json$",
        "/*.xml$",
      ],
    },
    sitemap: "https://yourdomain.com/sitemap.xml", // Replace with your actual domain
  };
}
