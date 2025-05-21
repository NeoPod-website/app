import React from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

import CategoryForm from "./CategoryForm";

const AdminEditCategory = ({
  podId,
  categoryData,
  isSubmitting,
  setIsSubmitting,
  initialCategoryData,
  handleCategoryDataChange,
}) => {
  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      const requiredFields = [
        { field: "name", label: "Title" },
        { field: "status", label: "Status" },
      ];

      // Check for empty required fields
      const missingFields = requiredFields.filter(
        ({ field }) =>
          !categoryData[field] || categoryData[field].trim() === "",
      );

      if (missingFields.length > 0) {
        const missingFieldLabels = missingFields.map(({ label }) => label);

        throw new Error(
          `Please fill in the following required fields: ${missingFieldLabels.join(", ")}`,
        );
      }

      // Additional validations
      if (categoryData.name.length < 3) {
        throw new Error("Title must be at least 3 characters long");
      }

      if (categoryData.name.length > 50) {
        throw new Error("Title cannot exceed 50 characters");
      }

      if (categoryData.description && categoryData.description.length > 100) {
        throw new Error("Description cannot exceed 100 characters");
      }

      // Set loading state after validations pass
      setIsSubmitting(true);

      // Create the payload with only required fields initially
      const categoryPayload = {
        pod_id: podId,
      };

      // Add other fields only if they have changed or are required
      if (categoryData.name !== initialCategoryData.name) {
        categoryPayload.name = categoryData.name.trim();
      }

      if (categoryData.status !== initialCategoryData.status) {
        categoryPayload.status = categoryData.status;
      }

      if (categoryData.description !== initialCategoryData.description) {
        categoryPayload.description = categoryData.description.trim() || "";
      }

      // Process cover photo ONLY if it's a new File object
      let coverPhotoKey = categoryData.cover_photo;
      if (categoryData.cover_photo instanceof File) {
        // Create form data for the image upload
        const formData = new FormData();
        formData.append("file", categoryData.cover_photo);

        // Sanitize the file name
        const fileName = categoryData.name
          .replace(/[^a-zA-Z0-9-_]/g, "-")
          .toLowerCase();

        // Upload the image
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/single/QUEST_CATEGORIES/${fileName}?fileName=cover_photo&size=BANNER&multiSize=false&noSubfolder=false`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Failed to upload cover photo: ${errorText}`);
        }

        // Get the key from the response
        const uploadData = await uploadResponse.json();
        coverPhotoKey = uploadData.data.key;

        // Add to payload only if it's a new file
        categoryPayload.cover_photo = coverPhotoKey;

        // Try to delete old cover photo if available
        if (initialCategoryData.original_cover_photo) {
          try {
            const deleteResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/uploads/file/${initialCategoryData.original_cover_photo}`,
              {
                method: "DELETE",
                credentials: "include",
              },
            );

            if (!deleteResponse.ok) {
              console.warn("Failed to delete old cover photo, but continuing");
            }
          } catch (error) {
            console.warn("Error deleting old cover photo:", error);
          }
        }
      }

      // Process icon ONLY if it's a new File object
      let iconKey = categoryData.icon;
      if (categoryData.icon instanceof File) {
        // Create form data for the image upload
        const formData = new FormData();
        formData.append("file", categoryData.icon);

        // Sanitize the file name
        const fileName = categoryData.name
          .replace(/[^a-zA-Z0-9-_]/g, "-")
          .toLowerCase();

        // Upload the image
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/single/QUEST_CATEGORIES/${fileName}?fileName=icon&size=THUMBNAIL&multiSize=false&noSubfolder=false`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Failed to upload icon: ${errorText}`);
        }

        // Get the key from the response
        const uploadData = await uploadResponse.json();
        iconKey = uploadData.data.key;

        // Add to payload only if it's a new file
        categoryPayload.icon = iconKey;

        // Try to delete old icon if available
        if (initialCategoryData.original_icon) {
          try {
            const deleteResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/uploads/file/${initialCategoryData.original_icon}`,
              {
                method: "DELETE",
                credentials: "include",
              },
            );

            if (!deleteResponse.ok) {
              console.warn("Failed to delete old icon, but continuing");
            }
          } catch (error) {
            console.warn("Error deleting old icon:", error);
          }
        }
      }

      console.log("categoryPayload", categoryPayload);

      // Send the request to update the category
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${initialCategoryData.category_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryPayload),
          credentials: "include",
        },
      );

      // Parse the response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      // Redirect to pods list
      router.push(`/admin/manage/categories/${podId}`);

      addToast({
        title: `Category ${categoryData.name} updated successfully`,
        color: "success",
      });
    } catch (error) {
      addToast({
        title: error.message || "Failed to update category",
        color: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CategoryForm
      isNew={false}
      podId={podId}
      icon={categoryData.icon}
      setIcon={(icon) => handleCategoryDataChange("icon", icon)}
      title={categoryData.name}
      setTitle={(name) => handleCategoryDataChange("name", name)}
      status={categoryData.status}
      setStatus={(status) => handleCategoryDataChange("status", status)}
      selectedFile={categoryData.cover_photo}
      setSelectedFile={(cover_photo) =>
        handleCategoryDataChange("cover_photo", cover_photo)
      }
      description={categoryData.description}
      setDescription={(description) =>
        handleCategoryDataChange("description", description)
      }
      isSubmitting={isSubmitting}
      handleFormSubmit={handleFormSubmit}
    />
  );
};

export default AdminEditCategory;
