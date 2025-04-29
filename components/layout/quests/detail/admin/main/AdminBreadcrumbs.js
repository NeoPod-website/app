import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";

const AdminBreadcrumbs = () => {
  const breadcrumbsList = [
    {
      title: "Quests",
      href: "/admin/manage/quests",
    },
    {
      title: "Hot Campaigns",
      href: "/admin/manage/categories/1",
    },
    {
      title: " Share about NEO POD Ambassador Program",
      href: "/admin/manage/quests/1",
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
