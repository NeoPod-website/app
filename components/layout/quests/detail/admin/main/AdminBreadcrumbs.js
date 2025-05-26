import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";

const AdminBreadcrumbs = ({ isNew }) => {
  const breadcrumbsList = [
    {
      title: "Pods",
      href: "/admin/manage/pods",
    },
    {
      title: "Categories",
      href: "/admin/manage/categories",
    },
    {
      title: isNew ? "New Quest" : " Share about NEO POD Ambassador Program",
    },
  ];

  return (
    <div className="line-clamp-1 min-w-0 flex-1 overflow-hidden truncate text-nowrap">
      <div className="line-clamp-1 text-nowrap">
        <NeoBreadcrumbs list={breadcrumbsList} />
      </div>
    </div>
  );
};

export default AdminBreadcrumbs;
