"use client";

import React, { useState } from "react";

import AdminEditCategory from "./AdminEditCategory";
import AdminCreateCategory from "./AdminCreateCategory";

import WrapperContainer from "@/components/common/WrapperContainer";
import CategoryItem from "@/components/layout/category/CategoryItem";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

const AdminCategoryMain = ({
  id,
  podId,
  isNew = false,
  initialCategoryData = {},
}) => {
  const {
    status = "live",
    name = "New Category",
    description = "New Description",
    icon = "/dashboard/category/icon-1.png",
    cover_photo = "/dashboard/category/background-2.jpg",
  } = initialCategoryData;

  const [categoryData, setCategoryData] = useState({
    icon,
    name,
    status,
    cover_photo,
    description,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryDataChange = (field, value) => {
    setCategoryData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      <WrapperContainer scrollable className="space-y-10 p-10">
        {isNew ? (
          <AdminCreateCategory
            podId={podId}
            categoryData={categoryData}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            handleCategoryDataChange={handleCategoryDataChange}
          />
        ) : (
          <AdminEditCategory
            podId={podId}
            categoryData={categoryData}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            initialCategoryData={initialCategoryData}
            handleCategoryDataChange={handleCategoryDataChange}
          />
        )}
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

        <QuestListLoader compact={true} scrollable={true} />
      </WrapperContainer>
    </section>
  );
};

export default AdminCategoryMain;
