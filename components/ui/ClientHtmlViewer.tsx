"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamic import for SafeHtmlViewer
const SafeHtmlViewer = dynamic(() => import("./SafeHtmlViewer"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-4 rounded"></div>,
});

interface ClientHtmlViewerProps {
  html: string;
  className?: string;
}

export default function ClientHtmlViewer({
  html,
  className,
}: ClientHtmlViewerProps) {
  return <SafeHtmlViewer html={html} className={className} />;
}
