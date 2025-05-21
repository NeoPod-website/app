"use client";

import React, { useState } from "react";

import PodCard from "../PodCard";
import AdminEditPod from "./AdminEditPod";
import AdminCreatePod from "./AdminCreatePod";

import WrapperContainer from "@/components/common/WrapperContainer";

const AdminPodMain = ({ isNew = false, initialPod = {}, id = "" }) => {
  const {
    name = "",
    cover_photo,
    language = "en",
    status = "live",
    description = "",
    admin_usernames = [],
  } = initialPod;

  const [podData, setPodData] = useState({
    podName: name,
    status,
    language,
    coverPhoto: cover_photo,
    description,
    assignedAdmins: admin_usernames,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePodDataChange = (field, value) => {
    setPodData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      {isNew ? (
        <AdminCreatePod
          isNew={isNew}
          podData={podData}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          handlePodDataChange={handlePodDataChange}
        />
      ) : (
        <AdminEditPod
          id={id}
          isNew={isNew}
          podData={podData}
          initialPod={initialPod}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          handlePodDataChange={handlePodDataChange}
        />
      )}

      <WrapperContainer scrollable>
        <PodCard
          pod={{
            name: podData.podName,
            status: podData.status,
            language: podData.language,
            created_by: "Preview Admin",
            description: podData.description,
            admin_usernames: podData.assignedAdmins,
            cover_photo: podData.coverPhoto || cover_photo,
            original_cover_photo: initialPod.original_cover_photo,
            created_at: initialPod.created_at || new Date().toISOString(),
          }}
          isPreview={true}
        />
      </WrapperContainer>
    </section>
  );
};

export default AdminPodMain;
