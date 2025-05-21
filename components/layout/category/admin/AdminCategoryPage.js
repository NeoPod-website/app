"use client";

import React, { useState } from "react";

import CategoryItem from "@/components/layout/category/CategoryItem";

import WrapperContainer from "@/components/common/WrapperContainer";

import CategoryForm from "@/components/layout/category/admin/CategoryForm";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

const AdminCategoryMain = ({
  id,
  isNew = false,
  title = "New Category",
  description = "New Description",
  icon = "/dashboard/category/icon-1.png",
  background = "/dashboard/category/background-2.jpg",
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
          icon={categoryIcon}
          title={categoryTitle}
          background={selectedFile}
          description={categoryDescription}
        />

        <QuestListLoader compact={true} scrollable={true} />
      </WrapperContainer>
    </section>
  );
};

export default AdminCategoryMain;
