// "use client";

// import {
//   X,
//   Save,
//   Trash2,
//   Search,
//   Loader2,
//   AlertCircle,
//   CheckCircle2,
// } from "lucide-react";
// import React, { useState, useEffect, useMemo } from "react";
// import { Button, Select, SelectItem, Input, Chip } from "@heroui/react";

// import MainModal from "./MainModal";

// const STATUS_OPTIONS = [
//   { key: "all", label: "All Statuses" },
//   { key: "pending", label: "Pending" },
//   { key: "approved", label: "Approved" },
//   { key: "rejected", label: "Rejected" },
//   { key: "flagged", label: "Flagged" },
//   { key: "highlighted", label: "Highlighted" },
// ];

// const ORDER_OPTIONS = [
//   { key: "desc", label: "Newest First" },
//   { key: "asc", label: "Oldest First" },
// ];

// const FILTER_TYPES = [
//   { key: "quest_id", label: "Quest" },
//   { key: "category_id", label: "Category" },
//   { key: "reviewer_id", label: "Reviewer" },
//   { key: "ambassador_id", label: "Ambassador" },
// ];

// const SubmissionFilterModal = ({
//   isOpen,
//   onClose,
//   quests = [],
//   applyFilters,
//   clearFilters,
//   onQuestSearch,
//   currentFilters,
//   reviewers = [],
//   categories = [],
//   ambassadors = [],
//   onCategorySearch,
//   onAmbassadorSearch,
//   errors = { categories: null, quests: null },
//   loading = { categories: false, quests: false },
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [tempFilters, setTempFilters] = useState(currentFilters);
//   const [selectedFilterType, setSelectedFilterType] = useState("quest_id");

//   const [applyLoading, setApplyLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       setTempFilters(currentFilters);
//       setSearchQuery("");
//       setSelectedFilterType(currentFilters.primaryFilterKey || "quest_id");
//     }
//   }, [currentFilters, isOpen]);

//   // Debounce search for quests
//   useEffect(() => {
//     if (selectedFilterType !== "quest_id" || !onQuestSearch) return;

//     const timer = setTimeout(() => {
//       onQuestSearch(searchQuery);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery, selectedFilterType, onQuestSearch]);

//   // Debounce search for categories
//   useEffect(() => {
//     if (selectedFilterType !== "category_id" || !onCategorySearch) return;

//     const timer = setTimeout(() => {
//       onCategorySearch(searchQuery);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery, selectedFilterType, onCategorySearch]);

//   useEffect(() => {
//     if (selectedFilterType !== "ambassador_id" || !onAmbassadorSearch) return;

//     // Don't search if less than 3 characters
//     if (!searchQuery || searchQuery.trim().length < 3) {
//       return;
//     }

//     const timer = setTimeout(() => {
//       onAmbassadorSearch(searchQuery);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery, selectedFilterType, onAmbassadorSearch]);

//   const handlePrimaryFilterChange = (value) => {
//     if (value) {
//       setTempFilters((prev) => ({
//         ...prev,
//         primaryFilterKey: selectedFilterType,
//         primaryFilterValue: value,
//       }));
//     } else {
//       setTempFilters((prev) => ({
//         ...prev,
//         primaryFilterKey: null,
//         primaryFilterValue: null,
//       }));
//     }
//   };

//   const handleStatusChange = (keys) => {
//     const selectedKey = Array.from(keys)[0];
//     setTempFilters((prev) => ({
//       ...prev,
//       status: selectedKey || "all",
//     }));
//   };

//   const handleOrderChange = (keys) => {
//     const selectedKey = Array.from(keys)[0];
//     setTempFilters((prev) => ({
//       ...prev,
//       order: selectedKey || "desc",
//     }));
//   };

//   const handleApply = async () => {
//     try {
//       setApplyLoading(true);
//       await applyFilters(tempFilters);
//       onClose();
//     } catch (error) {
//       console.error("Error applying filters:", error);
//     } finally {
//       setApplyLoading(false);
//     }
//   };

