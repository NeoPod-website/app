// "use client";

// import { Save, X } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { Button, Select, SelectItem, Avatar } from "@heroui/react";

// import MainModal from "@/components/ui/modals/MainModal";

// const ROLE_OPTIONS = [
//   { value: "community", label: "Community" },
//   { value: "moderator", label: "Moderator" },
//   { value: "reviewer", label: "Reviewer" },
// ];

// const STATUS_OPTIONS = [
//   { value: "active", label: "Active" },
//   { value: "inactive", label: "Inactive" },
//   { value: "suspended", label: "Suspended" },
// ];

// const EditAdminModal = ({ isOpen, onClose, admin, onSuccess }) => {
//   const [loading, setLoading] = useState(false);

//   const [status, setStatus] = useState(admin?.status || "active");
//   const [roleType, setRoleType] = useState(admin?.role_type || "community");

//   const [error, setError] = useState("");

//   // Reset form when admin changes or modal opens
//   useEffect(() => {
//     if (admin && isOpen) {
//       setRoleType(admin.role_type || "community");
//       setStatus(admin.status || "active");
//       setError("");
//     }
//   }, [admin, isOpen]);

//   const handleSave = async () => {
//     if (!admin) return;

//     setLoading(true);
//     setError("");

//     try {
//       // Prepare update payload - only include changed fields
//       const updatePayload = {};

//       if (roleType !== admin.role_type) {
//         updatePayload.role_type = roleType;
//       }

//       if (status !== admin.status) {
//         updatePayload.is_active = status === "active";
//       }

//       // Only make API call if there are changes
//       if (updatePayload.role_type || updatePayload.is_active !== undefined) {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/super/admins/${admin.username}`,
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
//             errorData.message || `Failed to update admin (${response.status})`,
//           );
//         }

//         // Optionally use the returned updated admin data
//         const responseData = await response.json();
//         console.log("Update successful:", responseData);
//       }

//       // Create updated admin object
//       const updatedAdmin = {
//         ...admin,
//         role_type: roleType,
//         status: status,
//         is_active: status === "active",
//       };

//       // Call success callback with updated admin
//       onSuccess(updatedAdmin);
//     } catch (err) {
//       setError(err.message);
//       console.error("Failed to update admin:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     if (!loading) {
//       setError("");
//       // Reset to current admin values
//       setRoleType(admin?.role_type || "community");
//       setStatus(admin?.status || "active");
//       onClose();
//     }
//   };

//   const hasChanges = roleType !== admin?.role_type || status !== admin?.status;

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
//         color="primary"
//         onPress={handleSave}
//         disabled={loading || !hasChanges}
//         isLoading={loading}
//         className="bg-blue-600 hover:bg-blue-700"
//         startContent={!loading && <Save size={16} />}
//       >
//         {loading ? "Saving..." : "Save Changes"}
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
//       title="Edit Admin"
//       handleOnClose={handleClose}
//       description="Update admin role and status settings"
//     >
//       <div className="space-y-8">
//         {/* Admin Info Section */}
//         <div className="flex items-center gap-6 rounded-lg bg-gray-800/50 p-6">
//           <Avatar
//             size="lg"
//             src={admin?.profile_photo}
//             name={admin?.username?.charAt(0)?.toUpperCase()}
//             className="shrink-0"
//           />

//           <div className="space-y-2">
//             <div className="flex items-center gap-3">
//               <h3 className="text-lg font-semibold text-white">
//                 {admin?.username || "Unknown User"}
//               </h3>

//               {admin?.is_admin && (
//                 <span className="text-blue-400">
//                   <span className="text-sm">Admin</span>
//                 </span>
//               )}
//             </div>

//             <p className="text-sm text-gray-400">
//               {admin?.email || "No email"}
//             </p>

//             <div className="flex items-center gap-6 text-xs text-gray-500">
//               <span>
//                 Reviews: {admin?.reviews_number?.toLocaleString() || "0"}
//               </span>

