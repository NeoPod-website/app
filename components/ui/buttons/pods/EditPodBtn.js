"use client";

import React from "react";
import Link from "next/link";
import { EditIcon } from "lucide-react";

const EditPodBtn = ({ podId }) => {
  return (
    <Link
      title="Edit Pod"
      href={`/admin/manage/pods/${podId}`}
      className="flex w-fit items-center gap-1 rounded-lg border border-gray-400 bg-gradient-dark px-3 py-0 text-sm opacity-80 transition-opacity hover:opacity-100"
    >
      Edit POD <EditIcon size={16} />
    </Link>
  );
};

export default EditPodBtn;
