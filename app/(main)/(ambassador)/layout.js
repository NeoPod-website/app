import React from "react";
import { redirect } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import InboxModal from "@/components/ui/modals/InboxModal";
import MainPageScroll from "@/components/common/MainPageScroll";

const AmbassadorsLayout = async ({ children }) => {
  const { user, error, isAuthenticated, message } = await getCachedSession();

  // Handle authentication errors
  if (error) {
    console.error(
      `Authentication error in AmbassadorsLayout: ${error}`,
      message,
    );

    // Redirect based on error type
    if (
      ["auth/no-token", "auth/invalid-token", "auth/expired-token"].includes(
        error,
      )
    ) {
      return redirect("/login?reason=session-expired");
    } else {
      return redirect(
        `/error?code=${error}&message=${encodeURIComponent(message || "")}`,
      );
    }
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return redirect("/login?reason=authentication-required");
  }

  // Redirect admins to admin dashboard
  if (user.isAdmin) {
    return redirect("/admin/dashboard");
  }

  // Render the layout for regular users
  return (
    <MainPageScroll scrollable={false}>
      <InboxModal /> {children}
    </MainPageScroll>
  );
};

export default AmbassadorsLayout;
