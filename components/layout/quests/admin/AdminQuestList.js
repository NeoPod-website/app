"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import React, { memo, useMemo } from "react";

import AdminQuestListClient from "./AdminQuestListClient";

// Shared button styles to avoid repetition
const buttonClasses =
  "rounded-full border border-gray-400 bg-black/50 px-4 py-2 text-white transition-colors hover:border-gray-600 hover:bg-black/70";

// Memoized empty state components
const EmptyStateMessage = memo(({ title, description }) => (
  <div className="space-y-2">
    <p className="text-xl font-bold text-white">{title}</p>
    <p className="text-base text-gray-200">{description}</p>
  </div>
));

const FilteredEmptyState = memo(({ resetFilters }) => (
  <>
    <EmptyStateMessage
      title="No quests match your filters"
      description="Try adjusting your search or filter criteria"
    />

    <Button size="md" onPress={resetFilters} className={buttonClasses}>
      Clear Filters
    </Button>
  </>
));

const NoQuestsState = memo(({ category }) => (
  <>
    <EmptyStateMessage
      title="No quests found"
      description="Create your first quest in this category to get started"
    />

    <Link
      href={`/admin/manage/quests/${category.pod_id}/${category.category_id}/create`}
      className={buttonClasses}
    >
      Create Your First Quest
    </Link>
  </>
));

const FallbackState = memo(({ category }) => (
  <>
    <EmptyStateMessage
      title="No quests available"
      description="Create your first quest to get started"
    />
    <Link
      href={`/admin/manage/quests/${category.pod_id}/${category.category_id}/create`}
      className={buttonClasses}
    >
      Create Quest
    </Link>
  </>
));

const AdminQuestList = ({
  category,
  quests,
  hasActiveFilters,
  resetFilters,
  totalQuests,
  scrollable = false,
}) => {
  // Memoize validation to avoid re-computation
  const validQuests = useMemo(() => {
    if (!Array.isArray(quests)) return [];

    return quests.filter(
      (quest) =>
        quest && typeof quest === "object" && quest.quest_id && quest.name,
    );
  }, [quests]);

  // Memoize filter info to avoid unnecessary re-renders
  const filterInfo = useMemo(
    () => ({
      count: validQuests.length,
      total: totalQuests,
    }),
    [validQuests.length, totalQuests],
  );

  // Early return for empty state
  if (validQuests.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
        {hasActiveFilters ? (
          <FilteredEmptyState resetFilters={resetFilters} />
        ) : totalQuests === 0 ? (
          <NoQuestsState category={category} />
        ) : (
          <FallbackState category={category} />
        )}
      </div>
    );
  }

  return (
    <section className="hide-scroll flex flex-1 flex-col justify-start gap-5 overflow-y-auto">
      {hasActiveFilters && (
        <div className="px-8">
          <p className="text-sm text-gray-100">
            Showing {filterInfo.count} of {filterInfo.total} quests
          </p>
        </div>
      )}

      <AdminQuestListClient
        quests={validQuests}
        category={category}
        scrollable={scrollable}
      />
    </section>
  );
};

export default memo(AdminQuestList);
