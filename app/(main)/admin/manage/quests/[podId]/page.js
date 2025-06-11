import Link from "next/link";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import MainPageScroll from "@/components/common/MainPageScroll";
import FilterHeader from "@/components/common/filter/FilterHeader";

import AdminQuestContainer from "@/components/layout/quests/admin/AdminQuestContainer";

export const metadata = {
  title: "Manage Quests | Admin Panel | NEO POD",
  description:
    "Create, edit, and organize quests for ambassadors. Shape the journey and engagement through meaningful tasks and challenges.",
};

// Shared button styles
const buttonClasses =
  "rounded-full border border-gray-400 bg-black/50 px-4 py-2 text-white transition-colors hover:border-gray-600 hover:bg-black/70";

// Empty state components
const EmptyStateMessage = ({ title, description }) => (
  <div className="space-y-2 text-center">
    <p className="text-xl font-bold text-white">{title}</p>
    <p className="text-base text-gray-200">{description}</p>
  </div>
);

const NoCategoriesState = ({ podId }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
    <EmptyStateMessage
      title="No categories found"
      description="Create your first category to start organizing quests"
    />

    <Link
      href={`/admin/manage/categories/${podId}/create`}
      className={buttonClasses}
    >
      Create Your First Category
    </Link>
  </div>
);

const ErrorState = ({ podId, error }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
    <EmptyStateMessage
      title="Failed to load categories"
      description={error || "An error occurred while loading categories"}
    />

    <Link href="/admin/manage" className={buttonClasses}>
      Back to Dashboard
    </Link>
  </div>
);

async function fetchCategories(podId) {
  try {
    if (!podId) {
      throw new Error("Pod ID is required");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      throw new Error("Authentication token not found");
    }

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

      throw new Error(
        data.message || `Failed to fetch categories: ${response.statusText}`,
      );
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Validation function for categories
const validateCategories = (categoriesData) => {
  if (!categoriesData || typeof categoriesData !== "object") {
    return { isValid: false, error: "Invalid categories data structure" };
  }

  if (!Array.isArray(categoriesData.categories)) {
    return { isValid: false, error: "Categories data is not an array" };
  }

  return { isValid: true };
};

// Filter and validate individual categories
const validateCategoriesList = (categories) => {
  if (!Array.isArray(categories)) return [];

  return categories.filter(
    (category) =>
      category &&
      typeof category === "object" &&
      category.category_id &&
      category.name &&
      category.pod_id,
  );
};

const QuestPageLayout = ({
  podId,
  children,
  headerProps = {},
  scrollable = false,
  showFilterHeader = true,
}) => {
  return (
    <MainPageScroll scrollable={scrollable}>
      {showFilterHeader && (
        <FilterHeader podId={podId} showFilter={false} {...headerProps} />
      )}

      <Suspense>{children}</Suspense>
    </MainPageScroll>
  );
};

const ManageQuestsPage = async ({ params }) => {
  const { podId } = await params;

  if (!podId) {
    return (
      <QuestPageLayout
        podId={podId}
        headerProps={{
          headerLabel: "Error",
          linkLabel: "Back to Dashboard",
          linkHref: `/admin/dashboard`,
        }}
      >
        <ErrorState podId={podId} error="Pod ID is missing from the URL" />
      </QuestPageLayout>
    );
  }

  const categoriesData = await fetchCategories(podId);

  // Validate categories data
  const validation = validateCategories(categoriesData);

  if (!validation.isValid) {
    return (
      <QuestPageLayout
        podId={podId}
        headerProps={{
          headerLabel: "Error",
          linkLabel: "Back to Dashboard",
          linkHref: `/admin/dashboard`,
        }}
      >
        <ErrorState podId={podId} error={validation.error} />
      </QuestPageLayout>
    );
  }

  // Filter and validate individual categories
  const validCategories = validateCategoriesList(categoriesData.categories);

  // Handle empty categories
  if (validCategories.length === 0) {
    return (
      <QuestPageLayout
        podId={podId}
        headerProps={{
          headerLabel: "No Categories Found",
          linkLabel: "Create Category",
          linkHref: `/admin/manage/categories/${podId}/create`,
        }}
      >
        <NoCategoriesState podId={podId} />
      </QuestPageLayout>
    );
  }

  return (
    <MainPageScroll scrollable>
      {validCategories.map((category) => (
        <AdminQuestContainer
          isQuestPage
          category={category}
          key={category.category_id}
        />
      ))}
    </MainPageScroll>
  );
};

export default ManageQuestsPage;
