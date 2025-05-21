import React from "react";

import AdminCategoryContainer from "./AdminCategoryContainer";

const AdminCategoriesList = ({ podId, categories }) => {
  const validCategories = Array.isArray(categories) ? categories : [];

  if (validCategories.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No categories available.
      </div>
    );
  }

  return (
    <section className="hide-scroll flex flex-1 flex-col justify-start gap-5 overflow-y-auto">
      {validCategories.map((category) => {
        if (!category || !category.name) return null;

        return (
          <AdminCategoryContainer
            podId={podId}
            category={category}
            key={category.category_id}
          />
        );
      })}
    </section>
  );
};

export default AdminCategoriesList;
