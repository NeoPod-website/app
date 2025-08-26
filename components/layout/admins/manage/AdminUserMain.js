"use client";

import React, { useState, useCallback, useMemo } from "react";

import AdminCard from "./AdminCard";
import AdminCreateUser from "./AdminCreateUser";

import WrapperContainer from "@/components/common/WrapperContainer";

// Default values for new admin creation
const DEFAULT_ADMIN_DATA = {
  email: "",
  username: "",
  assigned_pods: [],
  role_type: "community",
};

const AdminUserMain = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminData, setAdminData] = useState(DEFAULT_ADMIN_DATA);

  const handleAdminDataChange = useCallback((field, value) => {
    setAdminData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Simple preview admin object - only what we need for preview
  const previewAdmin = useMemo(
    () => ({
      username: adminData.username || "Enter username",
      email: adminData.email || "Enter email",
      role_type: adminData.role_type,
      status: "active",
      is_active: true,
      assigned_pods: adminData.assigned_pods || [],
      reviews_number: 0,
      isAdmin: true,
      profile_photo: null,
    }),
    [
      adminData.username,
      adminData.email,
      adminData.role_type,
      adminData.assigned_pods,
    ],
  );

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      <AdminCreateUser
        adminData={adminData}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        handleAdminDataChange={handleAdminDataChange}
      />

      <WrapperContainer scrollable>
        <AdminCard admin={previewAdmin} isPreview={true} />
      </WrapperContainer>
    </section>
  );
};

export default AdminUserMain;
