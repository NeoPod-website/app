"use client";

import React, { useState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { EllipsisVerticalIcon, EyeIcon, ShareIcon } from "lucide-react";

import AdminBreadcrumbs from "./AdminBreadcrumbs";

const AdminDetailMainHeader = () => {
  const [selectedStatus, setSelectedStatus] = useState(new Set(["publish"]));

  const handleStatusChange = (keys) => {
    setSelectedStatus(keys);
  };

  return (
    <section className="flex items-center justify-between gap-2.5 overflow-hidden rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <AdminBreadcrumbs />

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

        <Select
          aria-label="Status"
          variant="bordered"
          size="lg"
          selectedKeys={selectedStatus}
          onSelectionChange={handleStatusChange}
          className="w-24 rounded bg-gradient-primary"
          classNames={{
            base: "h-8",
            trigger:
              "border border-white focus-within:!border-gray-300 h-8 min-h-[32px] max-h-[32px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
            value: "text-xs",
          }}
        >
          <SelectItem key="publish" value="Publish">
            Publish
          </SelectItem>

          <SelectItem key="draft" value="Draft">
            Draft
          </SelectItem>
        </Select>
      </div>
    </section>
  );
};

export default AdminDetailMainHeader;
