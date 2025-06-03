import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import MainPageScroll from "@/components/common/MainPageScroll";
import CategoriesList from "@/components/layout/category/CategoriesList";

export const metadata = {
  title: "Quests | NEO POD",
  description:
    "Discover and participate in quests designed to boost your engagement and growth within the Neo Pod community. Earn rewards and unlock achievements.",
};

// Empty state components
const EmptyStateMessage = ({ title, description }) => (
  <div className="space-y-2 text-center">
    <p className="text-xl font-bold text-white">{title}</p>
    <p className="text-base text-gray-200">{description}</p>
  </div>
);

const NoCategoriesState = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
    <EmptyStateMessage
      title="No quest categories available"
      description="Check back later for new quest categories and exciting challenges"
    />
  </div>
);

const ErrorState = ({ error, showContactSupport = false }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
    <EmptyStateMessage
      title="Failed to load quest categories"
      description={error || "An error occurred while loading quest categories"}
    />

    {showContactSupport && (
      <p className="mt-2 text-sm text-gray-300">
        If this problem persists, please contact support for assistance.
      </p>
    )}
  </div>
);

const fetchActiveCategories = async (podId) => {
  try {
    if (!podId) {
      throw new Error("Pod ID is required");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      throw new Error("Authentication token not found");
    }

    let url = `${process.env.NEXT_PUBLIC_API_URL}/categories/pods/${podId}/categories/active`;

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
        data.message ||
          `Failed to fetch active categories: ${response.statusText}`,
      );
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching active categories:", error);
    throw error;
  }
};

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
      category.pod_id &&
      category.is_active !== false, // Ensure category is active
  );
};

const QuestPageLayout = ({ children, scrollable = false }) => {
  return <MainPageScroll scrollable={scrollable}>{children}</MainPageScroll>;
};

const QuestsPage = async () => {
  // Get user session to extract pod_id
  const { user, error, isAuthenticated, message } = await getCachedSession();

  // Handle authentication errors
  if (!isAuthenticated || error) {
    return (
      <QuestPageLayout
        podId={null}
        headerProps={{
          headerLabel: "Quest Categories",
        }}
      >
        <ErrorState
          error={message || "Please log in to view quest categories"}
          showContactSupport={false}
        />
      </QuestPageLayout>
    );
  }

  // Extract pod_id from user
  const podId = user?.pod_id;

  if (!podId) {
    return (
      <QuestPageLayout
        podId={null}
        headerProps={{
          headerLabel: "Quest Categories",
        }}
      >
        <ErrorState
          error="No pod assigned to your account. Please contact support."
          showContactSupport={true}
        />
      </QuestPageLayout>
    );
  }

  try {
    const categoriesData = await fetchActiveCategories(podId);

    // Validate categories data
    const validation = validateCategories(categoriesData);

    if (!validation.isValid) {
      return (
        <QuestPageLayout>
          <ErrorState error={validation.error} showContactSupport={true} />
        </QuestPageLayout>
      );
    }

    // Filter and validate individual categories
    const validCategories = validateCategoriesList(categoriesData.categories);

    // Handle empty categories
    if (validCategories.length === 0) {
      return (
        <QuestPageLayout>
          <NoCategoriesState />
        </QuestPageLayout>
      );
    }

    return (
      <Suspense>
        <CategoriesList categories={validCategories} />;
      </Suspense>
    );
  } catch (error) {
    return (
      <QuestPageLayout>
        <ErrorState error={error.message} showContactSupport={true} />
      </QuestPageLayout>
    );
  }
};

export default QuestsPage;
