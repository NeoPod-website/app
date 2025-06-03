"use client";

import { Suspense, useState, useMemo, useCallback, useEffect } from "react";

import QuestFilterPanel from "../filter/QuestFilterPanel";

import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";
import AdminQuestList from "@/components/layout/quests/admin/AdminQuestList";

const AdminQuestsWithFilter = ({ category, initialQuests }) => {
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState("");

  const allQuests = Array.isArray(initialQuests) ? initialQuests : [];

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

  const filteredQuests = useMemo(() => {
    if (allQuests.length === 0) {
      return [];
    }

    return allQuests.filter((quest) => {
      if (!quest || typeof quest !== "object") {
        return false;
      }

      const nameMatch =
        !debouncedNameFilter.trim() ||
        (quest.name &&
          typeof quest.name === "string" &&
          quest.name
            .toLowerCase()
            .includes(debouncedNameFilter.trim().toLowerCase()));

      const statusMatch =
        !statusFilter ||
        (quest.status &&
          typeof quest.status === "string" &&
          quest.status === statusFilter);

      return nameMatch && statusMatch;
    });
  }, [allQuests, debouncedNameFilter, statusFilter]);

  const resetFilters = useCallback(() => {
    setNameFilter("");
    setStatusFilter("");
    setDebouncedNameFilter("");
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
      <QuestFilterPanel
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <Suspense fallback={<QuestListLoader />}>
        <div className="hide-scroll flex flex-1 flex-col overflow-y-auto">
          <AdminQuestList
            category={category}
            resetFilters={resetFilters}
            quests={filteredQuests}
            hasActiveFilters={hasActiveFilters}
            totalQuests={allQuests.length}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default AdminQuestsWithFilter;
