import React from "react";

import PodSelector from "./PodSelector";
import AdminViewBtn from "./AdminViewBtn";
import { getCachedSession } from "@/lib/userSession";

const AdminHeader = async () => {
  const { user, isAuthenticated } = await getCachedSession();

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!user.isAdmin) {
    return null;
  }

  return (
    <>
      <AdminViewBtn />
      <PodSelector assignedPods={user.pods} adminRoleType={user.role_type} />
    </>
  );
};

export default AdminHeader;
