// "use client";

// import React, { useState } from "react";

// import AmbassadorFilterPanel from "./AmbassadorFilterPanel";
// import FilterHeader from "@/components/common/filter/FilterHeader";
// import AmbassadorsList from "./AmbassadorsList";

// const DEFAULT_VALUES = {
//   filter: "none",
//   roleFilter: "all",
//   sortFilter: "decrease",
// };

// const AmbassadorWithFilter = () => {
//   const [nameFilter, setNameFilter] = useState("");

//   const [filter, setFilter] = useState(DEFAULT_VALUES.filter);
//   const [sortFilter, setSortFilter] = useState(DEFAULT_VALUES.sortFilter);
//   const [roleFilter, setRolesFilter] = useState(DEFAULT_VALUES.roleFilter);

//   // Only count filters that differ from defaults as "active"
//   const hasActiveFilters =
//     sortFilter !== DEFAULT_VALUES.sortFilter ||
//     roleFilter !== DEFAULT_VALUES.roleFilter ||
//     filter !== DEFAULT_VALUES.filter;

//   // Calculate active filters count (excluding defaults)
//   const activeFiltersCount = [
//     sortFilter !== DEFAULT_VALUES.sortFilter ? sortFilter : null,
//     roleFilter !== DEFAULT_VALUES.roleFilter ? roleFilter : null,
//     filter !== DEFAULT_VALUES.filter ? filter : null,
//   ].filter(Boolean).length;

//   // Reset all filters to defaults
//   const resetFilters = () => {
//     setFilter(DEFAULT_VALUES.filter);
//     setSortFilter(DEFAULT_VALUES.sortFilter);
//     setRolesFilter(DEFAULT_VALUES.roleFilter);
//   };

//   return (
//     <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
//       <FilterHeader
//         role="super"
//         nameFilter={nameFilter}
//         activeFiltersCount={activeFiltersCount}
//         headerLabel="ambassadors"
//         setNameFilter={setNameFilter}
//         hasActiveFilters={hasActiveFilters}
//         searchPlaceholder="Search Ambassadors..."
//       />

//       <AmbassadorFilterPanel
//         filter={filter}
//         setFilter={setFilter}
//         sortFilter={sortFilter}
//         setSortFilter={setSortFilter}
//         roleFilter={roleFilter}
//         setRolesFilter={setRolesFilter}
//         resetFilters={resetFilters}
//         hasActiveFilters={hasActiveFilters}
//       />

//       <div className="hide-scroll flex flex-1 flex-col overflow-y-auto">
//         <AmbassadorsList
//           filter={filter}
//           sortFilter={sortFilter}
//           roleFilter={roleFilter}
//         />
//       </div>
//     </div>
//   );
// };

// export default AmbassadorWithFilter;

// "use client";

// import { useState, useCallback, useEffect } from "react";

// import AmbassadorFilterPanel from "./AmbassadorFilterPanel";
// import AdminAmbassadorsList from "./AdminAmbassadorsList";

// import FilterHeader from "@/components/common/filter/FilterHeader";
// import WrapperContainer from "@/components/common/WrapperContainer";

// const AmbassadorWithFilter = ({ podId, initialAmbassadors }) => {
//   const [nameFilter, setNameFilter] = useState("");

//   const [filter, setFilter] = useState("points");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [sortFilter, setSortFilter] = useState("decrease");

//   const [debouncedNameFilter, setDebouncedNameFilter] = useState("");

//   // Data state
//   const [ambassadors, setAmbassadors] = useState(initialAmbassadors || []);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     has_more: false,
//     next_key: null,
//     count: 0,
//   });
//   const [error, setError] = useState(null);

//   // Check if filters are different from defaults
//   const hasActiveFilters =
//     Boolean(debouncedNameFilter.trim()) ||
//     roleFilter !== "all" ||
//     filter !== "points" ||
//     sortFilter !== "decrease";

//   const activeFiltersCount =
//     (debouncedNameFilter.trim() ? 1 : 0) +
//     (roleFilter !== "all" ? 1 : 0) +
//     (filter !== "points" ? 1 : 0) +
//     (sortFilter !== "decrease" ? 1 : 0);

//   // Debounce name filter
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedNameFilter(nameFilter);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [nameFilter]);

//   // Fetch ambassadors from backend
//   const fetchAmbassadors = useCallback(
//     async (loadMore = false) => {
//       setLoading(true);
//       setError(null);

//       try {
//         const queryParams = new URLSearchParams();

//         queryParams.append("role_filter", roleFilter);
//         queryParams.append("sort_filter", sortFilter);
//         queryParams.append("filter", filter);
//         queryParams.append("limit", "10");

