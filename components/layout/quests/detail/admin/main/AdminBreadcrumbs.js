import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";

const AdminBreadcrumbs = ({ isNew, name, podId, categoryId }) => {
  const breadcrumbsList = [
    {
      title: "Manage",
    },
    {
      title: "Quests",
      href: `/admin/manage/quests/${podId}`,
    },
    {
      title: "Pod",
      href: `/admin/manage/quests/${podId}`,
    },
    {
      title: "Categories",
      href: `/admin/manage/quests/${podId}/${categoryId}`,
    },
    {
      title: isNew ? "New Quest" : name,
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
