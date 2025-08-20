// "use client";

// import { useState, useCallback, useEffect } from "react";

// import AdminFilterPanel from "./AdminFilterPanel";
// import AdminsList from "./AdminsList";

// import FilterHeader from "@/components/common/filter/FilterHeader";
// import WrapperContainer from "@/components/common/WrapperContainer";

// const AdminWithFilter = ({ initialAdmins, initialPagination }) => {
//   const [nameFilter, setNameFilter] = useState("");

//   const [filter, setFilter] = useState("joining_date");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [sortFilter, setSortFilter] = useState("decrease");

//   const [debouncedNameFilter, setDebouncedNameFilter] = useState("");

//   // Data state
//   const [admins, setAdmins] = useState(initialAdmins || []);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState(
//     initialPagination || {
//       has_more: false,
//       last_evaluated_key: null,
//       limit: 20,
//     },
//   );
//   const [error, setError] = useState(null);

//   // Check if filters are different from defaults
//   const hasActiveFilters =
//     Boolean(debouncedNameFilter.trim()) ||
//     roleFilter !== "all" ||
//     filter !== "joining_date" ||
//     sortFilter !== "decrease";

//   const activeFiltersCount =
//     (debouncedNameFilter.trim() ? 1 : 0) +
//     (roleFilter !== "all" ? 1 : 0) +
//     (filter !== "joining_date" ? 1 : 0) +
//     (sortFilter !== "decrease" ? 1 : 0);

//   // Debounce name filter
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedNameFilter(nameFilter);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [nameFilter]);

//   // Fetch admins from backend
//   const fetchAdmins = useCallback(
//     async (loadMore = false) => {
//       setLoading(true);
//       setError(null);

//       try {
//         const queryParams = new URLSearchParams();

//         queryParams.append("role_type", roleFilter === "all" ? "" : roleFilter);
//         queryParams.append(
//           "sort_order",
//           sortFilter === "decrease" ? "desc" : "asc",
//         );
//         queryParams.append("sort_by", filter);
//         queryParams.append("limit", "20");

//         // Add pagination key for load more
//         if (loadMore && pagination.last_evaluated_key) {
//           queryParams.append(
//             "last_evaluated_key",
//             pagination.last_evaluated_key,
//           );
//         }

