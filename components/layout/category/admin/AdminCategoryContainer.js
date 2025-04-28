import React from "react";
import Link from "next/link";

import CategoryItem from "../CategoryItem";

const AdminCategoryContainer = ({ category }) => {
  return (
    <div key={category.id} className="group relative flex-1 rounded-2.5xl">
      <CategoryItem
        showDescription
        id={category.id}
        title={category.title ?? "No Category"}
        description={category.description ?? ""}
        icon={category.icon ?? "/dashboard/category/icon-1.png"}
        background={
          category.background ?? "/dashboard/category/background-2.jpg"
        }
      />

      <div className="absolute left-0 top-0 z-30 flex h-40 w-full items-center justify-center rounded-2.5xl border border-gray-300 bg-black/60 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
        <Link
          href={`/admin/manage/categories/${category.id}`}
          className="block w-fit rounded-xl border border-gray-100 bg-gradient-dark px-8 py-4"
        >
          Edit Category
        </Link>
      </div>
    </div>
  );
};

export default AdminCategoryContainer;