//   const handleClear = () => {
//     const newFilters = {
//       primaryFilterKey: null,
//       primaryFilterValue: null,
//       status: "all",
//       order: "desc",
//     };
//     setTempFilters(newFilters);
//     clearFilters(newFilters);
//     setSearchQuery("");
//   };

//   const handleFilterTypeChange = (keys) => {
//     const selectedKey = Array.from(keys)[0];
//     if (selectedKey) {
//       setSelectedFilterType(selectedKey);
//       setSearchQuery("");
//       if (tempFilters.primaryFilterKey !== selectedKey) {
//         setTempFilters((prev) => ({
//           ...prev,
//           primaryFilterKey: null,
//           primaryFilterValue: null,
//         }));
//       }
//     }
//   };

//   const hasActivePrimaryFilter = !!tempFilters.primaryFilterKey;
//   const hasPendingChanges =
//     JSON.stringify(currentFilters) !== JSON.stringify(tempFilters);
//   const hasActiveFilters =
//     hasActivePrimaryFilter ||
//     tempFilters.status !== "all" ||
//     tempFilters.order !== "desc";

//   const getCurrentData = () => {
//     switch (selectedFilterType) {
//       case "quest_id":
//         return quests;
//       case "category_id":
//         return categories;
//       case "reviewer_id":
//         return reviewers;
//       case "ambassador_id":
//         return ambassadors;
//       default:
//         return [];
//     }
//   };

//   const getCurrentLoading = () => {
//     switch (selectedFilterType) {
//       case "quest_id":
//         return loading.quests;
//       case "category_id":
//         return loading.categories;
//       case "ambassador_id":
//         return loading.ambassadors;
//       default:
//         return false;
//     }
//   };

//   const getCurrentError = () => {
//     switch (selectedFilterType) {
//       case "quest_id":
//         return errors.quests;
//       case "category_id":
//         return errors.categories;
//       case "ambassador_id":
//         return errors.ambassadors;
//       default:
//         return null;
//     }
//   };

//   const filteredData = useMemo(() => {
//     const data = getCurrentData();

//     if (
//       selectedFilterType === "quest_id" ||
//       selectedFilterType === "category_id" ||
//       selectedFilterType === "ambassador_id"
//     ) {
//       return data;
//     }

//     if (!searchQuery) return data;

//     return data.filter((item) => {
//       const name = item.name || item.quest_name || item.category_name || "";
//       return name.toLowerCase().includes(searchQuery.toLowerCase());
//     });
//   }, [
//     searchQuery,
//     selectedFilterType,
//     quests,
//     categories,
//     reviewers,
//     ambassadors,
//   ]);

//   const getActiveFilterLabel = () => {
//     if (!hasActivePrimaryFilter) return null;
//     const filterType = FILTER_TYPES.find(
//       (ft) => ft.key === tempFilters.primaryFilterKey,
//     );
//     const allData = {
//       quest_id: quests,
//       category_id: categories,
//       reviewer_id: reviewers,
//       ambassador_id: ambassadors,
//     };
//     const data = allData[tempFilters.primaryFilterKey] || [];
//     const item = data.find(
//       (d) =>
//         d.id === tempFilters.primaryFilterValue ||
//         d.quest_id === tempFilters.primaryFilterValue ||
//         d.category_id === tempFilters.primaryFilterValue,
//     );
//     return {
//       type: filterType?.label,
//       name: item?.name || item?.quest_name || item?.category_name,
//     };
//   };

//   const activeFilter = getActiveFilterLabel();
//   const isLoading = getCurrentLoading();
//   const error = getCurrentError();

//   const LoadingState = () => (
//     <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
//       <Loader2 size={16} className="animate-spin" />
//       <span>Loading...</span>
//     </div>
//   );

//   const ErrorState = ({ message }) => (
//     <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
//       <AlertCircle size={16} className="flex-shrink-0" />
//       <span>{message}</span>
//     </div>
//   );

