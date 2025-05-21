import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import MainPageScroll from "@/components/common/MainPageScroll";
import FilterHeader from "@/components/common/filter/FilterHeader";
import AdminCategoriesList from "@/components/layout/category/admin/AdminCategoriesList";

const breadcrumbsList = [
  {
    title: "Manage",
  },

  {
    title: "Pods",
    href: "/admin/manage/pods",
  },

  {
    title: "Categories",
    href: `/admin/manage/categories`,
  },
];

export const metadata = {
  title: "Manage POD Categories | Admin Panel | NEO POD",
  description:
    "Create and organize quest categories for better structure and discoverability. Categorize quests to align with different ambassador goals.",
};

async function fetchCategories(podId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/categories/pod/${podId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }

      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);

    throw error;
  }
}

const ManageCategoriesPage = async ({ params }) => {
  const { podId } = await params;

  const categoriesData = await fetchCategories(podId);

  return (
    <MainPageScroll scrollable={false}>
      <FilterHeader
        showFilter={false}
        list={breadcrumbsList}
        linkLabel="Create Category"
        linkHref={`/admin/manage/categories/${podId}/create`}
      />

      <AdminCategoriesList
        categories={categoriesData.categories}
        podId={podId}
      />
    </MainPageScroll>
  );
};

export default ManageCategoriesPage;
