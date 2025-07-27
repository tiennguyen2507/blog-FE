import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-gray-700 transition-colors"
            aria-label="Go to homepage"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center min-w-0">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
            {item.current ? (
              <span
                className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                aria-current="page"
                title={item.label}
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-gray-700 transition-colors truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
