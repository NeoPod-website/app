import React from "react";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import MainPageScroll from "@/components/common/MainPageScroll";
import CategoriesWithFilter from "@/components/layout/category/admin/CategoriesWithFilter";
import DeleteConfirmationModal from "@/components/ui/modals/DeleteConfirmationModal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage POD Categories | Admin Panel | NeoPod",
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
      cache: "no-store",
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
    <>
      <DeleteConfirmationModal />

      <MainPageScroll scrollable={false}>
        <Suspense>
          <CategoriesWithFilter
            podId={podId}
            initialCategories={categoriesData.categories || []}
          />
        </Suspense>
      </MainPageScroll>
    </>
  );
};

export default ManageCategoriesPage;
