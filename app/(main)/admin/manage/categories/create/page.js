import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import MainPageScroll from "@/components/common/MainPageScroll";

import AdminCategoryMain from "@/components/layout/category/admin/AdminCategoryPage";

const category = {
  id: 0,
  title: "Test Category",
  icon: "/dashboard/category/icon-1.png",
  description: "This is a description for the category.",
  background: "/dashboard/category/background-2.jpg",
};

const breadcrumbsList = [
  {
    title: "Admin Categories",
    href: "/admin/manage/categories",
  },

  {
    title: "Create Category",
    href: `/admin/manage/categories/create`,
  },
];

const CreateCategoryPage = () => {
  return (
    <MainPageScroll scrollable={false}>
      <NeoBreadcrumbs list={breadcrumbsList} />

      <AdminCategoryMain
        isNew={true}
        id={category.id}
        icon={category.icon}
        title={category.title}
        background={category.background}
        description={category.description}
      />
    </MainPageScroll>
  );
};

export default CreateCategoryPage;
