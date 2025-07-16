"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/react";
import { Copy, Check } from "lucide-react";

const CopyToClipboard = ({
  text,
  iconSize = 16,
  className = "",
  textType = "Wallet address",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });

    addToast({
      title: `${textType} copied successfully`,
      color: "success",
    });
  };

  return (
    <div>
      {copied ? (
        <Check
          size={iconSize}
          className="3xl:h-4 3xl:w-4 h-3 w-3 text-green-500"
        />
      ) : (
        <Copy
          onClick={handleCopy}
          size={iconSize}
          className={`3xl:h-4 3xl:w-4 h-3 w-3 cursor-pointer ${className}`}
        />
      )}
    </div>
  );
};

export default CopyToClipboard;
