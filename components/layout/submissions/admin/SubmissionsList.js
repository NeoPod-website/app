// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";

// import SubmissionsListHeader from "./list/SubmissionsListHeader";
// import StatusFilterChips from "./list/StatusFilterChips";
// import SearchFilterSection from "./list/SearchFilterSection";
// import SubmissionsListContent from "./list/SubmissionsListContent";

// import { calculateFilterCounts, getUniqueCategories } from "./submissionsUtils";

// const SubmissionsList = ({
//   loading,
//   filters,
//   currentPod,
//   submissions,
//   onFilterChange,
//   selectedSubmission,
//   onSelectSubmission,
//   onFetchSubmissions,
// }) => {
//   // Local state for search inputs
//   const [isFiltersVisible, setIsFiltersVisible] = useState(false);
//   const [searchUser, setSearchUser] = useState(filters.user || "");
//   const [searchQuest, setSearchQuest] = useState(filters.quest || "");

//   // Debouncing and backend fetching
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // Trigger backend fetch with new filters
//       onFetchSubmissions({
//         ...filters,
//         user: searchUser,
//         quest: searchQuest,
//       });
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [
//     searchUser,
//     searchQuest,
//     filters.status,
//     filters.category,
//     onFetchSubmissions,
//   ]);

//   // Memoized calculations - now based on current page of submissions
//   const categories = useMemo(
//     () => getUniqueCategories(submissions),
//     [submissions],
//   );

//   const filterCounts = useMemo(
//     () => calculateFilterCounts(submissions),
//     [submissions],
//   );

//   // Event handlers
//   const handleStatusFilter = useCallback(
//     (status) => {
//       const newFilters = { ...filters, status };
//       onFilterChange(newFilters);
//       // Immediately fetch with new status
//       onFetchSubmissions({
//         ...newFilters,
//         user: searchUser,
//         quest: searchQuest,
//       });
//     },
//     [filters, searchUser, searchQuest, onFilterChange, onFetchSubmissions],
//   );

//   const handleCategoryChange = useCallback(
//     (value) => {
//       const newFilters = { ...filters, category: value };
//       onFilterChange(newFilters);
//       // Immediately fetch with new category
//       onFetchSubmissions({
//         ...newFilters,
//         user: searchUser,
//         quest: searchQuest,
//       });
//     },
//     [filters, searchUser, searchQuest, onFilterChange, onFetchSubmissions],
//   );

//   const handleClearAllFilters = useCallback(() => {
//     const defaultFilters = {
//       status: "pending",
//       user: "",
//       quest: "",
//       category: "all",
//     };

//     setSearchUser("");
//     setSearchQuest("");
//     onFilterChange(defaultFilters);
//     onFetchSubmissions(defaultFilters);
//   }, [onFilterChange, onFetchSubmissions]);

//   return (
//     <div className="flex flex-1 flex-col overflow-hidden bg-background">
//       <div className="space-y-4 border-b border-divider p-6">
//         <SubmissionsListHeader currentPod={currentPod} />

//         <StatusFilterChips
//           filters={filters}
//           filterCounts={filterCounts}
//           onStatusFilter={handleStatusFilter}
//         />

//         <SearchFilterSection
//           searchUser={searchUser}
//           setSearchUser={setSearchUser}
//           searchQuest={searchQuest}
//           setSearchQuest={setSearchQuest}
//           filters={filters}
//           categories={categories}
//           onCategoryChange={handleCategoryChange}
//           onStatusFilter={handleStatusFilter}
//           onClearAllFilters={handleClearAllFilters}
//           isFiltersVisible={isFiltersVisible}
//           setIsFiltersVisible={setIsFiltersVisible}
//         />
//       </div>

//       <div className="flex-1 overflow-y-auto scrollbar-hide">
//         <SubmissionsListContent
//           loading={loading}
//           submissions={submissions}
//           selectedSubmission={selectedSubmission}
//           onSelectSubmission={onSelectSubmission}
//         />
//       </div>
//     </div>
//   );
// };

// export default SubmissionsList;

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";

// import SubmissionsListHeader from "./list/SubmissionsListHeader";
// import StatusFilterChips from "./list/StatusFilterChips";
// import SearchFilterSection from "./list/SearchFilterSection";
// import SubmissionsListContent from "./list/SubmissionsListContent";

// import { calculateFilterCounts, getUniqueCategories } from "./submissionsUtils";

// const SubmissionsList = ({
//   loading,
//   filters,
//   currentPod,
//   submissions,
//   onFilterChange,
//   selectedSubmission,
//   onSelectSubmission,
//   onFetchSubmissions,
// }) => {
//   // Local state for search inputs
//   const [isFiltersVisible, setIsFiltersVisible] = useState(false);
//   const [searchUser, setSearchUser] = useState(filters.user || "");
//   const [searchQuest, setSearchQuest] = useState(filters.quest || "");

//   // Sync local search state with filters
//   useEffect(() => {
//     setSearchUser(filters.user || "");
//     setSearchQuest(filters.quest || "");
//   }, [filters.user, filters.quest]);

//   // Debounced search effect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchUser !== filters.user || searchQuest !== filters.quest) {
//         onFetchSubmissions({
//           ...filters,
//           user: searchUser,
//           quest: searchQuest,
//         });
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchUser, searchQuest, filters, onFetchSubmissions]);

