import React from "react";
import CategoryItemLoader from "./CategoryItemLoader";

const CategoryListLoader = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <CategoryItemLoader key={`loader-${index}`} />
      ))}
    </div>
  );
};

export default CategoryListLoader;
