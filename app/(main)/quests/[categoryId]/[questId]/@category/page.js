import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import CategoryContainer from "@/components/layout/category/CategoryContainer";

const fetchQuestCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new Error("Category ID not found in quest data");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      throw new Error("Authentication token not found");
    }

    // Now fetch the category with all its quests
    const categoryRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        next: { revalidate: 300 },
      },
    );

    if (!categoryRes.ok) {
      if (categoryRes.status === 404) {
        return notFound();
      }

      throw new Error(`Failed to fetch category: ${categoryRes.status}`);
    }

    const categoryData = await categoryRes.json();

    return categoryData.data?.category || null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching category data",
    );
  }
};

const CategorySlot = async ({ params }) => {
  const { categoryId } = await params;

  try {
    const categoryData = await fetchQuestCategory(categoryId);

    if (!categoryData) {
      notFound();
    }

    return (
      <CategoryContainer
        compact={true}
        scrollable={true}
        category={categoryData}
      />
    );
  } catch (error) {
    throw error;
  }
};

export default CategorySlot;
