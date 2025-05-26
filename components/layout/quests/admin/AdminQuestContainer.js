import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import WrapperContainer from "@/components/common/WrapperContainer";

import CategoryItem from "@/components/layout/category/CategoryItem";
import AdminQuestList from "@/components/layout/quests/admin/AdminQuestList";

async function fetchQuests(categoryId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/quests/categories/${categoryId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    });
    console.log(response);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }

      throw new Error(`Failed to fetch quests: ${response.statusText}`);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching quests:", error);
    throw error;
  }
}

const AdminQuestContainer = async ({ category }) => {
  const questsData = await fetchQuests(category.category_id);
  console.log(questsData);

  return (
    <WrapperContainer scrollable>
      {/* <CategoryItem
        showDescription
        podId={category.pod_id}
        id={category.category_id}
        title={category.name ?? "No Category"}
        description={category.description ?? ""}
        icon={category.icon ?? "/dashboard/category/icon-1.png"}
        background={
          category.background ?? "/dashboard/category/background-2.jpg"
        }
      />

      <AdminQuestList categoryId={category.category_id} category={category} /> */}
      hi
    </WrapperContainer>
  );
};

export default AdminQuestContainer;
