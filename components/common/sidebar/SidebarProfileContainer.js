// import React from "react";

// import SidebarProfile from "./SidebarProfile";
// import SafeAmbassadorRole from "./roles/AmbassadorRoles";
// import SidebarProfileSkeleton from "./loader/SidebarProfileSkeleton";

// import { getCachedSession } from "@/lib/userSession";

// const SidebarProfileContainer = async () => {
//   const { user, error, isAuthenticated } = await getCachedSession();

//   // Render placeholder for unauthenticated users
//   if (!isAuthenticated) {
//     return <UnauthenticatedSidebar error={error} />;
//   }

//   // Determine which role component to render
//   return (
//     <section className="space-y-1 rounded-lg border-t border-gray-400 bg-gradient-dark">
//       {getRoleComponent(user)}
//     </section>
//   );
// };

// /**
//  * Returns the appropriate role component based on user data
//  * @param {Object} user - The user object
//  * @returns {JSX.Element} The role-specific component
//  */

// function getRoleComponent(user) {
//   // Admin users always get the main sidebar profile
//   if (user.isAdmin) {
//     return <SidebarProfile user={user} />;
//   }

//   // Get the appropriate component or fallback to default
//   const RoleComponent = SafeAmbassadorRole || SidebarProfile;
//   return <RoleComponent user={user} />;
// }

// /**
//  * Renders a placeholder for unauthenticated users
//  * @returns {JSX.Element} The unauthenticated sidebar component
//  */

// function UnauthenticatedSidebar() {
//   return <SidebarProfileSkeleton />;
// }

// export default SidebarProfileContainer;

import React from "react";
import { cookies } from "next/headers";

import SidebarProfile from "./SidebarProfile";
import SafeAmbassadorRole from "./roles/AmbassadorRoles";
import SidebarProfileSkeleton from "./loader/SidebarProfileSkeleton";

// Fetch fresh user data for sidebar
const fetchUserData = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/profile/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const { data } = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user data for sidebar:", error);
    return null;
  }
};

// Fetch user stats for sidebar
const fetchUserStats = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/my/stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const { data } = await response.json();
    return data.stats;
  } catch (error) {
    console.error("Error fetching stats for sidebar:", error);
    return null;
  }
};

const SidebarProfileContainer = async () => {
  // Fetch fresh user data instead of using cache
  const user = await fetchUserData();

  // Render placeholder for unauthenticated users
  if (!user) {
    return <UnauthenticatedSidebar />;
  }

  // Fetch stats only for ambassadors (not admins)
  const stats = user.is_admin ? null : await fetchUserStats();

  // Determine which role component to render
  return (
    <section className="space-y-1 rounded-lg border-t border-gray-400 bg-gradient-dark">
      {getRoleComponent(user, stats)}
    </section>
  );
};

/**
 * Returns the appropriate role component based on user data
 * @param {Object} user - The user object
 * @param {Object} stats - The user stats object
 * @returns {JSX.Element} The role-specific component
 */
function getRoleComponent(user, stats) {
  // Admin users always get the main sidebar profile
  if (user.is_admin) {
    return <SidebarProfile user={user} />;
  }

  // Ambassador users get role-specific components with stats
  const RoleComponent = SafeAmbassadorRole || SidebarProfile;
  return <RoleComponent user={user} stats={stats} />;
}

/**
 * Renders a placeholder for unauthenticated users
 * @returns {JSX.Element} The unauthenticated sidebar component
 */
function UnauthenticatedSidebar() {
  return <SidebarProfileSkeleton />;
}

export default SidebarProfileContainer;
