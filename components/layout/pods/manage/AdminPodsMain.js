"use client";

import React, { useState, useCallback, useMemo } from "react";

import PodCard from "../PodCard";
import AdminEditPod from "./AdminEditPod";
import AdminCreatePod from "./AdminCreatePod";

import WrapperContainer from "@/components/common/WrapperContainer";

// Default values extracted to prevent object recreation
const DEFAULT_POD_DATA = {
  name: "",
  language: "en",
  status: "live",
  description: "",
  admin_usernames: [],
  cover_photo: undefined,
};

const AdminPodMain = ({ role, isNew = false, initialPod = {}, id = "" }) => {
  // Memoize initial pod data to prevent unnecessary state updates
  const initialData = useMemo(() => {
    const {
      name = DEFAULT_POD_DATA.name,
      status = DEFAULT_POD_DATA.status,
      language = DEFAULT_POD_DATA.language,
      cover_photo = DEFAULT_POD_DATA.cover_photo,
      description = DEFAULT_POD_DATA.description,
      admin_usernames = DEFAULT_POD_DATA.admin_usernames,
    } = initialPod;

    return {
      podName: name,
      status,
      language,
      coverPhoto: cover_photo,
      description,
      assignedAdmins: admin_usernames,
    };
  }, [initialPod]);

  const [podData, setPodData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize the change handler to prevent function recreation
  const handlePodDataChange = useCallback((field, value) => {
    setPodData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Memoize the form component to prevent unnecessary re-renders
  const FormComponent = useMemo(() => {
    const commonProps = {
      isNew,
      podData,
      isSubmitting,
      setIsSubmitting,
      handlePodDataChange,
    };

    return isNew ? (
      <AdminCreatePod {...commonProps} role={role} />
    ) : (
      <AdminEditPod
        {...commonProps}
        id={id}
        role={role}
        initialPod={initialPod}
      />
    );
  }, [isNew, podData, isSubmitting, handlePodDataChange, id, initialPod]);

  // Memoize the preview pod object to prevent recreation
  const previewPod = useMemo(
    () => ({
      name: podData.podName,
      status: podData.status,
      language: podData.language,
      created_by: "Preview Admin",
      description: podData.description,
      admin_usernames: podData.assignedAdmins,
      cover_photo: podData.coverPhoto || initialPod.cover_photo,
      original_cover_photo: initialPod.original_cover_photo,
      created_at: initialPod.created_at || new Date().toISOString(),
    }),
    [
      podData.podName,
      podData.status,
      podData.language,
      podData.description,
      podData.assignedAdmins,
      podData.coverPhoto,
      initialPod.cover_photo,
      initialPod.original_cover_photo,
      initialPod.created_at,
    ],
  );

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      {FormComponent}

      <WrapperContainer scrollable>
        <PodCard pod={previewPod} isPreview={true} />
      </WrapperContainer>
    </section>
  );
};

export default AdminPodMain;
