"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, addToast } from "@heroui/react";

const RefreshTokenBtn = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to refresh profile");
      }

      router.refresh();

      addToast({
        title: "Success",
        description: "Profile refreshed successfully 🎉",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message || "Something went wrong",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      isDisabled={loading}
      onPress={handleRefresh}
      className="rounded-lg border border-gray-400 bg-gradient-dark !px-3 !py-2 text-sm font-medium text-white transition-colors hover:bg-opacity-80 disabled:opacity-50"
    >
      {loading ? "Refreshing..." : "Refresh"}
    </Button>
  );
};

export default RefreshTokenBtn;
