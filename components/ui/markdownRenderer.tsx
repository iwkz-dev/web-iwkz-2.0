'use client';

import { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

export function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  const html = useMemo(() => {
    return marked.parse(content, { async: false }) as string;
  }, [content]);

  return (
    <div
      className={`prose prose-sm prose-gray max-w-none text-gray-600 prose-headings:text-gray-800 prose-strong:text-gray-700 prose-a:text-emerald-600 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
