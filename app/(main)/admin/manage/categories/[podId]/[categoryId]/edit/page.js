import React from "react";
import { cookies } from "next/headers";
import { Undo2Icon } from "lucide-react";

import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";
import AdminCategoryMain from "@/components/layout/category/admin/AdminCategoryPage";

async function fetchCategory(categoryId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`;

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

      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

const EditCategoryPage = async ({ params }) => {
  const { podId, categoryId } = await params;

  const categoryData = await fetchCategory(categoryId);

  const breadcrumbsList = [
    {
      title: "Manage",
    },

    {
      title: "Pods",
      href: "/admin/manage/pods",
    },

    {
      title: "Pod Categories",
      href: `/admin/manage/categories/${podId}`,
    },

    {
      title: categoryData.category.name,
      href: `/admin/manage/categories/${podId}/${categoryId}`,
    },

    {
      title: "Edit",
    },
  ];

  return (
    <ManagePageWrapper
      linkLabel="Back"
      scrollable={false}
      list={breadcrumbsList}
      href={`/admin/manage/categories/${podId}`}
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      <AdminCategoryMain
        isNew={false}
        podId={podId}
        initialCategoryData={categoryData.category}
      />
    </ManagePageWrapper>
  );
};

export default EditCategoryPage;
