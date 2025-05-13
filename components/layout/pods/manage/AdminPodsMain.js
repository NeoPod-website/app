"use client";

import React, { useState } from "react";
import PodForm from "./PodForm";
import PodCard from "../PodCard";
import WrapperContainer from "@/components/common/WrapperContainer";

const AdminPodMain = ({ isNew = false, initialPod = {} }) => {
  const {
    name = "",
    status = "draft",
    language = "en",
    cover_photo = "",
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

  const handlePodDataChange = (field, value) => {
    setPodData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      <WrapperContainer scrollable className="space-y-10 p-10">
        <PodForm
          isNew={isNew}
          selectedAdmins={podData.assignedAdmins}
          handlePodDataChange={(admins) =>
            handlePodDataChange("assignedAdmins", admins)
          }
          podName={podData.podName}
          setPodName={(value) => handlePodDataChange("podName", value)}
          description={podData.description}
          setDescription={(value) => handlePodDataChange("description", value)}
          coverPhoto={podData.coverPhoto}
          setCoverPhoto={(value) => handlePodDataChange("coverPhoto", value)}
          language={podData.language}
          setLanguage={(value) => handlePodDataChange("language", value)}
          status={podData.status}
          setStatus={(value) => handlePodDataChange("status", value)}
          assignedAdmins={podData.assignedAdmins}
        />
      </WrapperContainer>

      <WrapperContainer scrollable>
        <PodCard
          pod={{
            name: podData.podName,
            description: podData.description,
            cover_photo: podData.coverPhoto,
            language: podData.language,
            status: podData.status,
            created_by: "Preview Admin",
            created_at: new Date().toISOString(),
            admin_usernames: podData.assignedAdmins, // Pass the assigned admins
          }}
          isPreview={true}
        />
      </WrapperContainer>
    </section>
  );
};

export default AdminPodMain;