//   const EmptyState = () => {
//     if (selectedFilterType === "ambassador_id") {
//       if (!searchQuery || searchQuery.trim().length < 3) {
//         return (
//           <div className="py-8 text-center text-sm text-gray-500">
//             Type at least 3 characters to search ambassadors
//           </div>
//         );
//       }
//       return (
//         <div className="py-8 text-center text-sm text-gray-500">
//           No ambassadors found for "{searchQuery}"
//         </div>
//       );
//     }

//     return (
//       <div className="py-8 text-center text-sm text-gray-500">
//         No{" "}
//         {FILTER_TYPES.find(
//           (ft) => ft.key === selectedFilterType,
//         )?.label.toLowerCase()}
//         s available
//       </div>
//     );
//   };

//   const footer = (
//     <>
//       <div className="flex items-center gap-2">
//         {hasActiveFilters && (
//           <Chip color="primary" variant="flat" size="sm">
//             {hasActivePrimaryFilter ? "1 filter active" : "Status/Order only"}
//           </Chip>
//         )}
//       </div>

//       <div className="flex gap-2">
//         <Button
//           size="sm"
//           variant="light"
//           onPress={handleClear}
//           disabled={applyLoading || !hasActiveFilters}
//           color="danger"
//           startContent={<Trash2 size={14} />}
//         >
//           Clear
//         </Button>

//         <Button
//           size="sm"
//           color="primary"
//           onPress={handleApply}
//           disabled={applyLoading || !hasPendingChanges}
//           isLoading={applyLoading}
//           className="bg-blue-600 hover:bg-blue-700"
//           startContent={!applyLoading && <Save size={14} />}
//         >
//           {applyLoading ? "Applying..." : "Apply"}
//         </Button>
//       </div>
//     </>
//   );

//   return (
//     <MainModal
//       size="3xl"
//       isOpen={isOpen}
//       footer={footer}
//       showFooter={true}
//       handleOnClose={onClose}
//       title="Filter Submissions"
//       description="Configure status, order, and select one primary filter option."
//     >
//       <div className="space-y-5">
//         {activeFilter && (
//           <div className="bg-blue-500/10 flex items-center justify-between rounded-lg border border-blue-500/30 px-4 py-2.5">
//             <div className="flex items-center gap-2">
//               <CheckCircle2 className="text-blue-400" size={16} />

//               <span className="text-sm text-white">
//                 <span className="text-gray-400">{activeFilter.type}:</span>{" "}
//                 {activeFilter.name}
//               </span>
//             </div>

//             <Button
//               size="sm"
//               isIconOnly
//               color="danger"
//               variant="light"
//               onPress={onClose}
//             >
//               <X size={14} />
//             </Button>
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-3">
//           <Select
//             label="Status"
//             size="sm"
//             selectedKeys={new Set([tempFilters.status])}
//             onSelectionChange={handleStatusChange}
//           >
//             {STATUS_OPTIONS.map((option) => (
//               <SelectItem key={option.key}>{option.label}</SelectItem>
//             ))}
//           </Select>

//           <Select
//             label="Order"
//             size="sm"
//             selectedKeys={new Set([tempFilters.order])}
//             onSelectionChange={handleOrderChange}
//           >
//             {ORDER_OPTIONS.map((option) => (
//               <SelectItem key={option.key}>{option.label}</SelectItem>
//             ))}
//           </Select>
//         </div>

//         <div className="border-t border-gray-800 pt-4">
//           <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-200">
//             Primary Filter (Select One)
//           </p>

//           <div className="mb-4 grid grid-cols-5 gap-3">
//             <div className="col-span-3">
//               <Input
//                 size="sm"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 startContent={<Search size={16} className="text-gray-400" />}
//                 placeholder={
//                   selectedFilterType === "ambassador_id"
//                     ? "Type at least 3 characters to search..."
//                     : `Search ${FILTER_TYPES.find((ft) => ft.key === selectedFilterType)?.label.toLowerCase()}s...`
//                 }
//                 classNames={{
//                   base: "",
//                   inputWrapper: "bg-gray-800/50 border-gray-700 h-12",
//                 }}
//               />
//             </div>

