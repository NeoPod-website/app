import React from "react";

import AdminCategoriesList from "@/components/layout/category/admin/AdminCategoriesList";

export const metadata = {
  title: "Manage Categories | Admin Panel | NEO POD",
  description:
    "Create and organize quest categories for better structure and discoverability. Categorize quests to align with different ambassador goals.",
};

const ManageCategoriesPage = () => {
  return <AdminCategoriesList />;
};

export default ManageCategoriesPage;
