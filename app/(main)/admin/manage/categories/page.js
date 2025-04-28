import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";

import AdminCategoriesList from "@/components/layout/category/admin/AdminCategoriesList";
import MainPageScroll from "@/components/common/MainPageScroll";
import Link from "next/link";
import { SendHorizonalIcon } from "lucide-react";

export const metadata = {
  title: "Manage Categories | Admin Panel | NEO POD",
  description:
    "Create and organize quest categories for better structure and discoverability. Categorize quests to align with different ambassador goals.",
};

const breadcrumbsList = [
  {
    title: "Admin",
    href: "/admin/manage/categories",
  },
  {
    title: "Admin Categories",
    href: "/admin/manage/categories",
  },
];

const ManageCategoriesPage = () => {
  return (
    <MainPageScroll scrollable={true}>
      <div className="flex items-start justify-between">
        <NeoBreadcrumbs list={breadcrumbsList} />

        <Link
          href="/admin/manage/categories/create"
          className="flex w-fit items-center gap-2 rounded-full border border-gray-100 bg-gradient-primary px-8 py-2.5"
        >
          Create Category <SendHorizonalIcon className="ml-2" />
        </Link>
      </div>

      <AdminCategoriesList />
    </MainPageScroll>
  );
};

export default ManageCategoriesPage;