//             <div className="col-span-2">
//               <Select
//                 label="Filter by"
//                 size="sm"
//                 selectedKeys={new Set([selectedFilterType])}
//                 onSelectionChange={handleFilterTypeChange}
//               >
//                 {FILTER_TYPES.map((type) => (
//                   <SelectItem key={type.key}>{type.label}</SelectItem>
//                 ))}
//               </Select>
//             </div>
//           </div>

//           <div className="thin-scrollbar max-h-36 overflow-y-auto rounded-lg border border-gray-600 bg-gray-700/30">
//             {isLoading ? (
//               <LoadingState />
//             ) : error ? (
//               <div className="p-3">
//                 <ErrorState message={error} />
//               </div>
//             ) : filteredData.length === 0 ? (
//               <EmptyState />
//             ) : (
//               <>
//                 <div className="divide-y divide-gray-600">
//                   {filteredData.map((item) => {
//                     const itemId = item.quest_id || item.category_id || item.id;
//                     const itemName =
//                       item.name || item.quest_name || item.category_name;
//                     const isSelected =
//                       tempFilters.primaryFilterKey === selectedFilterType &&
//                       tempFilters.primaryFilterValue === itemId;

//                     return (
//                       <button
//                         key={itemId}
//                         onClick={() => handlePrimaryFilterChange(itemId)}
//                         className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-700/50 ${
//                           isSelected
//                             ? "bg-blue-500/20 text-blue-400"
//                             : "text-gray-100"
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium">{itemName}</span>
//                           {isSelected && (
//                             <CheckCircle2 size={16} className="text-blue-400" />
//                           )}
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <div className="border-t border-gray-700 bg-gray-700/50 px-4 py-2 text-xs text-gray-200">
//                   {searchQuery ? (
//                     <>
//                       Showing {filteredData.length} of {getCurrentData().length}{" "}
//                       result{filteredData.length !== 1 ? "s" : ""}
//                     </>
//                   ) : (
//                     <>
//                       {filteredData.length}{" "}
//                       {FILTER_TYPES.find(
//                         (ft) => ft.key === selectedFilterType,
//                       )?.label.toLowerCase()}
//                       {filteredData.length !== 1 ? "s" : ""} available
//                     </>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </MainModal>
//   );
// };

// export default SubmissionFilterModal;

"use client";

import {
  X,
  Save,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Select, SelectItem, Input, Chip } from "@heroui/react";

import MainModal from "./MainModal";

const STATUS_OPTIONS = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "flagged", label: "Flagged" },
  { key: "highlighted", label: "Highlighted" },
];

const ORDER_OPTIONS = [
  { key: "desc", label: "Newest First" },
  { key: "asc", label: "Oldest First" },
];

const FILTER_TYPES = [
  { key: "quest_id", label: "Quest" },
  { key: "category_id", label: "Category" },
  { key: "reviewer_id", label: "Reviewer" },
  { key: "ambassador_id", label: "Ambassador" },
];

const DEFAULT_FILTERS = {
  primaryFilterKey: null,
  primaryFilterValue: null,
  status: "all",
  order: "desc",
};

const DEBOUNCE_DELAY = 500;
const AMBASSADOR_MIN_CHARS = 3;

const getItemId = (item) => item.quest_id || item.category_id || item.id;

const getItemName = (item) =>
  item.name || item.quest_name || item.category_name;

const findItemById = (data, id) =>
  data.find((d) => d.id === id || d.quest_id === id || d.category_id === id);

const LoadingState = () => (
  <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
    <Loader2 size={16} className="animate-spin" />
    <span>Loading...</span>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
    <AlertCircle size={16} className="flex-shrink-0" />
    <span>{message}</span>
  </div>
);