//         // Add pagination key for load more
//         if (loadMore && pagination.next_key) {
//           queryParams.append("last_key", pagination.next_key);
//         }

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/pod/${podId}/filter?${queryParams.toString()}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           },
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (loadMore) {
//           // Append to existing data
//           setAmbassadors((prev) => [...prev, ...(data.data || [])]);
//         } else {
//           // Replace data
//           setAmbassadors(data.data || []);
//         }

//         setPagination(
//           data.pagination || {
//             has_more: false,
//             next_key: null,
//             count: 0,
//           },
//         );
//       } catch (err) {
//         setError(err.message);
//         console.error("Failed to fetch ambassadors:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [podId, roleFilter, sortFilter, filter, pagination.next_key],
//   );

//   // Search ambassadors (separate endpoint)
//   const searchAmbassadors = useCallback(
//     async (searchQuery) => {
//       if (!searchQuery.trim()) {
//         await fetchAmbassadors();
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const queryParams = new URLSearchParams();

//         queryParams.append("query", searchQuery.trim());
//         queryParams.append("type", "general");
//         queryParams.append("limit", "50");

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/pod/${podId}/search?${queryParams.toString()}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           },
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         setAmbassadors(data.data || []);
//         setPagination({
//           has_more: false,
//           next_key: null,
//           count: data.results || 0,
//         });
//       } catch (err) {
//         setError(err.message);
//         console.error("Failed to search ambassadors:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [podId],
//   );

//   // Fetch when filters change (except name filter)
//   useEffect(() => {
//     if (!debouncedNameFilter.trim()) {
//       fetchAmbassadors();
//     }
//   }, [roleFilter, sortFilter, filter]); // Don't include fetchAmbassadors in deps to avoid infinite loop

//   // Search when debounced name filter changes
//   useEffect(() => {
//     searchAmbassadors(debouncedNameFilter);
//   }, [debouncedNameFilter]); // Don't include searchAmbassadors in deps

//   // Load more handler
//   const handleLoadMore = useCallback(() => {
//     if (pagination.has_more && !loading && !debouncedNameFilter.trim()) {
//       fetchAmbassadors(true);
//     }
//   }, [pagination.has_more, loading, debouncedNameFilter, fetchAmbassadors]);

//   // Reset filters
//   const resetFilters = useCallback(() => {
//     setNameFilter("");
//     setFilter("points");
//     setRoleFilter("all");
//     setSortFilter("decrease");
//     setDebouncedNameFilter("");
//   }, []);

//   return (
//     <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
//       <FilterHeader
//         role="super"
//         nameFilter={nameFilter}
//         activeFiltersCount={activeFiltersCount}
//         headerLabel="ambassadors"
//         setNameFilter={setNameFilter}
//         hasActiveFilters={hasActiveFilters}
//         searchPlaceholder="Search Ambassadors..."
//       />

//       <AmbassadorFilterPanel
//         filter={filter}
//         setFilter={setFilter}
//         sortFilter={sortFilter}
//         setSortFilter={setSortFilter}
//         roleFilter={roleFilter}
//         setRolesFilter={setRoleFilter}
//         resetFilters={resetFilters}
//         hasActiveFilters={hasActiveFilters}
//       />

//       <WrapperContainer scrollable={true}>
//         <div className="hide-scroll flex-1 overflow-y-auto p-2 md:px-4 xl:p-6 3xl:p-8">
//           <AdminAmbassadorsList
//             podId={podId}
//             error={error}
//             loading={loading}
//             pagination={pagination}
//             ambassadors={ambassadors}
//             onLoadMore={handleLoadMore}
//             resetFilters={resetFilters}
//             hasActiveFilters={hasActiveFilters}
//             totalAmbassadors={ambassadors.length}
//             isSearchMode={Boolean(debouncedNameFilter.trim())}
//           />
//         </div>
//       </WrapperContainer>
//     </div>
//   );
// };

// export default AmbassadorWithFilter;

"use client";

import { useState, useCallback, useEffect } from "react";

import AmbassadorFilterPanel from "./AmbassadorFilterPanel";
import AdminAmbassadorsList from "./AdminAmbassadorsList";

import FilterHeader from "@/components/common/filter/FilterHeader";
import WrapperContainer from "@/components/common/WrapperContainer";

