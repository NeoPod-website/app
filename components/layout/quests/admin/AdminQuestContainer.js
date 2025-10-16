import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import WrapperContainer from "@/components/common/WrapperContainer";
import CategoryItem from "@/components/layout/category/CategoryItem";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

import QuestsWithFilter from "./AdminQuestWithFilter";

// Empty state components
const EmptyStateMessage = ({ title, description }) => (
  <div className="space-y-2 text-center">
    <p className="text-xl font-bold text-white">{title}</p>
    <p className="text-base text-gray-200">{description}</p>
  </div>
);

async function fetchQuests(categoryId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      throw new Error("Authentication token not found");
    }

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

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }

      throw new Error(
        data.message || `Failed to fetch quests: ${response.statusText}`,
      );
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching quests:", error);
    throw error;
  }
}

// Validation function for category
const validateCategory = (category) => {
  if (!category || typeof category !== "object") {
    return { isValid: false, error: "Invalid category data" };
  }

  const requiredFields = ["category_id", "name", "pod_id"];
  const missingFields = requiredFields.filter((field) => !category[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return { isValid: true };
};

// Validate and filter quests
const validateQuests = (questsData) => {
  if (!questsData?.quests || !Array.isArray(questsData.quests)) {
    return [];
  }

  return questsData.quests.filter(
    (quest) =>
      quest && typeof quest === "object" && quest.quest_id && quest.name,
  );
};

// Layout wrapper component for consistency
const QuestContainerLayout = ({
  category,
  children,
  scrollable = true,
  showCategoryItem = true,
}) => {
  return (
    <WrapperContainer scrollable={scrollable}>
      {showCategoryItem && category && (
        <CategoryItem
          isAdmin
          showDescription
          isQuestPage={true}
          podId={category.pod_id || ""}
          id={category.category_id || ""}
          status={category.status || "draft"}
          title={category.name ?? "No Category"}
          description={category.description ?? ""}
          icon={category.icon ?? "/dashboard/category/icon-1.png"}
          style={{
            borderRadius: "1.25rem 1.25rem 0 0",
          }}
          background={category.cover_photo}
        />
      )}

      {children}
    </WrapperContainer>
  );
};

const AdminQuestContainer = async ({ category, isQuestPage = false }) => {
  // Early validation - check if category exists at all
  if (!category) {
    return (
      <QuestContainerLayout
        category={null}
        scrollable={false}
        showCategoryItem={false}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <EmptyStateMessage
            title="No Category Data"
            description="Category information is missing"
          />
        </div>
      </QuestContainerLayout>
    );
  }

  // Validate category structure
  const categoryValidation = validateCategory(category);

  if (!categoryValidation.isValid) {
    return (
      <QuestContainerLayout category={category} scrollable={false}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <EmptyStateMessage
            title="Invalid Category"
            description={categoryValidation.error}
          />
        </div>
      </QuestContainerLayout>
    );
  }

  const questsData = await fetchQuests(category.category_id);

  // Validate quests data
  const validQuests = validateQuests(questsData);

  // Always show the filtering interface (even when no quests exist)
  return (
    <QuestContainerLayout category={category}>
      <Suspense fallback={<QuestListLoader />}>
        <QuestsWithFilter category={category} initialQuests={validQuests} />
      </Suspense>
    </QuestContainerLayout>
  );
};

export default AdminQuestContainer;