const EmptyState = ({ selectedFilterType, searchQuery }) => {
  if (selectedFilterType === "ambassador_id") {
    if (!searchQuery || searchQuery.trim().length < AMBASSADOR_MIN_CHARS) {
      return (
        <div className="py-8 text-center text-sm text-gray-500">
          Type at least {AMBASSADOR_MIN_CHARS} characters to search ambassadors
        </div>
      );
    }
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No ambassadors found for "{searchQuery}"
      </div>
    );
  }

  const filterLabel = FILTER_TYPES.find(
    (ft) => ft.key === selectedFilterType,
  )?.label.toLowerCase();
  return (
    <div className="py-8 text-center text-sm text-gray-500">
      No {filterLabel}s available
    </div>
  );
};

const FilterItem = ({ item, isSelected, onClick }) => {
  const itemId = getItemId(item);
  const itemName = getItemName(item);

  return (
    <button
      key={itemId}
      onClick={() => onClick(itemId)}
      className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-700/50 ${
        isSelected ? "bg-blue-500/20 text-blue-400" : "text-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{itemName}</span>
        {isSelected && <CheckCircle2 size={16} className="text-blue-400" />}
      </div>
    </button>
  );
};

const FilterListFooter = ({
  filteredCount,
  totalCount,
  searchQuery,
  selectedFilterType,
}) => {
  const filterLabel = FILTER_TYPES.find(
    (ft) => ft.key === selectedFilterType,
  )?.label.toLowerCase();

  return (
    <div className="border-t border-gray-700 bg-gray-700/50 px-4 py-2 text-xs text-gray-200">
      {searchQuery ? (
        <>
          Showing {filteredCount} of {totalCount} result
          {filteredCount !== 1 ? "s" : ""}
        </>
      ) : (
        <>
          {filteredCount} {filterLabel}
          {filteredCount !== 1 ? "s" : ""} available
        </>
      )}
    </div>
  );
};

const ActiveFilterBanner = ({ activeFilter, onClose }) => (
  <div className="bg-blue-500/10 flex items-center justify-between rounded-lg border border-blue-500/30 px-4 py-2.5">
    <div className="flex items-center gap-2">
      <CheckCircle2 className="text-blue-400" size={16} />
      <span className="text-sm text-white">
        <span className="text-gray-400">{activeFilter.type}:</span>{" "}
        {activeFilter.name}
      </span>
    </div>
    <Button
      size="sm"
      isIconOnly
      color="danger"
      variant="light"
      onPress={onClose}
    >
      <X size={14} />
    </Button>
  </div>
);

const useDebounce = (callback, delay) => {
  useEffect(() => {
    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [callback, delay]);
};

const useFilterData = (
  selectedFilterType,
  { quests, categories, reviewers, ambassadors },
) => {
  const dataMap = useMemo(
    () => ({
      quest_id: quests,
      category_id: categories,
      reviewer_id: reviewers,
      ambassador_id: ambassadors,
    }),
    [quests, categories, reviewers, ambassadors],
  );

  return dataMap[selectedFilterType] || [];
};

const useFilterState = (selectedFilterType, { loading, errors }) => {
  const loadingMap = useMemo(
    () => ({
      quest_id: loading.quests,
      category_id: loading.categories,
      ambassador_id: loading.ambassadors,
      reviewer_id: false,
    }),
    [loading],
  );

  const errorMap = useMemo(
    () => ({
      quest_id: errors.quests,
      category_id: errors.categories,
      ambassador_id: errors.ambassadors,
      reviewer_id: null,
    }),
    [errors],
  );

  return {
    isLoading: loadingMap[selectedFilterType] || false,
    error: errorMap[selectedFilterType] || null,
  };
};

const SubmissionFilterModal = ({
  isOpen,
  onClose,
  currentFilters,
  applyFilters,
  clearFilters,
  quests = [],
  categories = [],
  reviewers = [],
  ambassadors = [],
  loading = {},
  errors = {},
  onQuestSearch,
  onCategorySearch,
  onAmbassadorSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempFilters, setTempFilters] = useState(currentFilters);
  const [selectedFilterType, setSelectedFilterType] = useState("quest_id");
  const [applyLoading, setApplyLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempFilters(currentFilters);
      setSearchQuery("");
      setSelectedFilterType(currentFilters.primaryFilterKey || "quest_id");
    }
  }, [currentFilters, isOpen]);

  // Debounced search effects
  useDebounce(() => {
    if (selectedFilterType === "quest_id" && onQuestSearch) {
      onQuestSearch(searchQuery);
    }
  }, DEBOUNCE_DELAY);

  useDebounce(() => {
    if (selectedFilterType === "category_id" && onCategorySearch) {
      onCategorySearch(searchQuery);
    }
  }, DEBOUNCE_DELAY);

  useDebounce(() => {
    if (
      selectedFilterType === "ambassador_id" &&
      onAmbassadorSearch &&
      searchQuery?.trim().length >= AMBASSADOR_MIN_CHARS
    ) {
      onAmbassadorSearch(searchQuery);
    }
  }, DEBOUNCE_DELAY);

  // Get current data and state
  const currentData = useFilterData(selectedFilterType, {
    quests,
    categories,
    reviewers,
    ambassadors,
  });
  const { isLoading, error } = useFilterState(selectedFilterType, {
    loading,
    errors,
  });

  // Filter data based on search for reviewers only
  const filteredData = useMemo(() => {
    if (selectedFilterType !== "reviewer_id" || !searchQuery) {
      return currentData;
    }

    return currentData.filter((item) => {
      const name = getItemName(item);
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [currentData, searchQuery, selectedFilterType]);

  // Compute derived states
  const hasActivePrimaryFilter = !!tempFilters.primaryFilterKey;
  const hasPendingChanges =
    JSON.stringify(currentFilters) !== JSON.stringify(tempFilters);
  const hasActiveFilters =
    hasActivePrimaryFilter ||
    tempFilters.status !== "all" ||
    tempFilters.order !== "desc";

  // Get active filter label
  const activeFilter = useMemo(() => {
    if (!hasActivePrimaryFilter) return null;

    const filterType = FILTER_TYPES.find(
      (ft) => ft.key === tempFilters.primaryFilterKey,
    );
    const dataMap = {
      quest_id: quests,
      category_id: categories,
      reviewer_id: reviewers,
      ambassador_id: ambassadors,
    };
    const data = dataMap[tempFilters.primaryFilterKey] || [];
    const item = findItemById(data, tempFilters.primaryFilterValue);

    return {
      type: filterType?.label,
      name: getItemName(item),
    };
  }, [
    hasActivePrimaryFilter,
    tempFilters,
    quests,
    categories,
    reviewers,
    ambassadors,
  ]);

  // Event handlers
  const handlePrimaryFilterChange = useCallback(
    (value) => {
      setTempFilters((prev) =>
        value
          ? {
              ...prev,
              primaryFilterKey: selectedFilterType,
              primaryFilterValue: value,
            }
          : { ...prev, primaryFilterKey: null, primaryFilterValue: null },
      );
    },
    [selectedFilterType],
  );

  const handleStatusChange = useCallback((keys) => {
    const selectedKey = Array.from(keys)[0];
    setTempFilters((prev) => ({ ...prev, status: selectedKey || "all" }));
  }, []);

  const handleOrderChange = useCallback((keys) => {
    const selectedKey = Array.from(keys)[0];
    setTempFilters((prev) => ({ ...prev, order: selectedKey || "desc" }));
  }, []);

  const handleFilterTypeChange = useCallback((keys) => {
    const selectedKey = Array.from(keys)[0];
    if (selectedKey) {
      setSelectedFilterType(selectedKey);
      setSearchQuery("");
      setTempFilters((prev) =>
        prev.primaryFilterKey !== selectedKey
          ? { ...prev, primaryFilterKey: null, primaryFilterValue: null }
          : prev,
      );
    }
  }, []);

  const handleApply = useCallback(async () => {
    try {
      setApplyLoading(true);
      await applyFilters(tempFilters);
      onClose();
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setApplyLoading(false);
    }
  }, [tempFilters, applyFilters, onClose]);

  const handleClear = useCallback(() => {
    setTempFilters(DEFAULT_FILTERS);
    clearFilters(DEFAULT_FILTERS);
    setSearchQuery("");
  }, [clearFilters]);

  // Modal footer
  const footer = useMemo(
    () => (
      <>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Chip color="primary" variant="flat" size="sm">
              {hasActivePrimaryFilter ? "1 filter active" : "Status/Order only"}
            </Chip>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="light"
            onPress={handleClear}
            disabled={applyLoading || !hasActiveFilters}
            color="danger"
            startContent={<Trash2 size={14} />}
          >
            Clear
          </Button>

          <Button
            size="sm"
            color="primary"
            onPress={handleApply}
            disabled={applyLoading || !hasPendingChanges}
            isLoading={applyLoading}
            className="bg-blue-600 hover:bg-blue-700"
            startContent={!applyLoading && <Save size={14} />}
          >
            {applyLoading ? "Applying..." : "Apply"}
          </Button>
        </div>
      </>
    ),
    [
      hasActiveFilters,
      hasActivePrimaryFilter,
      applyLoading,
      hasPendingChanges,
      handleClear,
      handleApply,
    ],
  );

  return (
    <MainModal
      size="3xl"
      isOpen={isOpen}
      footer={footer}
      showFooter={true}
      handleOnClose={onClose}
      title="Filter Submissions"
      description="Configure status, order, and select one primary filter option."
    >
      <div className="space-y-5">
        {activeFilter && (
          <ActiveFilterBanner activeFilter={activeFilter} onClose={onClose} />
        )}

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            size="sm"
            selectedKeys={new Set([tempFilters.status])}
            onSelectionChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>

          <Select
            label="Order"
            size="sm"
            selectedKeys={new Set([tempFilters.order])}
            onSelectionChange={handleOrderChange}
          >
            {ORDER_OPTIONS.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-200">
            Primary Filter (Select One)
          </p>

          <div className="mb-4 grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <Input
                size="sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search size={16} className="text-gray-400" />}
                placeholder={
                  selectedFilterType === "ambassador_id"
                    ? `Type at least ${AMBASSADOR_MIN_CHARS} characters to search...`
                    : `Search ${FILTER_TYPES.find((ft) => ft.key === selectedFilterType)?.label.toLowerCase()}s...`
                }
                classNames={{
                  inputWrapper: "bg-gray-800/50 border-gray-700 h-12",
                }}
              />
            </div>

            <div className="col-span-2">
              <Select
                label="Filter by"
                size="sm"
                selectedKeys={new Set([selectedFilterType])}
                onSelectionChange={handleFilterTypeChange}
              >
                {FILTER_TYPES.map((type) => (
                  <SelectItem key={type.key}>{type.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="thin-scrollbar max-h-36 overflow-y-auto rounded-lg border border-gray-600 bg-gray-700/30">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <div className="p-3">
                <ErrorState message={error} />
              </div>
            ) : filteredData.length === 0 ? (
              <EmptyState
                selectedFilterType={selectedFilterType}
                searchQuery={searchQuery}
              />
            ) : (
              <>
                <div className="divide-y divide-gray-600">
                  {filteredData.map((item) => {
                    const itemId = getItemId(item);
                    const isSelected =
                      tempFilters.primaryFilterKey === selectedFilterType &&
                      tempFilters.primaryFilterValue === itemId;

                    return (
                      <FilterItem
                        key={itemId}
                        item={item}
                        isSelected={isSelected}
                        onClick={handlePrimaryFilterChange}
                      />
                    );
                  })}
                </div>

                <FilterListFooter
                  filteredCount={filteredData.length}
                  totalCount={currentData.length}
                  searchQuery={searchQuery}
                  selectedFilterType={selectedFilterType}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default SubmissionFilterModal;
