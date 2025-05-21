import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import MainPageScroll from "@/components/common/MainPageScroll";

import AdminCategoryMain from "@/components/layout/category/admin/AdminCategoryPage";

const category = {
  id: 4,
  title: "Hot Campaigns Test",
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
    title: category.title,
    href: `/admin/manage/categories/${category.id}`,
  },
];

const AdminCategoryPage = async ({ params }) => {
  const { categoryId } = await params;

  return (
    <MainPageScroll scrollable={false}>
      <NeoBreadcrumbs list={breadcrumbsList} />

      <AdminCategoryMain
        id={categoryId}
        icon={category.icon}
        title={category.title}
        background={category.background}
        description={category.description}
      />
    </MainPageScroll>
  );
};

export default AdminCategoryPage;
