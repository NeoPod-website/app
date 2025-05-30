"use client";

import React from "react";
import { Button } from "@heroui/react";
import { EyeIcon, ShareIcon, EllipsisVerticalIcon } from "lucide-react";

import AdminBreadcrumbs from "./AdminBreadcrumbs";

import PublishQuestBtn from "@/components/ui/buttons/quest/admin/task/PublishQuestBtn";

const AdminDetailMainHeader = ({ quest, isNew, podId, categoryId }) => {
  return (
    <section className="flex items-center justify-between gap-2.5 overflow-hidden rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <AdminBreadcrumbs
        isNew={isNew}
        podId={podId}
        categoryId={categoryId}
        name={quest?.name || "New Quest"}
      />

      <div className="flex items-center gap-2.5">
        <Button
          size="sm"
          isIconOnly
          className="w-fit gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1"
          startContent={<EllipsisVerticalIcon size={16} />}
        ></Button>

        <Button
          size="sm"
          className="w-fit gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1"
          endContent={<EyeIcon size={16} />}
        >
          Preview
        </Button>

        <Button
          size="sm"
          className="w-fit gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1"
          endContent={<ShareIcon size={16} />}
        >
          Share
        </Button>

        <PublishQuestBtn
          isNew={isNew}
          podId={podId}
          categoryId={categoryId}
          questId={quest?.quest_id}
        />
      </div>
    </section>
  );
};

export default AdminDetailMainHeader;
