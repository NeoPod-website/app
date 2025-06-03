"use client";

import React, { useEffect, useState } from "react";

const QuestDetailDescription = ({ description }) => {
  const [sanitizedDescription, setSanitizedDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import DOMPurify only on the client side
    const sanitizeContent = async () => {
      if (typeof window !== "undefined") {
        const DOMPurify = (await import("dompurify")).default;

        const sanitized = DOMPurify.sanitize(description, {
          ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "b",
            "em",
            "i",
            "u",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "ol",
            "li",
            "blockquote",
            "a",
            "img",
            "div",
            "span",
            "code",
            "pre",
          ],
          ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
          FORBID_TAGS: ["script", "object", "embed", "form", "input"],
          FORBID_ATTR: [
            "onerror",
            "onload",
            "onclick",
            "onmouseover",
            "onfocus",
            "onblur",
          ],
        });

        setSanitizedDescription(sanitized);
        setIsLoaded(true);
      }
    };

    sanitizeContent();
  }, [description]);

  // Show loading state while DOMPurify loads
  if (!isLoaded) {
    return (
      <div className="space-y-5">
        <h3 className="text-2xl font-bold">Description</h3>
        <div className="prose prose-invert max-w-none">
          <div className="animate-pulse">
            <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
            <div className="mb-2 h-4 w-4/5 rounded bg-gray-200"></div>
            <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h3 className="text-2xl font-bold">Description</h3>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </div>
  );
};

export default QuestDetailDescription;
