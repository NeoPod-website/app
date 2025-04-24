import React from "react";

import SidebarProfile from "./SidebarProfile";

import InitiateRole from "./roles/InitiateRole";
import OperatorRole from "./roles/OperatorRole";
import SentinelRole from "./roles/SentinelRole";
import ArchitechRole from "./roles/ArchitechRole";

import { getCachedSession } from "@/lib/userSession";

const SidebarProfileContainer = async () => {
  const { user, error, isAuthenticated } = await getCachedSession();

  if (!isAuthenticated) {
    return (
      <section className="space-y-1 rounded-lg border-t border-gray-400 bg-gradient-dark">
        Soon Added
      </section>
    );
  }

  let RoleComponent;

  if (user.isAdmin) {
    RoleComponent = <SidebarProfile user={user} />;
  } else {
    switch (user.role_type) {
      case "initiate":
        RoleComponent = <InitiateRole user={user} />;
        break;
      case "operator":
        RoleComponent = <OperatorRole user={user} />;
        break;
      case "sentinel":
        RoleComponent = <SentinelRole user={user} />;
        break;
      case "architect":
        RoleComponent = <ArchitechRole user={user} />;
        break;
      // default:
      //   RoleComponent = <SidebarProfile user={user} />;
      //   break;
    }
  }

  return (
    <section className="space-y-1 rounded-lg border-t border-gray-400 bg-gradient-dark">
      {RoleComponent}
    </section>
  );
};

export default SidebarProfileContainer;