//         // Clean up empty params
//         const cleanParams = new URLSearchParams();
//         for (const [key, value] of queryParams.entries()) {
//           if (value && value.trim()) {
//             cleanParams.append(key, value);
//           }
//         }

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/super/admins?${cleanParams.toString()}`,
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
//           setAdmins((prev) => [...prev, ...(data.data?.admins || [])]);
//         } else {
//           // Replace data
//           setAdmins(data.data?.admins || []);
//         }

//         setPagination(
//           data.data?.pagination || {
//             has_more: false,
//             last_evaluated_key: null,
//             limit: 20,
//           },
//         );
//       } catch (err) {
//         setError(err.message);
//         console.error("Failed to fetch admins:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [roleFilter, sortFilter, filter, pagination.last_evaluated_key],
//   );

//   // Search admins (separate endpoint)
//   const searchAdmins = useCallback(async (searchQuery) => {
//     if (!searchQuery.trim()) {
//       await fetchAdmins();
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const queryParams = new URLSearchParams();
//       queryParams.append("q", searchQuery.trim());

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/super/admins/search?${queryParams.toString()}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       setAdmins(data.data?.admins || []);
//       setPagination({
//         has_more: false,
//         last_evaluated_key: null,
//         limit: data.results || 0,
//       });
//     } catch (err) {
//       setError(err.message);
//       console.error("Failed to search admins:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Update admin in local state (optimistic update)
//   const updateAdminInState = useCallback((updatedAdmin) => {
//     setAdmins((prevAdmins) =>
//       prevAdmins.map((admin) =>
//         admin.username === updatedAdmin.username
//           ? { ...admin, ...updatedAdmin }
//           : admin,
//       ),
//     );
//   }, []);

//   // Fetch when filters change (except name filter)
//   useEffect(() => {
//     if (!debouncedNameFilter.trim()) {
//       fetchAdmins();
//     }
//   }, [roleFilter, sortFilter, filter]); // Don't include fetchAdmins in deps to avoid infinite loop

//   // Search when debounced name filter changes
//   useEffect(() => {
//     searchAdmins(debouncedNameFilter);
//   }, [debouncedNameFilter]); // Don't include searchAdmins in deps

//   // Load more handler
//   const handleLoadMore = useCallback(() => {
//     if (pagination.has_more && !loading && !debouncedNameFilter.trim()) {
//       fetchAdmins(true);
//     }
//   }, [pagination.has_more, loading, debouncedNameFilter, fetchAdmins]);

//   // Reset filters
//   const resetFilters = useCallback(() => {
//     setNameFilter("");
//     setFilter("joining_date");
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
//         headerLabel="admins"
//         setNameFilter={setNameFilter}
//         hasActiveFilters={hasActiveFilters}
//         searchPlaceholder="Search Admins..."
//       />

//       <AdminFilterPanel
//         filter={filter}
//         setFilter={setFilter}
//         sortFilter={sortFilter}
//         setSortFilter={setSortFilter}
//         roleFilter={roleFilter}
//         setRoleFilter={setRoleFilter}
//         resetFilters={resetFilters}
//         hasActiveFilters={hasActiveFilters}
//       />

//       <AdminsList
//         error={error}
//         loading={loading}
//         pagination={pagination}
//         admins={admins}
//         onLoadMore={handleLoadMore}
//         resetFilters={resetFilters}
//         hasActiveFilters={hasActiveFilters}
//         totalAdmins={admins.length}
//         isSearchMode={Boolean(debouncedNameFilter.trim())}
//         onAdminUpdate={updateAdminInState}
//       />
//     </div>
//   );
// };

// export default AdminWithFilter;

"use client";

import { useState, useCallback, useEffect } from "react";

import AdminsList from "./AdminsList";
import AdminFilterPanel from "./AdminFilterPanel";

import FilterHeader from "@/components/common/filter/FilterHeader";

const AdminWithFilter = ({ user, initialAdmins, initialPagination }) => {
  const [nameFilter, setNameFilter] = useState("");

  const [filter, setFilter] = useState("reviews");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("decrease");

  const [debouncedNameFilter, setDebouncedNameFilter] = useState("");

  // Data state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState(initialAdmins || []);

  const [pagination, setPagination] = useState(
    initialPagination || {
      has_more: false,
      last_evaluated_key: null,
      limit: 10,
    },
  );

  // Update active filters check
  const hasActiveFilters =
    Boolean(debouncedNameFilter.trim()) ||
    roleFilter !== "all" ||
    filter !== "reviews" ||
    sortFilter !== "decrease";

  const activeFiltersCount =
    (debouncedNameFilter.trim() ? 1 : 0) +
    (roleFilter !== "all" ? 1 : 0) +
    (filter !== "reviews" ? 1 : 0) +
    (sortFilter !== "decrease" ? 1 : 0);

  // Debounce name filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [nameFilter]);

  // Fetch admins from backend
  const fetchAdmins = useCallback(
    async (loadMore = false) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        // Send proper field names to backend
        if (roleFilter !== "all") {
          queryParams.append("role_type", roleFilter);
        }

        queryParams.append(
          "sort_order",
          sortFilter === "decrease" ? "desc" : "asc",
        );
        queryParams.append("sort_by", filter); // This will be "reviews" or "login"
        queryParams.append("limit", "10");

        // Add pagination key for load more
        if (loadMore && pagination.last_evaluated_key) {
          queryParams.append(
            "last_evaluated_key",
            pagination.last_evaluated_key,
          );
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/super/admins?${queryParams.toString()}`,
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
          setAdmins((prev) => [...prev, ...(data.data?.admins || [])]);
        } else {
          // Replace data
          setAdmins(data.data?.admins || []);
        }

        setPagination(
          data.data?.pagination || {
            has_more: false,
            last_evaluated_key: null,
            limit: 20,
          },
        );
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch admins:", err);
      } finally {
        setLoading(false);
      }
    },
    [roleFilter, sortFilter, filter, pagination.last_evaluated_key],
  );

  // Search admins (separate endpoint)
  const searchAdmins = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      await fetchAdmins();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("q", searchQuery.trim());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super/admins/search?${queryParams.toString()}`,
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

      setAdmins(data.data?.admins || []);
      setPagination({
        has_more: false,
        last_evaluated_key: null,
        limit: data.results || 0,
      });
    } catch (err) {
      setError(err.message);
      console.error("Failed to search admins:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update admin in local state (optimistic update)
  const updateAdminInState = useCallback((updatedAdmin) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.username === updatedAdmin.username
          ? { ...admin, ...updatedAdmin }
          : admin,
      ),
    );
  }, []);

  // Fetch when filters change (except name filter)
  useEffect(() => {
    if (!debouncedNameFilter.trim()) {
      fetchAdmins();
    }
  }, [roleFilter, sortFilter, filter]);

  // Search when debounced name filter changes
  useEffect(() => {
    searchAdmins(debouncedNameFilter);
  }, [debouncedNameFilter]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (pagination.has_more && !loading && !debouncedNameFilter.trim()) {
      fetchAdmins(true);
    }
  }, [pagination.has_more, loading, debouncedNameFilter, fetchAdmins]);

  // Reset filters with new defaults
  const resetFilters = useCallback(() => {
    setNameFilter("");
    setFilter("reviews");
    setRoleFilter("all");
    setSortFilter("decrease");
    setDebouncedNameFilter("");
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
      <FilterHeader
        headerLabel="admins"
        role={user.role_type}
        nameFilter={nameFilter}
        linkLabel="Create Admin"
        setNameFilter={setNameFilter}
        hasActiveFilters={hasActiveFilters}
        searchPlaceholder="Search Admins..."
        activeFiltersCount={activeFiltersCount}
        linkHref={`/admin/manage/admins/create`}
      />

      <AdminFilterPanel
        filter={filter}
        setFilter={setFilter}
        sortFilter={sortFilter}
        roleFilter={roleFilter}
        resetFilters={resetFilters}
        setSortFilter={setSortFilter}
        setRoleFilter={setRoleFilter}
        hasActiveFilters={hasActiveFilters}
      />

      <AdminsList
        error={error}
        admins={admins}
        loading={loading}
        pagination={pagination}
        totalAdmins={admins.length}
        onLoadMore={handleLoadMore}
        resetFilters={resetFilters}
        onAdminUpdate={updateAdminInState}
        hasActiveFilters={hasActiveFilters}
        isSearchMode={Boolean(debouncedNameFilter.trim())}
      />
    </div>
  );
};

export default AdminWithFilter;
