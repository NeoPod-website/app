import React from "react";

import CategoryContainer from "./CategoryContainer";

// Ideally you'd fetch this from props or a data hook.
const categories = [
  {
    id: 1,
    title: "Hot Campaigns",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
    description: "This is a description for the category.",
  },
  {
    id: 2,
    title: "Hot Campaigns",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
    description: "This is a description for the category.",
  },
  {
    id: 3,
    title: "Hot Campaigns",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
    description: "This is a description for the category.",
  },
  {
    id: 4,
    title: "Hot Campaigns",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
    description: "This is a description for the category.",
  },
];

const CategoriesList = () => {
  const validCategories = Array.isArray(categories) ? categories : [];

  if (validCategories.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No categories available.
      </div>
    );
  }

  return validCategories.map((category) => {
    if (!category || !category.id) return null;

    return <CategoryContainer key={category.id} category={category} />;
  });
};

export default CategoriesList;
