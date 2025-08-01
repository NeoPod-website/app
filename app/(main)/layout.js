import React from "react";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/authorizeUser";

import DashboardHeader from "@/components/common/header/DashboardHeader";
import DashboardSidebar from "@/components/common/sidebar/DashboardSidebar";

import { adminMenuItems, ambassadorMenuItems } from "@/data/sidebarMenuItem";

const MainLayout = async ({ children }) => {
  const { user, error, message, details } = await getServerSession();

  // Handle specific authentication errors
  if (error) {
    console.error(`Authentication error: ${error}`, details);

    // Handle different error types appropriately
    switch (error) {
      case "auth/no-token":
      case "auth/invalid-token":
        // Redirect to login for authentication issues
        return redirect("/login");

      case "auth/server-error":
      case "auth/timeout":
        // Show a maintenance or retry page for server issues
        return redirect(
          `/error?type=${error}&message=${encodeURIComponent(message)}`,
        );

      case "auth/network-error":
        // Show offline or connection error page
        return redirect("/offline");

      default:
        // Generic error handling for other cases
        return redirect(
          `/error?code=${error}&message=${encodeURIComponent(message)}`,
        );
    }
  }

  // No user when there should be one (this is a catch-all in case error wasn't set properly)
  if (!user) {
    return redirect("/login");
  }

  const menuItems = user.isAdmin ? adminMenuItems : ambassadorMenuItems;

  // Render the authenticated layout
  return (
    <div className="flex h-screen bg-[url('/hero-background.png')] bg-cover">
      <DashboardSidebar session={user} menuItems={menuItems} />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <DashboardHeader session={user} menuItems={menuItems} />

        {children}
      </main>
    </div>
  );
};

export default MainLayout;
