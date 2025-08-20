import React, { memo, useMemo } from "react";
import { Button, Spinner } from "@heroui/react";

import AdminContainer from "./AdminContainer";

import WrapperContainer from "@/components/common/WrapperContainer";

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

const FilteredEmptyState = memo(({ resetFilters, isSearchMode }) => (
  <>
    <EmptyStateMessage
      title={isSearchMode ? "No admins found" : "No admins match your filters"}
      description={
        isSearchMode
          ? "Try a different search term"
          : "Try adjusting your filter criteria"
      }
    />

    <Button size="md" onPress={resetFilters} className={buttonClasses}>
      {isSearchMode ? "Clear Search" : "Clear Filters"}
    </Button>
  </>
));

const NoAdminsState = memo(() => (
  <>
    <EmptyStateMessage
      title="No admins found"
      description="No admin accounts have been created yet"
    />
  </>
));

const ErrorState = memo(({ error, resetFilters }) => (
  <>
    <EmptyStateMessage
      title="Error loading admins"
      description={error || "Something went wrong"}
    />

    <Button size="md" onPress={resetFilters} className={buttonClasses}>
      Try Again
    </Button>
  </>
));

const LoadingState = memo(() => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6">
    <Spinner size="lg" color="primary" />
    <p className="text-base text-gray-200">Loading admins...</p>
  </div>
));

const AdminsList = ({
  admins,
  error,
  loading,
  pagination,
  onLoadMore,
  resetFilters,
  isSearchMode,
  onAdminUpdate,
  hasActiveFilters,
}) => {
  // Memoize validation to avoid re-computation
  const validAdmins = useMemo(() => {
    if (!Array.isArray(admins)) return [];

    return admins.filter(
      (admin) =>
        admin && typeof admin === "object" && admin.username && admin.email,
    );
  }, [admins]);

  // Show loading state for initial load
  if (loading && validAdmins.length === 0) {
    return <LoadingState />;
  }

  // Show error state
  if (error && validAdmins.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
        <ErrorState error={error} resetFilters={resetFilters} />
      </div>
    );
  }

  // Early return for empty state
  if (validAdmins.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
        {hasActiveFilters || isSearchMode ? (
          <FilteredEmptyState
            resetFilters={resetFilters}
            isSearchMode={isSearchMode}
          />
        ) : (
          <NoAdminsState />
        )}
      </div>
    );
  }

  return (
    <WrapperContainer scrollable={true} className="p-2 md:px-4 xl:p-6 3xl:p-8">
      <section className="hide-scroll flex flex-1 flex-col justify-start gap-5 overflow-y-auto">
        {(hasActiveFilters || isSearchMode) && (
          <div className="px-8">
            <p className="text-sm text-gray-100">
              {isSearchMode
                ? `Found ${validAdmins.length} admins`
                : `Showing ${validAdmins.length} admins`}
              {pagination.has_more && " (load more available)"}
            </p>
          </div>
        )}

        {validAdmins.map((admin) => (
          <AdminContainer
            admin={admin}
            key={admin.username}
            onUpdate={onAdminUpdate}
          />
        ))}

        {pagination.has_more && !isSearchMode && (
          <div className="flex justify-center px-8 pb-4">
            <Button
              size="sm"
              onPress={onLoadMore}
              disabled={loading}
              className={buttonClasses}
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="current" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}

        {loading && validAdmins.length > 0 && (
          <div className="flex justify-center px-8 pb-4">
            <Spinner size="lg" color="primary" />
          </div>
        )}
      </section>
    </WrapperContainer>
  );
};

export default memo(AdminsList);
