// import React, { memo, useState } from "react";
// import {
//   Card,
//   Chip,
//   Avatar,
//   Button,
//   CardBody,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   DropdownTrigger,
// } from "@heroui/react";
// import { MoreVertical, Mail, Calendar, Activity, Award } from "lucide-react";

// // Role color mapping
// const ROLE_COLORS = {
//   super: "danger",
//   community: "primary",
//   moderator: "secondary",
// };

// // Status color mapping
// const STATUS_COLORS = {
//   active: "success",
//   inactive: "warning",
//   suspended: "danger",
// };

// const AdminContainer = memo(({ admin, onUpdate }) => {
//   const [actionLoading, setActionLoading] = useState(false);

//   // Format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return "Never";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "Invalid date";
//     }
//   };

//   // Format time ago
//   const getTimeAgo = (dateString) => {
//     if (!dateString) return "Never";
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffMs = now - date;
//       const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//       if (diffDays === 0) return "Today";
//       if (diffDays === 1) return "Yesterday";
//       if (diffDays < 7) return `${diffDays} days ago`;
//       if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//       if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
//       return `${Math.floor(diffDays / 365)} years ago`;
//     } catch {
//       return "Unknown";
//     }
//   };

//   // Handle admin actions
//   const handleAction = async (action) => {
//     setActionLoading(true);
//     try {
//       // Implement action logic here
//       console.log(`${action} admin:`, admin.username);

//       // Example API call structure:
//       // const response = await fetch(`/api/super/admins/${admin.username}`, {
//       //   method: action === 'delete' ? 'DELETE' : 'PATCH',
//       //   body: JSON.stringify({ action }),
//       // });

//       // Mock update for now
//       setTimeout(() => {
//         if (onUpdate) {
//           onUpdate({
//             ...admin,
//             // Mock status change
//             status:
//               action === "activate"
//                 ? "active"
//                 : action === "deactivate"
//                   ? "inactive"
//                   : action === "suspend"
//                     ? "suspended"
//                     : admin.status,
//           });
//         }
//         setActionLoading(false);
//       }, 1000);
//     } catch (error) {
//       console.error(`Failed to ${action} admin:`, error);
//       setActionLoading(false);
//     }
//   };

//   return (
//     <Card className="border border-gray-700 bg-gray-900/50 transition-colors hover:border-gray-600">
//       <CardBody className="p-6">
//         <div className="flex items-start justify-between gap-4">
//           {/* Left side - Admin info */}
//           <div className="flex flex-1 items-start gap-4">
//             <Avatar
//               src={admin.profile_photo}
//               name={admin.username}
//               size="lg"
//               className="flex-shrink-0"
//             />

//             <div className="min-w-0 flex-1">
//               {/* Name and role */}
//               <div className="mb-2 flex items-center gap-2">
//                 <h3 className="truncate text-lg font-semibold text-white">
//                   {admin.username}
//                 </h3>
//                 <Chip
//                   color={ROLE_COLORS[admin.role_type] || "default"}
//                   size="sm"
//                   variant="flat"
//                 >
//                   {admin.role_type?.toUpperCase()}
//                 </Chip>
//                 <Chip
//                   color={STATUS_COLORS[admin.status] || "default"}
//                   size="sm"
//                   variant="dot"
//                 >
//                   {admin.status?.toUpperCase()}
//                 </Chip>
//               </div>

//               {/* Email */}
//               <div className="mb-3 flex items-center gap-2 text-gray-300">
//                 <Mail size={16} />
//                 <span className="truncate text-sm">{admin.email}</span>
//               </div>

//               {/* Stats grid */}
//               <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
//                 <div className="flex items-center gap-2 text-gray-300">
//                   <Calendar size={16} />
//                   <div>
//                     <p className="text-gray-400">Joined</p>
//                     <p className="text-white">
//                       {formatDate(admin.joining_date)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-300">
//                   <Activity size={16} />
//                   <div>
//                     <p className="text-gray-400">Last Login</p>
//                     <p className="text-white">{getTimeAgo(admin.last_login)}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-300">
//                   <Award size={16} />
//                   <div>
//                     <p className="text-gray-400">Reviews</p>
//                     <p className="text-white">{admin.reviews_number || 0}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Assigned pods */}
//               {admin.assigned_pods && admin.assigned_pods.length > 0 && (
//                 <div className="mt-3">
//                   <p className="mb-1 text-sm text-gray-400">Assigned Pods:</p>
//                   <div className="flex flex-wrap gap-1">
//                     {admin.assigned_pods.slice(0, 3).map((podId) => (
//                       <Chip
//                         key={podId}
//                         size="sm"
//                         variant="bordered"
//                         className="text-xs"
//                       >
//                         {podId}
//                       </Chip>
//                     ))}
//                     {admin.assigned_pods.length > 3 && (
//                       <Chip size="sm" variant="bordered" className="text-xs">
//                         +{admin.assigned_pods.length - 3} more
//                       </Chip>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right side - Actions */}
//           <div className="flex-shrink-0">
//             <Dropdown>
//               <DropdownTrigger>
//                 <Button
//                   variant="light"
//                   size="sm"
//                   isIconOnly
//                   disabled={actionLoading}
//                 >
//                   <MoreVertical size={20} />
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 aria-label="Admin actions"
//                 onAction={(key) => handleAction(key)}
//               >
//                 <DropdownItem key="view" className="text-blue-400">
//                   View Details
//                 </DropdownItem>
//                 <DropdownItem key="edit" className="text-yellow-400">
//                   Edit Admin
//                 </DropdownItem>
//                 {admin.status === "active" ? (
//                   <DropdownItem key="deactivate" className="text-orange-400">
//                     Deactivate
//                   </DropdownItem>
//                 ) : (
//                   <DropdownItem key="activate" className="text-green-400">
//                     Activate
//                   </DropdownItem>
//                 )}
//                 <DropdownItem key="suspend" className="text-red-400">
//                   Suspend
//                 </DropdownItem>
//                 <DropdownItem
//                   key="delete"
//                   className="text-danger"
//                   color="danger"
//                 >
//                   Delete Admin
//                 </DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   );
// });

