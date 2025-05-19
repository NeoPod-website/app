import React from "react";

import SidebarProfile from "./SidebarProfile";
import SafeAmbassadorRole from "./roles/AmbassadorRoles";
import SidebarProfileSkeleton from "./loader/SidebarProfileSkeleton";

import { getCachedSession } from "@/lib/userSession";

const SidebarProfileContainer = async () => {
  const { user, error, isAuthenticated } = await getCachedSession();

  // Render placeholder for unauthenticated users
  if (!isAuthenticated) {
    return <UnauthenticatedSidebar error={error} />;
  }

  // Determine which role component to render
  return (
    <section className="space-y-1 rounded-lg border-t border-gray-400 bg-gradient-dark">
      {getRoleComponent(user)}
    </section>
  );
};

/**
 * Returns the appropriate role component based on user data
 * @param {Object} user - The user object
 * @returns {JSX.Element} The role-specific component
 */

function getRoleComponent(user) {
  // Admin users always get the main sidebar profile
  if (user.isAdmin) {
    return <SidebarProfile user={user} />;
  }

  // Get the appropriate component or fallback to default
  const RoleComponent = SafeAmbassadorRole || SidebarProfile;
  return <RoleComponent user={user} />;
}

/**
 * Renders a placeholder for unauthenticated users
 * @returns {JSX.Element} The unauthenticated sidebar component
 */

function UnauthenticatedSidebar() {
  return <SidebarProfileSkeleton />;
}

export default SidebarProfileContainer;
