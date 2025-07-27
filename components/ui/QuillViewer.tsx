"use client";
import React from "react";
import DOMPurify from "dompurify";

interface QuillViewerProps {
  html: string;
  className?: string;
}

export default function QuillViewer({ html, className }: QuillViewerProps) {
  const sanitizedHtml = React.useMemo(() => {
    try {
      // Check if DOMPurify is available and has sanitize method
      if (typeof DOMPurify !== "undefined" && DOMPurify.sanitize) {
        return DOMPurify.sanitize(html);
      }
      // Fallback: basic HTML sanitization
      return html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
    } catch (error) {
      console.warn("DOMPurify sanitization failed:", error);
      // Fallback: basic HTML sanitization
      return html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
    }
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
