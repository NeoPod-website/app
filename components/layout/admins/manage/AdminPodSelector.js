// "use client";

// import { Select, SelectItem } from "@heroui/react";
// import React, { useState, useEffect, useCallback, memo, useMemo } from "react";

// import { languages } from "@/data/langData";

// // Memoized pod item component to prevent unnecessary re-renders
// const PodItem = memo(({ pod }) => {
//   const getLanguageName = (code) => {
//     return languages.find((lang) => lang.code === code)?.name || code;
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <div
//         className={`h-3 w-3 rounded-full ${
//           pod.status === "live"
//             ? "bg-green-500"
//             : pod.status === "draft"
//               ? "bg-yellow-500"
//               : "bg-gray-500"
//         }`}
//       />
//       <span>{pod.name}</span>
//       <span className="text-xs text-gray-400">
//         ({getLanguageName(pod.language)})
//       </span>
//     </div>
//   );
// });

// PodItem.displayName = "PodItem";

// const AdminPodSelector = memo(({ assignedPods = [], onChange }) => {
//   const [error, setError] = useState(null);
//   const [allPods, setAllPods] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Memoized fetch function to prevent recreation
//   const fetchPods = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/pods?limit=100`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         },
//       );

//       if (!res.ok) {
//         throw new Error(`Error ${res.status}: ${res.statusText}`);
//       }

//       const contentType = res.headers.get("content-type");
//       if (!contentType?.includes("application/json")) {
//         throw new Error("Response is not valid JSON");
//       }

//       const data = await res.json();
//       setAllPods(data.data.pods || []);
//     } catch (err) {
//       console.error("Failed to fetch pods:", err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPods();
//   }, [fetchPods]);

//   // Memoized selection change handler
//   const handlePodSelectionChange = useCallback(
//     (keys) => {
//       onChange([...keys]);
//     },
//     [onChange],
//   );

//   // Memoized pod list to prevent unnecessary re-renders
//   const podSelectItems = useMemo(
//     () =>
//       allPods.map((pod) => (
//         <SelectItem
//           key={pod.pod_id}
//           value={pod.pod_id}
//           textValue={`${pod.name} (${languages.find((lang) => lang.code === pod.language)?.name || pod.language})`}
//         >
//           <PodItem pod={pod} />
//         </SelectItem>
//       )),
//     [allPods],
//   );

//   // Early return for error state
//   if (error) {
//     return (
//       <div className="text-sm text-red-500">Error loading pods: {error}</div>
//     );
//   }

//   return (
//     <div>
//       <label
//         htmlFor="pods"
//         className="mb-1 block text-sm font-medium text-white"
//       >
//         Assign Pods (Optional)
//       </label>

//       <Select
//         size="lg"
//         id="pods"
//         variant="bordered"
//         isLoading={isLoading}
//         selectionMode="multiple"
//         aria-label="Assign Pods"
//         selectedKeys={assignedPods}
//         placeholder="Select Pods to Assign"
//         onSelectionChange={handlePodSelectionChange}
//         classNames={{
//           base: "h-auto bg-dark w-full",
//           value: "text-sm",
//           trigger:
//             "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
//         }}
//       >
//         {podSelectItems}
//       </Select>

//       {isLoading && (
//         <p className="mt-1 text-xs text-gray-200">Loading pods...</p>
//       )}

//       <p className="mt-1 text-xs text-gray-300">
//         Pods can also be assigned later from the admin management page
//       </p>
//     </div>
//   );
// });

// AdminPodSelector.displayName = "AdminPodSelector";

// export default AdminPodSelector;

"use client";

import { Select, SelectItem } from "@heroui/react";
import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Package } from "lucide-react";

import { languages } from "@/data/langData";

// Memoized pod item component to prevent unnecessary re-renders
const PodItem = memo(({ pod }) => {
  const getLanguageName = (code) => {
    return languages.find((lang) => lang.code === code)?.name || code;
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full ${
          pod.status === "live"
            ? "bg-green-500"
            : pod.status === "draft"
              ? "bg-yellow-500"
              : "bg-gray-500"
        }`}
      />
      <span>{pod.name}</span>
      <span className="text-xs text-gray-400">
        ({getLanguageName(pod.language)})
      </span>
    </div>
  );
});

PodItem.displayName = "PodItem";

const AdminPodSelector = memo(({ assignedPods = [], onChange }) => {
  const [error, setError] = useState(null);
  const [allPods, setAllPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized fetch function to prevent recreation
  const fetchPods = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pods?limit=100`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Response is not valid JSON");
      }

      const data = await res.json();
      setAllPods(data.data.pods || []);
    } catch (err) {
      console.error("Failed to fetch pods:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPods();
  }, [fetchPods]);

  // Memoized selection change handler
  const handlePodSelectionChange = useCallback(
    (keys) => {
      onChange([...keys]);
    },
    [onChange],
  );

  // Memoized pod list to prevent unnecessary re-renders
  const podSelectItems = useMemo(
    () =>
      allPods.map((pod) => (
        <SelectItem
          key={pod.pod_id}
          value={pod.pod_id}
          textValue={`${pod.name} (${languages.find((lang) => lang.code === pod.language)?.name || pod.language})`}
          className="text-gray-200 hover:bg-gray-700/50"
        >
          <PodItem pod={pod} />
        </SelectItem>
      )),
    [allPods],
  );

  // Early return for error state
  if (error) {
    return (
      <div className="text-sm text-red-500">Error loading pods: {error}</div>
    );
  }

  return (
    <Select
      label="Assign Pods (Optional)"
      isLoading={isLoading}
      selectionMode="multiple"
      placeholder="Select pods to assign"
      selectedKeys={assignedPods}
      startContent={<Package size={18} className="text-gray-400" />}
      onSelectionChange={handlePodSelectionChange}
      description="Pods can also be assigned later from the admin management page"
      classNames={{
        trigger:
          "bg-gray-700/50 border border-gray-600 hover:border-gray-500 h-14",
        value: "text-white",
        label: "text-gray-300 font-medium",
        description: "text-gray-300",
        popoverContent: "bg-black/90 border border-gray-600",
      }}
    >
      {podSelectItems}
    </Select>
  );
});

AdminPodSelector.displayName = "AdminPodSelector";

export default AdminPodSelector;
