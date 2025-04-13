"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { addToast } from "@heroui/react";

const CopyToClipboard = ({
  text,
  iconSize = 16,
  className = "",
  textType = "Wallet",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });

    addToast({
      title: `${textType} address copied successfully`,
      color: "success",
    });
  };

  return (
    <div>
      {copied ? (
        <Check size={iconSize} className="text-green-500" />
      ) : (
        <Copy
          onClick={handleCopy}
          size={iconSize}
          className={`cursor-pointer ${className}`}
        />
      )}
    </div>
  );
};

export default CopyToClipboard;
