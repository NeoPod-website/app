import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import CategoryContainer from "@/components/layout/category/CategoryContainer";

const fetchQuestCategory = async (categoryId) => {
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
      // next: { revalidate: 300 },
    },
  );

  if (!categoryRes.ok) {
    if (categoryRes.status === 404) {
      notFound();
    }

    throw new Error(`Failed to fetch category: ${categoryRes.status}`);
  }

  const categoryData = await categoryRes.json();

  return categoryData.data?.category || null;
};

const CategorySlot = async ({ params }) => {
  const { user } = await getCachedSession();

  const { categoryId } = await params;

  const categoryData = await fetchQuestCategory(categoryId);

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="hidden min-w-96 lg:block">
      <CategoryContainer
        user={user}
        compact={true}
        scrollable={true}
        category={categoryData}
      />
    </div>
  );
};

export default CategorySlot;
