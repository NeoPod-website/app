import React from "react";

import SidebarProfile from "./SidebarProfile";

import InitiateRole from "./roles/InitiateRole";
import OperatorRole from "./roles/OperatorRole";
import SentinelRole from "./roles/SentinelRole";
import ArchitechRole from "./roles/ArchitechRole";

const SidebarProfileContainer = ({ role, points = 50 }) => {
  return (
    <section className="space-y-1 rounded-lg border-t border-gray-400 bg-gradient-dark">
      {role === "initiate" ? (
        <InitiateRole />
      ) : role === "operator" ? (
        <OperatorRole />
      ) : role === "sentinel" ? (
        <SentinelRole />
      ) : role === "architect" ? (
        <ArchitechRole />
      ) : (
        <SidebarProfile />
      )}
    </section>
  );
};

export default SidebarProfileContainer;
