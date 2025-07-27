import { MetadataRoute } from "next";
import httpRequest from "@/lib/httpRequest";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yourdomain.com"; // Replace with your actual domain

  // Get all blog posts
  let posts: Array<{
    _id: string;
    updatedAt: string;
  }> = [];
  try {
    const response = await httpRequest.get("/posts", {
      params: { page: 1, limit: 1000 }, // Get all posts
    });
    posts = response.data?.data || [];
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  // Generate sitemap entries for blog posts
  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post._id}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  return [...staticPages, ...blogEntries];
}
