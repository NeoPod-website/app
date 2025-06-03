import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import CategoryItem from "./CategoryItem";
import QuestList from "../quests/QuestList";

import WrapperContainer from "@/components/common/WrapperContainer";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

// Empty state components
const EmptyStateMessage = ({ title, description }) => (
  <div className="space-y-2 text-center">
    <p className="text-xl font-bold text-white">{title}</p>
    <p className="text-base text-gray-200">{description}</p>
  </div>
);

const QuestLoadError = ({ category, error }) => (
  <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
    <EmptyStateMessage
      title="Failed to load quests"
      description={
        error || "An error occurred while loading quests for this category"
      }
    />
  </div>
);

async function fetchQuests(categoryId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      throw new Error("Authentication token not found");
    }

    // Using the same endpoint as admin but for ambassadors
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

// Validate and filter quests - only show active quests for ambassadors
const validateQuests = (questsData) => {
  if (!questsData?.quests || !Array.isArray(questsData.quests)) {
    return [];
  }

  return questsData.quests.filter(
    (quest) =>
      quest &&
      typeof quest === "object" &&
      quest.quest_id &&
      quest.name &&
      quest.status === "active",
  );
};

// Layout wrapper component for consistency
const QuestContainerLayout = ({
  category,
  children,
  isQuestPage,
  scrollable = true,
  showCategoryItem = true,
}) => {
  return (
    <WrapperContainer scrollable={scrollable}>
      {showCategoryItem && category && (
        <CategoryItem
          isAdmin={false}
          showDescription
          podId={category.pod_id}
          status={category.status}
          isQuestPage={isQuestPage}
          id={category.category_id}
          title={category.name ?? "No Category"}
          description={category.description ?? ""}
          icon={category.icon ?? "/dashboard/category/icon-1.png"}
          background={
            category.background ?? "/dashboard/category/background-2.jpg"
          }
        />
      )}

      {children}
    </WrapperContainer>
  );
};

const CategoryContainer = async ({
  category,
  compact = false,
  scrollable = false,
  isQuestPage = false,
}) => {
  // Early validation - check if category exists at all
  if (!category) {
    return (
      <QuestContainerLayout
        category={null}
        scrollable={false}
        showCategoryItem={false}
        isQuestPage={isQuestPage}
      >
        <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
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
        <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <EmptyStateMessage
            title="Invalid Category"
            description={categoryValidation.error}
          />
        </div>
      </QuestContainerLayout>
    );
  }

  try {
    const questsData = await fetchQuests(category.category_id);

    // Validate quests data and filter for active quests only
    const validQuests = validateQuests(questsData);

    return (
      <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
        <Suspense>
          <QuestList
            compact={compact}
            quests={validQuests}
            scrollable={scrollable}
            categoryId={category.category_id}
          />
        </Suspense>
      </QuestContainerLayout>
    );
  } catch (error) {
    return (
      <QuestContainerLayout category={category} scrollable={false}>
        <QuestLoadError category={category} error={error.message} />
      </QuestContainerLayout>
    );
  }
};

export default CategoryContainer;
