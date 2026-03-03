"use client";

import Markdown from "react-markdown";

interface ArticleContentProps {
  content: string;
  className?: string;
  headingClassName?: string;
  paragraphClassName?: string;
  strongClassName?: string;
  emClassName?: string;
  linkClassName?: string;
}

export default function ArticleContent({
  content,
  headingClassName = "",
  paragraphClassName = "",
  strongClassName = "",
  emClassName = "",
  linkClassName = "",
}: ArticleContentProps) {
  return (
    <Markdown
      components={{
        h2: ({ children }) => <h2 className={headingClassName}>{children}</h2>,
        p: ({ children }) => <p className={paragraphClassName}>{children}</p>,
        strong: ({ children }) => (
          <strong className={strongClassName}>{children}</strong>
        ),
        em: ({ children }) => <em className={emClassName}>{children}</em>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
