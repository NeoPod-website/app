"use client";

import React, { useState, useEffect } from "react";
import { Save, X, AlertTriangle } from "lucide-react";
import { Button, Select, SelectItem, Avatar, Textarea } from "@heroui/react";

import MainModal from "@/components/ui/modals/MainModal";

const ROLE_OPTIONS = [
  { value: "initiate", label: "Initiate" },
  { value: "operator", label: "Operator" },
  { value: "sentinel", label: "Sentinel" },
  { value: "architect", label: "Architect" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const EditAmbassadorModal = ({
  isOpen,
  onClose,
  ambassador,
  podId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const [banReason, setBanReason] = useState("");
  const [status, setStatus] = useState(ambassador?.status || "active");
  const [roleType, setRoleType] = useState(ambassador?.role_type || "initiate");

  const [error, setError] = useState("");

  // Reset form when ambassador changes or modal opens
  useEffect(() => {
    if (ambassador && isOpen) {
      setError("");
      setBanReason("");
      setStatus(ambassador.status || "active");
      setRoleType(ambassador.role_type || "initiate");
    }
  }, [ambassador, isOpen]);

  const handleSave = async () => {
    if (!ambassador) return;

    const isSuspending =
      status === "suspended" && ambassador?.status !== "suspended";

    if (isSuspending && !banReason.trim()) {
      setError("Ban reason is required when suspending an ambassador");
      return;
    }

    if (isSuspending && banReason.trim().length < 10) {
      setError("Ban reason must be at least 10 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare update payload - only include changed fields
      const updatePayload = {};

      if (roleType !== ambassador.role_type) {
        updatePayload.role_type = roleType;
      }

      if (status !== ambassador.status) {
        updatePayload.status = status;
      }

      if (isSuspending) {
        updatePayload.ban_reason = banReason.trim();
      }

      // Include joining_date and pod_id for optimal performance
      updatePayload.joining_date = ambassador.joining_date;
      updatePayload.pod_id = podId; // Use the podId prop passed from parent

      // Only make API call if there are changes
      if (updatePayload.role_type || updatePayload.status) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/admin/update/${ambassador.ambassador_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updatePayload),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();

          throw new Error(
            errorData.message ||
              `Failed to update ambassador (${response.status})`,
          );
        }

        // Optionally use the returned updated ambassador data
        const responseData = await response.json();
        console.log("Update successful:", responseData);
      }

      // Create updated ambassador object
      const updatedAmbassador = {
        ...ambassador,
        role_type: roleType,
        status: status,
      };

      // Call success callback with updated ambassador
      onSuccess(updatedAmbassador);
    } catch (err) {
      setError(err.message);
      console.error("Failed to update ambassador:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      setBanReason("");

      // Reset to current ambassador values
      setStatus(ambassador?.status || "active");
      setRoleType(ambassador?.role_type || "initiate");

      onClose();
    }
  };

  const hasChanges =
    roleType !== ambassador?.role_type || status !== ambassador?.status;

  const isSuspending =
    status === "suspended" && ambassador?.status !== "suspended";

  const footer = (
    <>
      <Button
        variant="light"
        disabled={loading}
        onPress={handleClose}
        startContent={<X size={16} />}
        className="text-gray-300 hover:text-white"
      >
        Cancel
      </Button>

      <Button
        color="primary"
        isLoading={loading}
        onPress={handleSave}
        className="bg-blue-600 hover:bg-blue-700"
        startContent={!loading && <Save size={16} />}
        disabled={loading || !hasChanges || (isSuspending && !banReason.trim())}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </>
  );

  return (
    <MainModal
      size="lg"
      isOpen={isOpen}
      footer={footer}
      showFooter={true}
      onClose={handleClose}
      title="Edit Ambassador"
      handleOnClose={handleClose}
      description="Update ambassador role and status settings"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-lg bg-gray-800/50 p-4">
          <Avatar
            size="lg"
            src={ambassador?.profile_photo}
            name={ambassador?.username?.charAt(0)?.toUpperCase()}
            className="shrink-0"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold capitalize text-white">
                {ambassador?.username || "Unknown User"}
              </h3>

              {ambassador?.is_verified && (
                <span className="text-blue-400">✓</span>
              )}
            </div>

            <p className="text-sm text-gray-200">
              {ambassador?.email || "No email"}
            </p>

            <div className="mt-1 flex items-center gap-4 text-xs text-gray-300">
              <span>
                ID: {ambassador?.ambassador_id?.slice(-6) || "Unknown"}
              </span>

              <span>
                Points: {ambassador?.total_points?.toLocaleString() || "0"}
              </span>

              <span>Quests: {ambassador?.total_quests_completed || "0"}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Select
            label="Role Type"
            disabled={loading}
            selectedKeys={[roleType]}
            placeholder="Select role type"
            onSelectionChange={(keys) => setRoleType(Array.from(keys)[0])}
            classNames={{
              trigger:
                "bg-gray-800/50 border border-gray-600 hover:border-gray-500",
              value: "text-white",
              popoverContent: "bg-black/90 border border-gray-600",
            }}
          >
            {ROLE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-200 hover:bg-gray-700/50"
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>

          {ambassador?.status === "suspended" && (
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/20 p-4">
              <div className="flex items-center gap-2 text-orange-300">
                <AlertTriangle size={16} />

                <h4 className="font-medium">Currently Suspended</h4>
              </div>

              <p className="mt-1 text-sm text-orange-200">
                This ambassador is currently suspended. Changing status to
                "Active" or "Inactive" will unsuspend them.
              </p>
            </div>
          )}

          <Select
            label="Status"
            disabled={loading}
            selectedKeys={[status]}
            placeholder="Select status"
            onSelectionChange={(keys) => setStatus(Array.from(keys)[0])}
            classNames={{
              trigger:
                "bg-gray-800/50 border border-gray-600 hover:border-gray-500",
              value: "text-white",
              popoverContent: "bg-black/90 border border-gray-600",
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-200 hover:bg-gray-700/50"
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>

          {isSuspending && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-300">
                <AlertTriangle size={16} />

                <label className="text-sm font-medium">
                  Ban Reason (Required)
                </label>
              </div>

              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Explain why this ambassador is being suspended..."
                disabled={loading}
                minRows={2}
                className="w-full"
                classNames={{
                  input: "bg-gray-800/50 text-white",
                  inputWrapper: "border border-gray-600 hover:border-gray-500",
                }}
              />

              <div className="text-xs text-gray-300">
                {banReason.length}/10 characters minimum
              </div>
            </div>
          )}
        </div>

        {hasChanges && (
          <div className="bg-blue-500/20 rounded-lg border border-blue-500/30 p-3">
            <h4 className="mb-2 text-sm font-medium text-blue-300">
              Pending Changes:
            </h4>

            <ul className="space-y-1 text-xs text-blue-200">
              {roleType !== ambassador?.role_type && (
                <li>
                  • Role: {ambassador?.role_type} → {roleType}
                </li>
              )}

              {status !== ambassador?.status && (
                <li>
                  • Status: {ambassador?.status} → {status}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </MainModal>
  );
};

export default EditAmbassadorModal;

// "use client";

// import { Save, X, AlertTriangle, Shield, UserX } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { Button, Select, SelectItem, Avatar, Textarea } from "@heroui/react";

// import MainModal from "@/components/ui/modals/MainModal";

// const ROLE_OPTIONS = [
//   { value: "initiate", label: "Initiate" },
//   { value: "operator", label: "Operator" },
//   { value: "sentinel", label: "Sentinel" },
//   { value: "architect", label: "Architect" },
// ];

// const STATUS_OPTIONS = [
//   { value: "active", label: "Active" },
//   { value: "inactive", label: "Inactive" },
//   { value: "suspended", label: "Suspended" },
// ];

// const EditAmbassadorModal = ({
//   isOpen,
//   onClose,
//   ambassador,
//   podId,
//   onSuccess,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState(ambassador?.status || "active");
//   const [roleType, setRoleType] = useState(ambassador?.role_type || "initiate");
//   const [banReason, setBanReason] = useState("");
//   const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
//   const [error, setError] = useState("");

//   // Reset form when ambassador changes or modal opens
//   useEffect(() => {
//     if (ambassador && isOpen) {
//       setRoleType(ambassador.role_type || "initiate");
//       setStatus(ambassador.status || "active");
//       setBanReason("");
//       setShowSuspendConfirm(false);
//       setError("");
//     }
//   }, [ambassador, isOpen]);

//   // Show/hide suspension confirmation when status changes
//   useEffect(() => {
//     if (status === "suspended" && ambassador?.status !== "suspended") {
//       setShowSuspendConfirm(true);
//     } else {
//       setShowSuspendConfirm(false);
//       setBanReason("");
//     }
//   }, [status, ambassador?.status]);

//   const handleSave = async () => {
//     if (!ambassador) return;

//     // Validate suspension requires ban reason
//     if (
//       status === "suspended" &&
//       ambassador?.status !== "suspended" &&
//       !banReason.trim()
//     ) {
//       setError("Ban reason is required when suspending an ambassador");
//       return;
//     }

//     if (status === "suspended" && banReason.trim().length < 10) {
//       setError("Ban reason must be at least 10 characters long");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Prepare update payload
//       const updatePayload = {};

//       if (roleType !== ambassador.role_type) {
//         updatePayload.role_type = roleType;
//       }

//       if (status !== ambassador.status) {
//         updatePayload.status = status;
//       }

//       // Add ban reason if suspending
//       if (status === "suspended" && ambassador?.status !== "suspended") {
//         updatePayload.ban_reason = banReason.trim();
//       }

//       // Include joining_date and pod_id for optimal performance
//       updatePayload.joining_date = ambassador.joining_date;
//       updatePayload.pod_id = podId;

//       // Only make API call if there are changes
//       if (updatePayload.role_type || updatePayload.status) {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/admin/update/${ambassador.ambassador_id}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//             body: JSON.stringify(updatePayload),
//           },
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             errorData.message ||
//               `Failed to update ambassador (${response.status})`,
//           );
//         }

//         const responseData = await response.json();
//         console.log("Update successful:", responseData);

//         // Show success message for suspensions
//         if (status === "suspended" && ambassador?.status !== "suspended") {
//           console.log("Ambassador suspended successfully");
//         }
//       }

//       // Create updated ambassador object
//       const updatedAmbassador = {
//         ...ambassador,
//         role_type: roleType,
//         status: status,
//         ...(status === "suspended" && { ban_reason: banReason }),
//       };

//       // Call success callback with updated ambassador
//       onSuccess(updatedAmbassador);
//     } catch (err) {
//       setError(err.message);
//       console.error("Failed to update ambassador:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     if (!loading) {
//       setError("");
//       setBanReason("");
//       setShowSuspendConfirm(false);
//       // Reset to current ambassador values
//       setRoleType(ambassador?.role_type || "initiate");
//       setStatus(ambassador?.status || "active");
//       onClose();
//     }
//   };

//   const hasChanges =
//     roleType !== ambassador?.role_type || status !== ambassador?.status;

//   const isSuspending =
//     status === "suspended" && ambassador?.status !== "suspended";
//   const isUnsuspending =
//     status !== "suspended" && ambassador?.status === "suspended";

//   const footer = (
//     <>
//       <Button
//         variant="light"
//         onPress={handleClose}
//         disabled={loading}
//         className="text-gray-300 hover:text-white"
//         startContent={<X size={16} />}
//       >
//         Cancel
//       </Button>

//       <Button
//         color={isSuspending ? "danger" : "primary"}
//         onPress={handleSave}
//         disabled={loading || !hasChanges || (isSuspending && !banReason.trim())}
//         isLoading={loading}
//         className={
//           isSuspending
//             ? "bg-red-600 hover:bg-red-700"
//             : isUnsuspending
//               ? "bg-green-600 hover:bg-green-700"
//               : "bg-blue-600 hover:bg-blue-700"
//         }
//         startContent={
//           !loading && (
//             <>
//               {isSuspending ? (
//                 <UserX size={16} />
//               ) : isUnsuspending ? (
//                 <Shield size={16} />
//               ) : (
//                 <Save size={16} />
//               )}
//             </>
//           )
//         }
//       >
//         {loading
//           ? "Saving..."
//           : isSuspending
//             ? "Suspend Ambassador"
//             : isUnsuspending
//               ? "Unsuspend Ambassador"
//               : "Save Changes"}
//       </Button>
//     </>
//   );

//   return (
//     <MainModal
//       size="lg"
//       isOpen={isOpen}
//       footer={footer}
//       showFooter={true}
//       onClose={handleClose}
//       title="Edit Ambassador"
//       handleOnClose={handleClose}
//       description="Update ambassador role and status settings"
//     >
//       <div className="space-y-6">
//         <div className="flex items-center gap-4 rounded-lg bg-gray-800/50 p-4">
//           <Avatar
//             size="lg"
//             src={ambassador?.profile_photo}
//             name={ambassador?.username?.charAt(0)?.toUpperCase()}
//             className="shrink-0"
//           />

//           <div>
//             <div className="flex items-center gap-2">
//               <h3 className="text-lg font-semibold text-white">
//                 {ambassador?.username || "Unknown User"}
//               </h3>

//               {ambassador?.is_verified && (
//                 <span className="text-blue-400">✓</span>
//               )}

//               {ambassador?.status === "suspended" && (
//                 <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-300">
//                   SUSPENDED
//                 </span>
//               )}
//             </div>

//             <p className="text-sm text-gray-400">
//               {ambassador?.email || "No email"}
//             </p>

//             <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
//               <span>
//                 ID: {ambassador?.ambassador_id?.slice(-6) || "Unknown"}
//               </span>
//               <span>
//                 Points: {ambassador?.total_points?.toLocaleString() || "0"}
//               </span>
//               <span>Quests: {ambassador?.total_quests_completed || "0"}</span>
//             </div>

//             {ambassador?.banned_at && (
//               <div className="mt-2 text-xs text-red-400">
//                 Suspended: {new Date(ambassador.banned_at).toLocaleDateString()}
//                 {ambassador?.ban_reason && (
//                   <div className="mt-1 text-gray-500">
//                     Reason: {ambassador.ban_reason}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {error && (
//           <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-sm text-red-300">
//             {error}
//           </div>
//         )}

//         {/* Current suspension warning */}
//         {ambassador?.status === "suspended" && (
//           <div className="rounded-lg border border-orange-500/30 bg-orange-500/20 p-4">
//             <div className="flex items-center gap-2 text-orange-300">
//               <AlertTriangle size={16} />
//               <h4 className="font-medium">Currently Suspended</h4>
//             </div>

//             <p className="mt-1 text-sm text-orange-200">
//               This ambassador is currently suspended. Changing status to
//               "Active" or "Inactive" will unsuspend them.
//             </p>
//           </div>
//         )}

//         <div className="space-y-4">
//           <Select
//             label="Role Type"
//             disabled={loading}
//             selectedKeys={[roleType]}
//             placeholder="Select role type"
//             onSelectionChange={(keys) => setRoleType(Array.from(keys)[0])}
//             classNames={{
//               trigger:
//                 "bg-gray-800/50 border border-gray-600 hover:border-gray-500",
//               value: "text-white",
//               popoverContent: "bg-black/90 border border-gray-600",
//             }}
//           >
//             {ROLE_OPTIONS.map((option) => (
//               <SelectItem
//                 key={option.value}
//                 value={option.value}
//                 className="text-gray-200 hover:bg-gray-700/50"
//               >
//                 {option.label}
//               </SelectItem>
//             ))}
//           </Select>

//           <Select
//             label="Status"
//             disabled={loading}
//             selectedKeys={[status]}
//             placeholder="Select status"
//             onSelectionChange={(keys) => setStatus(Array.from(keys)[0])}
//             classNames={{
//               trigger:
//                 "bg-gray-800/50 border border-gray-600 hover:border-gray-500",
//               value: "text-white",
//               popoverContent: "bg-black/90 border border-gray-600",
//             }}
//           >
//             {STATUS_OPTIONS.map((option) => (
//               <SelectItem
//                 key={option.value}
//                 value={option.value}
//                 textValue={option.label}
//                 className="text-gray-200 hover:bg-gray-700/50"
//               >
//                 {option.label}
//               </SelectItem>
//             ))}
//           </Select>

//           {/* Compact suspension form */}
//           {showSuspendConfirm && (
//             <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
//               <div className="mb-2 flex items-center gap-2 text-red-300">
//                 <AlertTriangle size={14} />
//                 <span className="text-sm font-medium">Ban Reason Required</span>
//               </div>

//               <Textarea
//                 value={banReason}
//                 onChange={(e) => setBanReason(e.target.value)}
//                 placeholder="Explain why this ambassador is being suspended..."
//                 disabled={loading}
//                 minRows={2}
//                 className="w-full"
//                 classNames={{
//                   input: "bg-gray-800/50 text-white text-sm",
//                   inputWrapper: "border border-gray-600 hover:border-gray-500",
//                 }}
//               />

//               <div className="mt-1 text-xs text-gray-400">
//                 {banReason.length}/10 characters minimum
//               </div>
//             </div>
//           )}

//           {/* Compact unsuspension notice */}
//           {isUnsuspending && (
//             <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-2">
//               <div className="flex items-center gap-2 text-green-300">
//                 <Shield size={14} />

//                 <span className="text-sm">
//                   This will unsuspend the ambassador
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {hasChanges && (
//           <div className="bg-blue-500/20 rounded-lg border border-blue-500/30 p-3">
//             <h4 className="mb-2 text-sm font-medium text-blue-300">
//               Pending Changes:
//             </h4>

//             <ul className="space-y-1 text-xs text-blue-200">
//               {roleType !== ambassador?.role_type && (
//                 <li>
//                   • Role: {ambassador?.role_type} → {roleType}
//                 </li>
//               )}

//               {status !== ambassador?.status && (
//                 <li>
//                   • Status: {ambassador?.status} → {status}
//                   {isSuspending && " (SUSPENSION)"}
//                   {isUnsuspending && " (UNSUSPENSION)"}
//                 </li>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </MainModal>
//   );
// };

// export default EditAmbassadorModal;
