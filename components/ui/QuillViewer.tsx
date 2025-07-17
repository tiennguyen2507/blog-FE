import React from "react";
import DOMPurify from "dompurify";

interface QuillViewerProps {
  html: string;
  className?: string;
}

export default function QuillViewer({ html, className }: QuillViewerProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
}
