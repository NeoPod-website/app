"use client";

import React from "react";
import { PackageOpenIcon } from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentQuest } from "@/redux/slice/questSlice";

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

const AdminSelectCategory = () => {
  const dispatch = useDispatch();

  const categoryId = useSelector(
    (state) => state.quest.currentQuest.categoryId,
  );

  const selectedCategory = new Set([categoryId || "1"]);

  const handleCategorySelectionChange = (keys) => {
    const value = Array.from(keys)[0];

    dispatch(setCurrentQuest({ categoryId: value }));
  };

  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-bold">Category</h3>

      <div className="flex items-center gap-12">
        <p className="flex w-32 items-center gap-3 text-gray-100">
          <PackageOpenIcon size={20} />
          Category
        </p>

        <Select
          size="lg"
          variant="bordered"
          aria-label="Category"
          selectedKeys={selectedCategory}
          onSelectionChange={handleCategorySelectionChange}
          className="min-w-0 rounded bg-gradient-dark"
          classNames={{
            base: "h-8",
            value: "text-base",
            trigger:
              "border border-gray-400 focus-within:!border-gray-300 h-8 min-h-[32px] max-h-[32px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
          }}
        >
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </Select>
      </div>
    </section>
  );
};

export default AdminSelectCategory;
