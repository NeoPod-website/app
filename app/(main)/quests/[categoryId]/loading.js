import React from "react";

import CategoryContainerLoader from "@/components/ui/loader/category/CategoryContainerLoader";

const CategoryLoading = () => {
  return (
    <CategoryContainerLoader length={1} compact={false} scrollable={true} />
  );
};

export default CategoryLoading;