//               <span>Pods: {admin?.assigned_pods?.length || "0"}</span>

//               <span>
//                 Joined:{" "}
//                 {admin?.joining_date
//                   ? new Date(admin.joining_date).toLocaleDateString()
//                   : "Unknown"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-4 text-sm text-red-300">
//             {error}
//           </div>
//         )}

//         {/* Form Fields */}
//         <div className="space-y-6">
//           <Select
//             label="Role Type"
//             disabled={loading || admin?.role_type === "super"}
//             selectedKeys={[roleType]}
//             placeholder="Select role type"
//             onSelectionChange={(keys) => setRoleType(Array.from(keys)[0])}
//             description={
//               admin?.role_type === "super"
//                 ? "Super admin role cannot be changed"
//                 : "Choose the admin's role level"
//             }
//             classNames={{
//               trigger:
//                 "bg-gray-800/50 border border-gray-600 hover:border-gray-500 h-14",
//               value: "text-white",
//               label: "text-gray-300 font-medium",
//               description: "text-gray-500",
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
//             description="Control admin's access to the system"
//             classNames={{
//               trigger:
//                 "bg-gray-800/50 border border-gray-600 hover:border-gray-500 h-14",
//               value: "text-white",
//               label: "text-gray-300 font-medium",
//               description: "text-gray-500",
//               popoverContent: "bg-black/90 border border-gray-600",
//             }}
//           >
//             {STATUS_OPTIONS.map((option) => (
//               <SelectItem
//                 key={option.value}
//                 value={option.value}
//                 className="text-gray-200 hover:bg-gray-700/50"
//               >
//                 {option.label}
//               </SelectItem>
//             ))}
//           </Select>
//         </div>

//         {/* Changes Preview */}
//         {hasChanges && (
//           <div className="bg-blue-500/20 rounded-lg border border-blue-500/30 p-4">
//             <h4 className="mb-3 text-sm font-medium text-blue-300">
//               Pending Changes:
//             </h4>

//             <ul className="space-y-2 text-sm text-blue-200">
//               {roleType !== admin?.role_type && (
//                 <li className="flex items-center gap-2">
//                   <span className="text-blue-400">•</span>
//                   <span>
//                     Role:{" "}
//                     <span className="text-gray-400">{admin?.role_type}</span> →{" "}
//                     <span className="font-medium">{roleType}</span>
//                   </span>
//                 </li>
//               )}

//               {status !== admin?.status && (
//                 <li className="flex items-center gap-2">
//                   <span className="text-blue-400">•</span>
//                   <span>
//                     Status:{" "}
//                     <span className="text-gray-400">{admin?.status}</span> →{" "}
//                     <span className="font-medium">{status}</span>
//                   </span>
//                 </li>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </MainModal>
//   );
// };

// export default EditAdminModal;

"use client";

import { Save, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button, Select, SelectItem, Avatar } from "@heroui/react";

import MainModal from "@/components/ui/modals/MainModal";

const ROLE_OPTIONS = [
  { value: "community", label: "Community" },
  { value: "moderator", label: "Moderator" },
  { value: "reviewer", label: "Reviewer" },
];

