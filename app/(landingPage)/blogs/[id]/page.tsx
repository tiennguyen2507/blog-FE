import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import httpRequest from "@/lib/httpRequest";
import ClientHtmlViewer from "@/components/ui/ClientHtmlViewer";

interface Post {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const post = await httpRequest.get(`/posts/${id}`);

    if (!post.data) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const { title, description, thumbnail, createdBy, createdAt } = post.data;
    const authorName = createdBy
      ? `${createdBy.firstName || ""} ${createdBy.lastName || ""}`.trim() ||
        "Anonymous"
      : "Anonymous";

    const publishedDate = new Date(createdAt).toISOString();
    const imageUrl = thumbnail || "/og-image.webp"; // Fallback image

    return {
      title: `${title} | Your Blog`,
      description: description.replace(/<[^>]*>/g, "").substring(0, 160), // Strip HTML tags and limit to 160 chars
      keywords: ["blog", "article", "post", title.toLowerCase()],
      authors: [{ name: authorName }],
      creator: authorName,
      publisher: "Your Company",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL("https://yourdomain.com"), // Replace with your actual domain
      alternates: {
        canonical: `/blogs/${id}`,
      },
      openGraph: {
        title: title,
        description: description.replace(/<[^>]*>/g, "").substring(0, 160),
        url: `/blogs/${id}`,
        siteName: "Your Blog",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "en_US",
        type: "article",
        publishedTime: publishedDate,
        authors: [authorName],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description.replace(/<[^>]*>/g, "").substring(0, 160),
        images: [imageUrl],
        creator: "@yourtwitter", // Replace with your Twitter handle
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
}

// Generate structured data for rich snippets
function generateStructuredData(post: Post) {
  const authorName = post.createdBy
    ? `${post.createdBy.firstName || ""} ${
        post.createdBy.lastName || ""
      }`.trim() || "Anonymous"
    : "Anonymous";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description.replace(/<[^>]*>/g, "").substring(0, 160),
    image: post.thumbnail || "/og-image.webp",
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Your Company",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png", // Replace with your logo URL
      },
    },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/blogs/${post._id}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let post: Post;

  try {
    const { id } = await params;
    const response = await httpRequest.get(`/posts/${id}`);
    post = response.data;

    if (!post) {
      notFound();
    }
  } catch {
    notFound();
  }

  const structuredData = generateStructuredData(post);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation for SEO */}
        <Breadcrumb
          items={[
            { label: "Blogs", href: "/blogs" },
            { label: post.title, current: true },
          ]}
          className="mb-6"
        />

        <article className="bg-white overflow-hidden border-none">
          {/* Content */}
          <div>
            {/* Header */}
            <header>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Article Meta Information */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500 mb-6">
                <time
                  dateTime={post.createdAt}
                  className="flex items-center gap-2"
                >
                  <span>Published on:</span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>

                {post.createdBy && (
                  <div className="flex items-center gap-2">
                    <span>By:</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        {post.createdBy.avatar ? (
                          <AvatarImage
                            src={post.createdBy.avatar}
                            alt={`${post.createdBy.firstName} ${post.createdBy.lastName}`}
                          />
                        ) : (
                          <AvatarFallback>
                            <User className="w-4 h-4 text-gray-400" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium text-gray-700">
                        {`${post.createdBy.firstName || ""} ${
                          post.createdBy.lastName || ""
                        }`.trim() || "Anonymous"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {post.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.thumbnail && (
              <figure className="mb-6">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                  priority={false}
                />
                <figcaption className="text-sm text-gray-500 mt-2 text-center">
                  Featured image for: {post.title}
                </figcaption>
              </figure>
            )}

            {/* Article Content */}
            <section className="prose prose-lg max-w-none">
              <ClientHtmlViewer
                html={post.description}
                className="text-gray-700 leading-relaxed"
              />
            </section>

            {/* Article Footer */}
            <footer className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
                <div>
                  <span>Last updated: </span>
                  <time dateTime={post.updatedAt}>
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <Link href="/blogs">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to All Posts
                  </Button>
                </Link>
              </div>
            </footer>
          </div>
        </article>

        {/* Related Posts Section (Optional) */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Posts
          </h2>
          <div className="text-center text-gray-500">
            <p>Related posts functionality can be added here</p>
          </div>
        </section>
      </div>
    </>
  );
}
