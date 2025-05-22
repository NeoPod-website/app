"use client";

import React, { useState, useCallback, useMemo } from "react";

import AdminEditCategory from "./AdminEditCategory";
import AdminCreateCategory from "./AdminCreateCategory";

import WrapperContainer from "@/components/common/WrapperContainer";
import CategoryItem from "@/components/layout/category/CategoryItem";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

// Default values extracted to prevent object recreation
const DEFAULT_CATEGORY_DATA = {
  status: "live",
  name: "New Category",
  description: "New Description",
  icon: "/dashboard/category/icon-1.png",
  cover_photo: "/dashboard/category/background-2.jpg",
};

const AdminCategoryMain = ({
  id,
  podId,
  isNew = false,
  initialCategoryData = {},
}) => {
  // Memoize initial category data to prevent unnecessary state updates
  const initialData = useMemo(
    () => ({
      icon: initialCategoryData.icon || DEFAULT_CATEGORY_DATA.icon,
      name: initialCategoryData.name || DEFAULT_CATEGORY_DATA.name,
      status: initialCategoryData.status || DEFAULT_CATEGORY_DATA.status,
      cover_photo:
        initialCategoryData.cover_photo || DEFAULT_CATEGORY_DATA.cover_photo,
      description:
        initialCategoryData.description || DEFAULT_CATEGORY_DATA.description,
    }),
    [initialCategoryData],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryData, setCategoryData] = useState(initialData);

  // Memoize the change handler to prevent function recreation
  const handleCategoryDataChange = useCallback((field, value) => {
    setCategoryData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Memoize the form component to prevent unnecessary re-renders
  const FormComponent = useMemo(() => {
    const commonProps = {
      podId,
      categoryData,
      isSubmitting,
      setIsSubmitting,
      handleCategoryDataChange,
    };

    return isNew ? (
      <AdminCreateCategory {...commonProps} />
    ) : (
      <AdminEditCategory
        {...commonProps}
        initialCategoryData={initialCategoryData}
      />
    );
  }, [
    isNew,
    podId,
    categoryData,
    isSubmitting,
    handleCategoryDataChange,
    initialCategoryData,
  ]);

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      <WrapperContainer scrollable className="space-y-10 p-10">
        {FormComponent}
      </WrapperContainer>

      <WrapperContainer scrollable>
        <CategoryItem
          id={id}
          showDescription
          icon={categoryData.icon}
          title={categoryData.name}
          background={categoryData.cover_photo}
          description={categoryData.description}
        />

        <QuestListLoader compact scrollable />
      </WrapperContainer>
    </section>
  );
};

export default AdminCategoryMain;