// FIXED: Proper status options including suspend
const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const EditAdminModal = ({ isOpen, onClose, admin, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(admin?.status || "active");
  const [roleType, setRoleType] = useState(admin?.role_type || "community");

  const [error, setError] = useState("");

  // Reset form when admin changes or modal opens
  useEffect(() => {
    if (admin && isOpen) {
      setRoleType(admin.role_type || "community");
      setStatus(admin.status || "active");
      setError("");
    }
  }, [admin, isOpen]);

  const handleSave = async () => {
    if (!admin) return;

    setLoading(true);
    setError("");

    try {
      let updatedAdmin = { ...admin };

      // Prepare update payload - only include changed fields
      const updatePayload = {};

      if (roleType !== admin.role_type) {
        updatePayload.role_type = roleType;
      }

      if (status !== admin.status) {
        updatePayload.status = status;
        updatePayload.is_active = status === "active";
      }

      if (Object.keys(updatePayload).length > 0) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/super/admins/${admin.username}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatePayload),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || `Failed to update admin (${response.status})`,
          );
        }

        updatedAdmin = data.data?.admin || {
          ...admin,
          ...updatePayload,
        };
      }

      onSuccess(updatedAdmin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      setRoleType(admin?.role_type || "community");
      setStatus(admin?.status || "active");

      onClose();
    }
  };

  const hasChanges = roleType !== admin?.role_type || status !== admin?.status;

  const footer = (
    <>
      <Button
        variant="light"
        onPress={handleClose}
        disabled={loading}
        className="text-gray-300 hover:text-white"
        startContent={<X size={16} />}
      >
        Cancel
      </Button>

      <Button
        color="primary"
        onPress={handleSave}
        disabled={loading || !hasChanges}
        isLoading={loading}
        className="bg-blue-600 hover:bg-blue-700"
        startContent={!loading && <Save size={16} />}
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
      title="Edit Admin"
      handleOnClose={handleClose}
      description="Update admin role and status settings"
    >
      <div className="space-y-8">
        <div className="flex items-center gap-6 rounded-lg bg-gray-800/50 p-6">
          <Avatar
            size="lg"
            src={admin?.profile_photo}
            name={admin?.username?.charAt(0)?.toUpperCase()}
            className="shrink-0"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">
                {admin?.username || "Unknown User"}
              </h3>

              {admin?.isAdmin && (
                <span className="text-blue-400">
                  <span className="text-sm">Admin</span>
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400">
              {admin?.email || "No email"}
            </p>

            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span>
                Reviews: {admin?.reviews_number?.toLocaleString() || "0"}
              </span>

              <span>Pods: {admin?.assigned_pods?.length || "0"}</span>

              <span>
                Joined:{" "}
                {admin?.joining_date
                  ? new Date(admin.joining_date).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Select
            label="Role Type"
            selectedKeys={[roleType]}
            placeholder="Select role type"
            disabled={loading || admin?.role_type === "super"}
            onSelectionChange={(keys) => setRoleType(Array.from(keys)[0])}
            description={
              admin?.role_type === "super"
                ? "Super admin role cannot be changed"
                : "Choose the admin's role level"
            }
            classNames={{
              trigger:
                "bg-gray-800/50 border border-gray-600 hover:border-gray-500 h-14",
              value: "text-white",
              label: "text-gray-300 font-medium",
              description: "text-gray-500",
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

          <Select
            label="Status"
            disabled={loading}
            selectedKeys={[status]}
            placeholder="Select status"
            description="Control admin's access and permissions"
            onSelectionChange={(keys) => setStatus(Array.from(keys)[0])}
            classNames={{
              trigger:
                "bg-gray-800/50 border border-gray-600 hover:border-gray-500 h-14",
              value: "text-white",
              label: "text-gray-300 font-medium",
              description: "text-gray-500",
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
        </div>

        {hasChanges && (
          <div className="bg-blue-500/20 rounded-lg border border-blue-500/30 p-4">
            <h4 className="mb-3 text-sm font-medium text-blue-300">
              Pending Changes:
            </h4>

            <ul className="space-y-2 text-sm text-blue-200">
              {roleType !== admin?.role_type && (
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>

                  <span>
                    Role:{" "}
                    <span className="text-gray-400">{admin?.role_type}</span> →{" "}
                    <span className="font-medium">{roleType}</span>
                  </span>
                </li>
              )}

              {status !== admin?.status && (
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>

                  <span>
                    Status:{" "}
                    <span className="text-gray-400">{admin?.status}</span> →{" "}
                    <span className="font-medium">{status}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </MainModal>
  );
};

export default EditAdminModal;
