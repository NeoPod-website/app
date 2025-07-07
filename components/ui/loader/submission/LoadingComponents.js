"use client";

import { Spinner } from "@heroui/react";

export const LoadingSpinner = ({ size = "md", color = "primary" }) => (
  <div className="flex items-center justify-center p-4">
    <Spinner size={size} color={color} />
  </div>
);
