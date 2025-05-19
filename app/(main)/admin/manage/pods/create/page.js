import React from "react";
import { Undo2Icon } from "lucide-react";

import AdminPodMain from "@/components/layout/pods/manage/AdminPodsMain";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

const breadcrumbsList = [
  {
    title: "Manage",
  },

  {
    title: "PODS",
    href: "/admin/manage/pods",
  },

  {
    title: "Create",
    href: "/admin/manage/pods/create",
  },
];

export const metadata = {
  title: "Create POD | Admin Panel | NEO POD",
  description:
    "Create a new POD for ambassadors and admins to manage and engage with them.",
};

const CreatePodPage = () => {
  return (
    <ManagePageWrapper
      linkLabel="Go Back"
      scrollable={false}
      list={breadcrumbsList}
      href="/admin/manage/pods"
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      <AdminPodMain isNew={true} />
    </ManagePageWrapper>
  );
};

export default CreatePodPage;
