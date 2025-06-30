import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import CategoryContainer from "@/components/layout/category/CategoryContainer";

export const metadata = {
  title: "Quest Details | NeoPod",
  description:
    "Dive deep into this quest's challenges, complete tasks, and submit your progress to earn rewards and achievements in the NeoPod community.",
};

// Function to fetch category data
const fetchCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      throw new Error("Authentication token not found");
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      // next: { revalidate: 300 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }

      throw new Error(`Failed to fetch category: ${res.status}`);
    }

    const data = await res.json();
    return data.data?.category || null;
  } catch (error) {
    throw error;
  }
};

const CategoryPage = async ({ params }) => {
  const { user } = await getCachedSession();

  const { categoryId } = await params;

  const category = await fetchCategory(categoryId);

  if (!category) {
    notFound();
  }

  const breadcrumbsList = [
    {
      title: "Quests",
      href: "/quests",
    },
    {
      title: category.title || category.name,
      href: `/quests/${category.id || category.category_id}`,
    },
  ];

  return (
    <Suspense>
      <NeoBreadcrumbs list={breadcrumbsList} />
      <CategoryContainer scrollable={true} category={category} user={user} />
    </Suspense>
  );
};

export default CategoryPage;