//   // Memoized calculations
//   const categories = useMemo(
//     () => getUniqueCategories(submissions),
//     [submissions],
//   );

//   const filterCounts = useMemo(
//     () => calculateFilterCounts(submissions),
//     [submissions],
//   );

//   // Event handlers
//   const handleStatusFilter = useCallback(
//     (status) => {
//       const newFilters = { ...filters, status };
//       onFilterChange(newFilters);
//       onFetchSubmissions({
//         ...newFilters,
//         user: searchUser,
//         quest: searchQuest,
//       });
//     },
//     [filters, searchUser, searchQuest, onFilterChange, onFetchSubmissions],
//   );

//   const handleCategoryChange = useCallback(
//     (value) => {
//       const newFilters = { ...filters, category: value };
//       onFilterChange(newFilters);
//       onFetchSubmissions({
//         ...newFilters,
//         user: searchUser,
//         quest: searchQuest,
//       });
//     },
//     [filters, searchUser, searchQuest, onFilterChange, onFetchSubmissions],
//   );

//   const handleClearAllFilters = useCallback(() => {
//     const defaultFilters = {
//       status: "pending",
//       user: "",
//       quest: "",
//       category: "all",
//     };

//     setSearchUser("");
//     setSearchQuest("");
//     onFilterChange(defaultFilters);
//     onFetchSubmissions(defaultFilters);
//   }, [onFilterChange, onFetchSubmissions]);

//   const handleSearchUserChange = useCallback((value) => {
//     setSearchUser(value);
//   }, []);

//   const handleSearchQuestChange = useCallback((value) => {
//     setSearchQuest(value);
//   }, []);

//   const handleToggleFilters = useCallback(() => {
//     setIsFiltersVisible((prev) => !prev);
//   }, []);

//   return (
//     <div className="flex flex-1 flex-col overflow-hidden bg-background">
//       {/* Header Section */}
//       <div className="space-y-4 border-b border-divider p-6">
//         <SubmissionsListHeader currentPod={currentPod} />

//         <StatusFilterChips
//           filters={filters}
//           filterCounts={filterCounts}
//           onStatusFilter={handleStatusFilter}
//         />

//         <SearchFilterSection
//           searchUser={searchUser}
//           setSearchUser={handleSearchUserChange}
//           searchQuest={searchQuest}
//           setSearchQuest={handleSearchQuestChange}
//           filters={filters}
//           categories={categories}
//           onCategoryChange={handleCategoryChange}
//           onStatusFilter={handleStatusFilter}
//           onClearAllFilters={handleClearAllFilters}
//           isFiltersVisible={isFiltersVisible}
//           setIsFiltersVisible={handleToggleFilters}
//         />
//       </div>

//       {/* Content Section */}
//       <div className="flex-1 overflow-y-auto scrollbar-hide">
//         <SubmissionsListContent
//           loading={loading}
//           submissions={submissions}
//           selectedSubmission={selectedSubmission}
//           onSelectSubmission={onSelectSubmission}
//         />
//       </div>
//     </div>
//   );
// };

// export default SubmissionsList;

"use client";

import { memo } from "react";

import StatusFilterChips from "./list/StatusFilterChips";
import SubmissionsListHeader from "./list/SubmissionsListHeader";
import SubmissionsListContent from "./list/SubmissionsListContent";

const SubmissionsList = memo(
  ({
    loading,
    hasMore,
    onLoadMore,
    loadingMore,
    submissions,
    currentStatus,
    setSubmissions,
    onStatusChange,
    selectedSubmission,
    setSelectedSubmission,
  }) => {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="space-y-4 border-b border-divider p-6">
          <SubmissionsListHeader
            currentStatus={currentStatus}
            loadedCount={submissions.length}
          />

          <StatusFilterChips
            currentStatus={currentStatus}
            onStatusChange={onStatusChange}
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <SubmissionsListContent
            loading={loading}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            loadingMore={loadingMore}
            submissions={submissions}
            setSubmissions={setSubmissions}
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
          />
        </div>
      </div>
    );
  },
);

SubmissionsList.displayName = "SubmissionsList";

export default SubmissionsList;
