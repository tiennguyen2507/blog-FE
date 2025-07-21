import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard Blog",
  description: "1 page created by Nguyen Le Dinh Tien (Tiennld2)",
  keywords: [
    "Nguyen Le Dinh Tien",
    "tiennguyen2507",
    "tiennld2",
    "Nguyễn Lê Đình Tiên",
    "Blog Admin",
  ],
  authors: [{ name: "Nguyen Le Dinh Tien" }],
  creator: "Nguyen Le Dinh Tien",
  publisher: "Nguyen Le Dinh Tien",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://blog-fe-nld.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blog-fe-nld.vercel.app",
    title: "Admin Dashboard Blog",
    description: "1 page created by Nguyen Le Dinh Tien (Tiennld2)",
    siteName: "Admin Dashboard Blog",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Modern Dashboard Template Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Dashboard Template - Next.js 14 & shadcn/ui",
    description:
      "A beautiful, responsive dashboard template built with Next.js 14, shadcn/ui, and Tailwind CSS.",
    images: ["/og-image.webp"],
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
  category: "technology",
  classification: "Dashboard Template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="blog-fe-nld.vercel.app" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
