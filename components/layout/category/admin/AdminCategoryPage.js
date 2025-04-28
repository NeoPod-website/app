"use client";

import React, { useState } from "react";

import CategoryItem from "@/components/layout/category/CategoryItem";

import WrapperContainer from "@/components/common/WrapperContainer";

import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";
import CategoryForm from "@/components/layout/category/admin/CategoryForm";

const AdminCategoryMain = ({
  id,
  icon = "",
  title = "",
  isNew = false,
  description = "",
  background = "",
}) => {
  let [categoryIcon, setCatgoryIcon] = useState(icon);
  let [categoryTitle, setCategoryTitle] = useState(title);
  let [selectedFile, setSelectedFile] = useState(background);
  let [categoryDescription, setCategoryDescription] = useState(description);

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      <WrapperContainer scrollable className="space-y-10 p-10">
        <CategoryForm
          isNew={isNew}
          icon={categoryIcon}
          setIcon={setCatgoryIcon}
          title={categoryTitle}
          setTitle={setCategoryTitle}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          description={categoryDescription}
          setDescription={setCategoryDescription}
        />
      </WrapperContainer>

      <WrapperContainer scrollable>
        <CategoryItem
          id={id}
          showDescription
          title={categoryTitle ?? "No Category"}
          description={categoryDescription ?? ""}
          icon={categoryIcon ?? "/dashboard/category/icon-1.png"}
          background={selectedFile ?? "/dashboard/category/background-2.jpg"}
        />

        <QuestListLoader compact={true} scrollable={true} />
      </WrapperContainer>
    </section>
  );
};

export default AdminCategoryMain;
