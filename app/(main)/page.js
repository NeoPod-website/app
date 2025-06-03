import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/userSession";

const MainPage = async () => {
  const { user, error, isAuthenticated, message } = await getCachedSession();
  console.log(user, error, isAuthenticated, message);

  // Handle authentication errors
  if (error) {
    console.error(`Authentication error: ${error}`, message);

    // Redirect based on specific error types
    switch (error) {
      case "auth/no-token":
      case "auth/invalid-token":
      case "auth/expired-token":
        return redirect("/login?reason=session-expired");

      case "auth/server-error":
      case "auth/timeout":
      case "auth/network-error":
        return redirect(
          `/error?code=${error}&message=${encodeURIComponent(message || "")}`,
        );

      default:
        return redirect(
          `/error?code=${error}&message=${encodeURIComponent(message || "Authentication failed")}`,
        );
    }
  }

  // If not authenticated (and no specific error was caught above)
  if (!isAuthenticated || !user) {
    return redirect("/login?reason=authentication-required");
  }

  // If user is admin, redirect to admin dashboard
  if (user.isAdmin) {
    return redirect("/admin/dashboard");
  }

  // Default redirect for regular authenticated users
  return redirect("/quests");
};

export default MainPage;
