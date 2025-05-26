import { useState, useCallback } from "react";

const useUpload = () => {
  const [uploadStates, setUploadStates] = useState({});

  // Update upload state for tracking
  const updateUploadState = useCallback((key, updates) => {
    setUploadStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
  }, []);

  // Utility function to sanitize file names
  const sanitizeFileName = useCallback((name) => {
    return name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
  }, []);

  // Single file upload - updated to match backend API
  const uploadFile = useCallback(
    async (file, options = {}) => {
      const {
        entityType = "QUEST_CATEGORIES",
        entityId,
        fileName,
        fileType = "file", // This maps to fileName query param in backend
        size = "MEDIUM",
        multiSize = false,
        noSubfolder = false,
        trackingKey = null,
      } = options;

      // Track upload state if trackingKey provided
      if (trackingKey) {
        updateUploadState(trackingKey, {
          status: "uploading",
          fileName: fileName || file.name,
          fileType,
        });
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Build URL - updated to match your backend routes
        const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/single/${entityType}`;
        const entityPath = entityId ? `/${entityId}` : "";

        // Build query parameters to match backend expectations
        const queryParams = new URLSearchParams({
          fileName: fileType, // Backend expects this as fileName query param
          size,
          multiSize: multiSize.toString(),
          noSubfolder: noSubfolder.toString(),
        });

        const uploadResponse = await fetch(
          `${baseUrl}${entityPath}?${queryParams.toString()}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          const errorMessage =
            errorData.message || `Failed to upload ${fileType}`;
          throw new Error(errorMessage);
        }

        const uploadData = await uploadResponse.json();

        // Track success state
        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "completed",
            key: uploadData.data.key,
            url: uploadData.data.url,
            entityId: uploadData.data.entityId,
          });
        }

        return uploadData.data;
      } catch (error) {
        // Track error state
        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "error",
            error: error.message,
          });
        }
        throw error;
      }
    },
    [updateUploadState],
  );

  // Multiple file upload - updated to match backend
  const uploadMultipleFiles = useCallback(
    async (files, options = {}) => {
      const {
        entityType = "QUEST_CATEGORIES",
        entityId,
        size = "MEDIUM",
        multiSizeMode = false, // Use multi-size endpoint
        sizes = ["THUMBNAIL", "MEDIUM"], // For multi-size uploads
        trackingKey = null,
      } = options;

      if (trackingKey) {
        updateUploadState(trackingKey, {
          status: "uploading",
          total: files.length,
          completed: 0,
        });
      }

      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });

        // Choose endpoint based on multiSizeMode
        const endpoint = multiSizeMode ? "multi-size" : "multiple";
        const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${endpoint}/${entityType}`;
        const entityPath = entityId ? `/${entityId}` : "";

        // Build query parameters
        const queryParams = new URLSearchParams({ size });
        if (multiSizeMode && sizes.length > 0) {
          queryParams.set("sizes", sizes.join(","));
        }

        const uploadResponse = await fetch(
          `${baseUrl}${entityPath}?${queryParams.toString()}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          const errorMessage = errorData.message || "Failed to upload files";
          throw new Error(errorMessage);
        }

        const uploadData = await uploadResponse.json();

        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "completed",
            completed: files.length,
            results: uploadData.data,
          });
        }

        return uploadData.data;
      } catch (error) {
        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "error",
            error: error.message,
          });
        }
        throw error;
      }
    },
    [updateUploadState],
  );

  // Delete file - updated to handle S3 key format properly
  const deleteFile = useCallback(
    async (fileKey, options = {}) => {
      const { trackingKey = null } = options;

      if (trackingKey) {
        updateUploadState(trackingKey, {
          status: "deleting",
          fileKey,
        });
      }

      try {
        // Use encodeURIComponent to handle slashes in S3 keys
        const encodedKey = encodeURIComponent(fileKey);
        const deleteResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/file/${encodedKey}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        if (!deleteResponse.ok) {
          const errorData = await deleteResponse.json().catch(() => ({}));
          const errorMessage =
            errorData.message || `Failed to delete file: ${fileKey}`;
          throw new Error(errorMessage);
        }

        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "deleted",
            fileKey,
          });
        }

        return true;
      } catch (error) {
        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "error",
            error: error.message,
          });
        }

        return false;
      }
    },
    [updateUploadState],
  );

  // Delete entity files - updated to match backend route
  const deleteEntityFiles = useCallback(
    async (entityId, options = {}) => {
      const {
        entityType = "QUEST_CATEGORIES",
        trackingKey = null,
        onSuccess,
        onError,
      } = options;

      if (trackingKey) {
        updateUploadState(trackingKey, {
          status: "deleting",
          entityId,
        });
      }

      try {
        // Convert entity type to kebab-case for URL (backend expects kebab-case)
        const kebabCaseEntityType = entityType.toLowerCase().replace(/_/g, "-");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/entity/${kebabCaseEntityType}/${entityId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.message || "Failed to delete entity files";
          throw new Error(errorMessage);
        }

        const result = await response.json();

        if (result.status !== "success") {
          throw new Error(result.message || "Delete failed");
        }

        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "deleted",
            entityId,
            stats: result.data.stats,
          });
        }

        onSuccess?.(entityId, result.data.stats);
        return result.data.stats;
      } catch (error) {
        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "error",
            error: error.message,
          });
        }

        return false;
      }
    },
    [updateUploadState],
  );

  // Delete multiple files by keys
  const deleteMultipleFiles = useCallback(
    async (fileKeys, options = {}) => {
      const { trackingKey = null } = options;

      if (trackingKey) {
        updateUploadState(trackingKey, {
          status: "deleting",
          total: fileKeys.length,
          completed: 0,
        });
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/multiple`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keys: fileKeys }),
            credentials: "include",
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Failed to delete files";
          throw new Error(errorMessage);
        }

        const result = await response.json();

        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "completed",
            completed: fileKeys.length,
            results: result.data.results,
          });
        }

        return result.data.results;
      } catch (error) {
        if (trackingKey) {
          updateUploadState(trackingKey, {
            status: "error",
            error: error.message,
          });
        }

        return false;
      }
    },
    [updateUploadState],
  );

  // Upload and replace - handles upload + delete old file
  const uploadAndReplace = useCallback(
    async (file, oldFileKey, options = {}) => {
      const { trackingKey = null } = options;

      try {
        // Upload new file first
        const uploadResult = await uploadFile(file, {
          ...options,
          trackingKey,
        });

        // Delete old file if it exists (don't fail if delete fails)
        if (oldFileKey) {
          await deleteFile(oldFileKey, { trackingKey: null }); // Don't track delete
        }

        return uploadResult;
      } catch (error) {
        throw error;
      }
    },
    [uploadFile, deleteFile],
  );

  // Get presigned URL for direct upload
  const getPresignedUrl = useCallback(async (options = {}) => {
    const {
      entityType = "QUEST_CATEGORIES",
      entityId,
      contentType,
      fileName,
      size = "MEDIUM",
    } = options;

    if (!contentType || !fileName) {
      throw new Error("Content type and file name are required");
    }

    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/presigned/${entityType}`;
      const entityPath = entityId ? `/${entityId}` : "";

      const queryParams = new URLSearchParams({
        contentType,
        fileName,
        size,
      });

      const response = await fetch(
        `${baseUrl}${entityPath}?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Failed to get presigned URL";
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Get signed view URL for a file
  const getFileViewUrl = useCallback(async (fileKey, expiresIn = 3600) => {
    try {
      const encodedKey = encodeURIComponent(fileKey);
      const queryParams = new URLSearchParams({
        expiresIn: expiresIn.toString(),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/view/${encodedKey}?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Failed to get view URL";
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Get signed view URLs for multiple files
  const getMultipleFileViewUrls = useCallback(
    async (fileKeys, expiresIn = 3600) => {
      try {
        const queryParams = new URLSearchParams({
          expiresIn: expiresIn.toString(),
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/view-multiple?${queryParams.toString()}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keys: fileKeys }),
            credentials: "include",
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Failed to get view URLs";
          throw new Error(errorMessage);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        throw error;
      }
    },
    [],
  );

  // Clear upload state
  const clearUploadState = useCallback((key) => {
    setUploadStates((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  // Get upload state
  const getUploadState = useCallback(
    (key) => {
      return uploadStates[key] || null;
    },
    [uploadStates],
  );

  return {
    // Core functions
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    deleteEntityFiles,
    deleteMultipleFiles,
    uploadAndReplace,

    // Presigned and view URLs
    getPresignedUrl,
    getFileViewUrl,
    getMultipleFileViewUrls,

    // State management
    uploadStates,
    getUploadState,
    clearUploadState,

    // Utilities
    sanitizeFileName,
  };
};

export default useUpload;
