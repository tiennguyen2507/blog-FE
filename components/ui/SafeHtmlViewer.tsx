"use client";
import React from "react";

interface SafeHtmlViewerProps {
  html: string;
  className?: string;
}

export default function SafeHtmlViewer({
  html,
  className,
}: SafeHtmlViewerProps) {
  const sanitizedHtml = React.useMemo(() => {
    try {
      // Basic HTML sanitization for security
      let sanitized = html;

      // Remove script tags and their content
      sanitized = sanitized.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );

      // Remove event handlers
      sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

      // Remove javascript: URLs
      sanitized = sanitized.replace(/javascript:/gi, "");

      // Remove data: URLs (except for images)
      sanitized = sanitized.replace(/data:(?!image\/)/gi, "");

      return sanitized;
    } catch (error) {
      console.warn("HTML sanitization failed:", error);
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