const AmbassadorWithFilter = ({ podId, initialAmbassadors }) => {
  const [nameFilter, setNameFilter] = useState("");

  const [filter, setFilter] = useState("points");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("decrease");

  const [debouncedNameFilter, setDebouncedNameFilter] = useState("");

  // Data state
  const [ambassadors, setAmbassadors] = useState(initialAmbassadors || []);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    has_more: false,
    next_key: null,
    count: 0,
  });
  const [error, setError] = useState(null);

  // Check if filters are different from defaults
  const hasActiveFilters =
    Boolean(debouncedNameFilter.trim()) ||
    roleFilter !== "all" ||
    filter !== "points" ||
    sortFilter !== "decrease";

  const activeFiltersCount =
    (debouncedNameFilter.trim() ? 1 : 0) +
    (roleFilter !== "all" ? 1 : 0) +
    (filter !== "points" ? 1 : 0) +
    (sortFilter !== "decrease" ? 1 : 0);

  // Debounce name filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [nameFilter]);

  // Fetch ambassadors from backend
  const fetchAmbassadors = useCallback(
    async (loadMore = false) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        queryParams.append("role_filter", roleFilter);
        queryParams.append("sort_filter", sortFilter);
        queryParams.append("filter", filter);
        queryParams.append("limit", "10");

        // Add pagination key for load more
        if (loadMore && pagination.next_key) {
          queryParams.append("last_key", pagination.next_key);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/pod/${podId}/filter?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (loadMore) {
          // Append to existing data
          setAmbassadors((prev) => [...prev, ...(data.data || [])]);
        } else {
          // Replace data
          setAmbassadors(data.data || []);
        }

        setPagination(
          data.pagination || {
            has_more: false,
            next_key: null,
            count: 0,
          },
        );
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch ambassadors:", err);
      } finally {
        setLoading(false);
      }
    },
    [podId, roleFilter, sortFilter, filter, pagination.next_key],
  );

  // Search ambassadors (separate endpoint)
  const searchAmbassadors = useCallback(
    async (searchQuery) => {
      if (!searchQuery.trim()) {
        await fetchAmbassadors();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        queryParams.append("q", searchQuery.trim());
        queryParams.append("limit", "50");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/pod/${podId}/search?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setAmbassadors(data.data || []);
        setPagination({
          has_more: false,
          next_key: null,
          count: data.results || 0,
        });
      } catch (err) {
        setError(err.message);
        console.error("Failed to search ambassadors:", err);
      } finally {
        setLoading(false);
      }
    },
    [podId],
  );

  // Update ambassador in local state (optimistic update)
  const updateAmbassadorInState = useCallback((updatedAmbassador) => {
    setAmbassadors((prevAmbassadors) =>
      prevAmbassadors.map((ambassador) =>
        ambassador.ambassador_id === updatedAmbassador.ambassador_id
          ? { ...ambassador, ...updatedAmbassador }
          : ambassador,
      ),
    );
  }, []);

  // Fetch when filters change (except name filter)
  useEffect(() => {
    if (!debouncedNameFilter.trim()) {
      fetchAmbassadors();
    }
  }, [roleFilter, sortFilter, filter]); // Don't include fetchAmbassadors in deps to avoid infinite loop

  // Search when debounced name filter changes
  useEffect(() => {
    searchAmbassadors(debouncedNameFilter);
  }, [debouncedNameFilter]); // Don't include searchAmbassadors in deps

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (pagination.has_more && !loading && !debouncedNameFilter.trim()) {
      fetchAmbassadors(true);
    }
  }, [pagination.has_more, loading, debouncedNameFilter, fetchAmbassadors]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setNameFilter("");
    setFilter("points");
    setRoleFilter("all");
    setSortFilter("decrease");
    setDebouncedNameFilter("");
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
      <FilterHeader
        role="super"
        nameFilter={nameFilter}
        activeFiltersCount={activeFiltersCount}
        headerLabel="ambassadors"
        setNameFilter={setNameFilter}
        hasActiveFilters={hasActiveFilters}
        searchPlaceholder="Search Ambassadors..."
      />

      <AmbassadorFilterPanel
        filter={filter}
        setFilter={setFilter}
        sortFilter={sortFilter}
        setSortFilter={setSortFilter}
        roleFilter={roleFilter}
        setRolesFilter={setRoleFilter}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <AdminAmbassadorsList
        podId={podId}
        error={error}
        loading={loading}
        pagination={pagination}
        ambassadors={ambassadors}
        onLoadMore={handleLoadMore}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        totalAmbassadors={ambassadors.length}
        isSearchMode={Boolean(debouncedNameFilter.trim())}
        onAmbassadorUpdate={updateAmbassadorInState}
      />
    </div>
  );
};

export default AmbassadorWithFilter;
