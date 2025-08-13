import Link from "next/link";
import { Button } from "@heroui/react";
import React, { memo, useMemo } from "react";

import AdminCategoryContainer from "./AdminCategoryContainer";

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
      title="No categories match your filters"
      description="Try adjusting your search or filter criteria"
    />

    <Button size="md" onPress={resetFilters} className={buttonClasses}>
      Clear Filters
    </Button>
  </>
));

const NoCategoriesState = memo(({ podId }) => (
  <>
    <EmptyStateMessage
      title="No categories found"
      description="Create your first category to get started"
    />

    <Link
      href={`/admin/manage/categories/${podId}/create`}
      className={buttonClasses}
    >
      Create Your First Category
    </Link>
  </>
));

const FallbackState = memo(({ podId }) => (
  <>
    <EmptyStateMessage
      title="No categories available"
      description="Create your first category to get started"
    />
    <Link
      href={`/admin/manage/categories/${podId}/create`}
      className={buttonClasses}
    >
      Create Category
    </Link>
  </>
));

const AdminCategoriesList = ({
  podId,
  categories,
  hasActiveFilters,
  resetFilters,
  totalCategories,
}) => {
  // Memoize validation to avoid re-computation
  const validCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];

    return categories.filter(
      (category) =>
        category &&
        typeof category === "object" &&
        category.category_id &&
        category.name,
    );
  }, [categories]);

  // Memoize filter info to avoid unnecessary re-renders
  const filterInfo = useMemo(
    () => ({
      count: validCategories.length,
      total: totalCategories,
    }),
    [validCategories.length, totalCategories],
  );

  // Early return for empty state
  if (validCategories.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
        {hasActiveFilters ? (
          <FilteredEmptyState resetFilters={resetFilters} />
        ) : totalCategories === 0 ? (
          <NoCategoriesState podId={podId} />
        ) : (
          <FallbackState podId={podId} />
        )}
      </div>
    );
  }

  return (
    <section className="hide-scroll flex flex-1 flex-col justify-start gap-5 overflow-y-auto">
      {hasActiveFilters && (
        <div className="px-8">
          <p className="text-sm text-gray-100">
            Showing {filterInfo.count} of {filterInfo.total} categories
          </p>
        </div>
      )}

      {validCategories.map((category) => (
        <AdminCategoryContainer
          podId={podId}
          category={category}
          key={category.category_id}
        />
      ))}
    </section>
  );
};

export default memo(AdminCategoriesList);