// AdminContainer.displayName = "AdminContainer";

// export default AdminContainer;

import {
  Eye,
  Edit2,
  Award,
  Shield,
  Activity,
  MoreVertical,
} from "lucide-react";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import React, { memo, useState } from "react";

import EditAdminModal from "@/components/ui/modals/EditAdminModal";

// Admin-specific user info component
const AdminUserInfo = memo(({ admin }) => {
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Never";

    try {
      const date = new Date(dateString);

      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="truncate text-sm font-medium text-gray-100 md:text-base">
          {admin.username}
        </p>

        {admin.isAdmin && (
          <span className="text-sm text-blue-400">
            <Shield size={14} />
          </span>
        )}
      </div>

      <p className="truncate text-xs text-gray-400 md:text-sm">
        {admin.email || "No email"}
      </p>

      <p className="truncate text-xs text-gray-500">
        Last login: {formatTimeAgo(admin.last_login)}
      </p>
    </div>
  );
});

AdminUserInfo.displayName = "AdminUserInfo";

// Status badge component - FIXED to show proper status with colors
const StatusBadge = memo(({ admin }) => {
  const status = admin.status || (admin.is_active ? "active" : "inactive");

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 text-center text-xs font-medium capitalize ${getStatusStyle(status)}`}
    >
      {status}
    </span>
  );
});

StatusBadge.displayName = "StatusBadge";

// Role badge component
const RoleBadge = memo(({ role }) => {
  const getRoleStyle = (role) => {
    switch (role) {
      case "super":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "community":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "moderator":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "reviewer":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 text-center text-xs font-medium capitalize ${getRoleStyle(role)}`}
    >
      {role || "unknown"}
    </span>
  );
});

RoleBadge.displayName = "RoleBadge";

// Joining date formatter
const JoiningDate = memo(({ date }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="hidden w-24 flex-shrink-0 text-center lg:block lg:w-28">
      <div className="text-xs text-gray-400">Joined</div>
      <div className="text-sm font-medium text-gray-200">
        {formatDate(date)}
      </div>
    </div>
  );
});

JoiningDate.displayName = "JoiningDate";

// Avatar with role indicator
const AdminAvatar = memo(({ admin }) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case "super":
        return <Shield size={12} className="text-red-400" />;
      case "community":
        return <Activity size={12} className="text-blue-400" />;
      case "moderator":
        return <Award size={12} className="text-purple-400" />;
      case "reviewer":
        return <Eye size={12} className="text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <Avatar
        src={admin.profile_photo}
        name={admin.username}
        size="md"
        className="flex-shrink-0"
      />
      <div className="absolute -bottom-1 -right-1 rounded-full border border-gray-600 bg-gray-800 p-1">
        {getRoleIcon(admin.role_type)}
      </div>
    </div>
  );
});

AdminAvatar.displayName = "AdminAvatar";

// Reviews section (similar to PointsSection for ambassadors)
const ReviewsSection = memo(({ admin }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-lg font-bold text-yellow-400 md:text-xl">
        {admin.reviews_number || 0}
      </div>
      <div className="text-xs text-gray-400">reviews</div>
    </div>
  );
});

ReviewsSection.displayName = "ReviewsSection";

const AdminContainer = memo(({ admin, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditSuccess = (updatedAdmin) => {
    setShowEditModal(false);

    // Call the parent's update function to update the state
    if (onUpdate && typeof onUpdate === "function") {
      onUpdate(updatedAdmin);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-2xl bg-gray-700/20 p-3 transition-all duration-200 hover:bg-gray-700/40 xl:p-4">
        <div className="flex flex-1 items-center gap-4 lg:gap-6">
          <div className="flex-shrink-0">
            <AdminAvatar admin={admin} />
          </div>

          <div className="min-w-0 max-w-64 flex-1">
            <AdminUserInfo admin={admin} />
          </div>

          <div className="hidden min-w-20 flex-col gap-2 sm:flex">
            <RoleBadge role={admin.role_type} />
            <StatusBadge admin={admin} />
          </div>

          <JoiningDate date={admin.joining_date} />
        </div>

        <div className="flex items-center gap-6 lg:gap-8">
          <ReviewsSection admin={admin} />

          <div className="hidden w-16 flex-shrink-0 text-center sm:block md:w-20">
            <div className="text-sm font-bold text-gray-100 md:text-base">
              {admin.assigned_pods?.length || 0}
            </div>

            <div className="text-xs text-gray-400">pods</div>
          </div>

          <div className="flex-shrink-0">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Admin actions"
                classNames={{
                  base: "bg-black/90 border border-gray-600",
                  list: "bg-black/90",
                }}
              >
                <DropdownItem
                  key="edit"
                  startContent={<Edit2 size={16} />}
                  onPress={() => setShowEditModal(true)}
                  className="text-gray-200 hover:bg-gray-700/50"
                >
                  Edit Admin
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      <EditAdminModal
        isOpen={showEditModal}
        admin={admin}
        onSuccess={handleEditSuccess}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
});

AdminContainer.displayName = "AdminContainer";

export default AdminContainer;
