import React from "react";

import PodContainerWrapper from "@/components/layout/pods/PodContainerWrapper";
import AdminPodMain from "@/components/layout/pods/manage/AdminPodsMain";

const breadcrumbsList = [
  {
    title: "Admin PODS",
    href: "/admin/manage/pods",
  },

  {
    title: "Create POD",
    href: `/admin/manage/pods/create`,
  },
];

const CreatePodPage = () => {
  return (
    <PodContainerWrapper list={breadcrumbsList} scrollable={false}>
      <AdminPodMain isNew />
    </PodContainerWrapper>
  );
};

export default CreatePodPage;
