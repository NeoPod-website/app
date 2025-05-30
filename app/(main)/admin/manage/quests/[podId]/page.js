import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import MainPageScroll from "@/components/common/MainPageScroll";
import AdminQuestContainer from "@/components/layout/quests/admin/AdminQuestContainer";

export const metadata = {
  title: "Manage Quests | Admin Panel | NEO POD",
  description:
    "Create, edit, and organize quests for ambassadors. Shape the journey and engagement through meaningful tasks and challenges.",
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
      cache: "no-store", // Always fetch fresh data
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

const ManageQuestsPage = async ({ params }) => {
  const { podId } = await params;

  const categoriesData = await fetchCategories(podId);

  return (
    <MainPageScroll scrollable>
      <Suspense>
        {categoriesData.categories.map((category) => (
          <AdminQuestContainer
            isQuestPage
            category={category}
            key={category.category_id}
          />
        ))}
      </Suspense>
    </MainPageScroll>
  );
};

export default ManageQuestsPage;
