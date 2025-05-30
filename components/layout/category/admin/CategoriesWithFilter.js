"use client";

import { Suspense, useState, useMemo, useCallback, useEffect } from "react";

import CategoryFilterPanel from "../filter/CategoryFilterPanel";
import CategoryFilterHeader from "../filter/CategoryFilterHeader";

import CategoryListLoader from "@/components/ui/loader/category/CategoryListLoader";
import AdminCategoriesList from "@/components/layout/category/admin/AdminCategoriesList";

export default function CategoriesWithFilter({ podId, initialCategories }) {
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState("");

  const allCategories = Array.isArray(initialCategories)
    ? initialCategories
    : [];

  const hasActiveFilters =
    Boolean(debouncedNameFilter.trim()) || Boolean(statusFilter);
  const activeFiltersCount =
    (debouncedNameFilter.trim() ? 1 : 0) + (statusFilter ? 1 : 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [nameFilter]);

  const filteredCategories = useMemo(() => {
    if (allCategories.length === 0) {
      return [];
    }

    return allCategories.filter((category) => {
      if (!category || typeof category !== "object") {
        return false;
      }

      const nameMatch =
        !debouncedNameFilter.trim() ||
        (category.name &&
          typeof category.name === "string" &&
          category.name
            .toLowerCase()
            .includes(debouncedNameFilter.trim().toLowerCase()));

      const statusMatch =
        !statusFilter ||
        (category.status &&
          typeof category.status === "string" &&
          category.status === statusFilter);

      return nameMatch && statusMatch;
    });
  }, [allCategories, debouncedNameFilter, statusFilter]);

  const resetFilters = useCallback(() => {
    setNameFilter("");
    setStatusFilter("");
    setDebouncedNameFilter("");
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
      <CategoryFilterHeader
        podId={podId}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <CategoryFilterPanel
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <Suspense fallback={<CategoryListLoader />}>
        <div className="hide-scroll flex flex-1 flex-col overflow-y-auto">
          <AdminCategoriesList
            podId={podId}
            resetFilters={resetFilters}
            categories={filteredCategories}
            hasActiveFilters={hasActiveFilters}
            totalCategories={allCategories.length}
          />
        </div>
      </Suspense>
    </div>
  );
}
