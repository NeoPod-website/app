"use client";

import { useDispatch } from "react-redux";
import { PackageOpenIcon } from "lucide-react";
import { Select, SelectItem, addToast } from "@heroui/react";
import React, { useCallback, useEffect, useState, memo } from "react";

import { setCurrentQuest } from "@/redux/slice/questSlice";
import { setCurrentCategory } from "@/redux/slice/categorySlice";

const AdminSelectCategory = memo(({ podId, categoryId }) => {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    new Set([categoryId]),
  );

  // Handle category selection change
  const handleCategorySelectionChange = useCallback(
    (keys) => {
      const value = Array.from(keys)[0]; // More consistent with other components
      setSelectedCategory(keys);
      dispatch(setCurrentQuest({ categoryId: value }));

      // Also update the category in categorySlice
      const selectedCat = categories.find((cat) => cat.category_id === value);
      if (selectedCat) {
        dispatch(setCurrentCategory(selectedCat));
      }
    },
    [dispatch, categories],
  );

  // Fetch categories when podId changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!podId) {
        setCategories([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const url = `${API_URL}/categories/pod/${podId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Error ${response.status}`);
        }

        const fetchedCategories =
          data.data?.categories || data.categories || [];
        setCategories(fetchedCategories);

        // Set initial category if provided
        if (categoryId) {
          const cat = fetchedCategories.find(
            (cat) => cat.category_id === categoryId,
          );

          setSelectedCategory(new Set([categoryId]));
          dispatch(setCurrentQuest({ categoryId, podId }));

          if (cat) {
            dispatch(setCurrentCategory(cat));
          }
        }
      } catch (err) {
        addToast({
          title: "Error",
          color: "danger",
          description: err.message || "Failed to fetch categories",
        });
        setCategories([]); // Reset on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [podId, categoryId, dispatch]);

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
          isLoading={isLoading}
          selectedKeys={selectedCategory}
          onSelectionChange={handleCategorySelectionChange}
          className="min-w-0 rounded bg-gradient-dark"
          classNames={{
            base: "h-8",
            value: "text-base",
            trigger:
              "border border-gray-400 focus-within:!border-gray-300 h-8 min-h-8 max-h-8 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
          }}
        >
          {categories.map((category) => (
            <SelectItem key={category.category_id} value={category.category_id}>
              {category.title || category.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    </section>
  );
});

AdminSelectCategory.displayName = "AdminSelectCategory";

export default AdminSelectCategory;
