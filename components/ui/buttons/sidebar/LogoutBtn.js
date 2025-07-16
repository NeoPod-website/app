"use client";

import React, { useState } from "react";
import { LogOutIcon } from "lucide-react";
import { addToast, Button } from "@heroui/react";

const LogoutBtn = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Step 1: Logout from your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        // Step 2: Clear client-side storage
        localStorage.removeItem("neo-jwt");
        sessionStorage.clear();

        // Step 3: Redirect to Auth0 logout (this will handle Auth0 session cleanup)
        window.location.href = "/auth/logout";

        addToast({
          color: "success",
          title: "Logging out...",
          description: "You are being logged out of all services.",
        });
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Clear client-side data anyway
      localStorage.clear();
      sessionStorage.clear();

      // Still redirect to Auth0 logout
      window.location.href = "/auth/logout";

      addToast({
        color: "warning",
        title: "Partial logout",
        description:
          "There was an issue with backend logout, but continuing with Auth0 logout.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      isIconOnly
      title="Logout"
      onPress={handleLogout}
      disabled={isLoggingOut}
      isLoading={isLoggingOut}
      className="h-5 w-5 min-w-0 bg-transparent p-0"
    >
      <LogOutIcon
        size={16}
        className="3xl:h-4 3xl:w-4 h-3 w-3 text-white hover:text-red-300"
      />
    </Button>
  );
};

export default LogoutBtn;
