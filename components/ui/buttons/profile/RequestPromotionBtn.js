"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, addToast } from "@heroui/react";

const RequestPromotionBtn = ({ nextRole }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handlePromotionRequest = async () => {
    if (!nextRole) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/request-promotion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ requested_role: nextRole }),
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        addToast({
          title: "Promotion Successful!",
          description: data.message,
          color: "success",
        });

        router.refresh();
      } else {
        addToast({
          title: "Promotion Failed",
          description: data.message,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Request Failed",
        description: "Unable to process promotion request. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      isLoading={isLoading}
      onPress={handlePromotionRequest}
      className="w-full rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-white transition-colors"
    >
      {isLoading ? "Processing..." : "Request Promotion"}
    </Button>
  );
};

export default RequestPromotionBtn;
