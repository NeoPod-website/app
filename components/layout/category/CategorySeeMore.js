import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

const CategorySeeMore = ({ id, podId, isAdmin }) => {
  return (
    <Link
      href={isAdmin ? `/admin/manage/quests/${podId}/${id}` : `/quests/${id}`}
      className="absolute bottom-5 right-5 z-20 flex items-center gap-1 font-work-sans text-base font-medium text-gray-200 transition-colors hover:text-white hover:underline"
    >
      <h4>See More</h4>

      <ChevronRightIcon size={16} className="" />
    </Link>
  );
};

export default CategorySeeMore;
