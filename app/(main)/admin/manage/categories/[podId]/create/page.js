import React from "react";
import { Undo2Icon } from "lucide-react";

import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";
import AdminCategoryMain from "@/components/layout/category/admin/AdminCategoryPage";

const CreateCategoryPage = async ({ params }) => {
  const { podId } = await params;

  const breadcrumbsList = [
    {
      title: "Manage",
    },

    {
      title: "Pods",
      href: "/admin/manage/pods",
    },

    {
      title: "Pod Categories",
      href: `/admin/manage/categories/${podId}`,
    },

    {
      title: "Create",
    },
  ];

  return (
    <ManagePageWrapper
      linkLabel="Back"
      scrollable={false}
      list={breadcrumbsList}
      href={`/admin/manage/categories/${podId}`}
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      <AdminCategoryMain isNew={true} podId={podId} />
    </ManagePageWrapper>
  );
};

export default CreateCategoryPage;
