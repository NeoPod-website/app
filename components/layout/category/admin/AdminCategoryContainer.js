import React from "react";
import Link from "next/link";

import CategoryItem from "../CategoryItem";
import RemoveCategoryBtn from "@/components/ui/buttons/category/RemoveCategoryBtn";

const AdminCategoryContainer = ({ podId, category }) => {
  return (
    <div className="group relative rounded-2.5xl">
      <CategoryItem
        showDescription
        id={category.category_id}
        title={category.name ?? "No Category"}
        description={category.description ?? ""}
        icon={category.icon ?? "/dashboard/category/icon-1.png"}
        background={
          category.cover_photo ?? "/dashboard/category/background-2.jpg"
        }
      />

      <div className="absolute left-0 top-0 z-30 flex h-40 w-full items-center justify-center gap-3 rounded-2.5xl border border-gray-300 bg-black/60 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
        <RemoveCategoryBtn category={category} />

        <Link
          href={`/admin/manage/categories/${podId}/${category.category_id}/edit`}
          className="block w-fit rounded-xl border border-gray-400 bg-gradient-dark px-6 py-2.5 text-sm opacity-80 transition-opacity hover:opacity-100"
        >
          Edit Category
        </Link>
      </div>
    </div>
  );
};

export default AdminCategoryContainer;
