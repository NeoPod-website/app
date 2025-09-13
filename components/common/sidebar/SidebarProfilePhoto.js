"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";

import useUpload from "@/hooks/useUpload";

const SidebarProfilePhoto = ({ user }) => {
  const { getFileViewUrl } = useUpload();

  const [signedUrl, setSignedUrl] = useState(
    "/dashboard/profile/default-profile.png",
  );
  const [isLoading, setIsLoading] = useState(false);

  const extractS3Key = useCallback((urlOrKey) => {
    if (
      !urlOrKey ||
      urlOrKey.includes("/dashboard/profile/default-profile.png")
    )
      return null;

    // If it's already a key (doesn't start with http), return as-is
    if (!urlOrKey.startsWith("http")) return urlOrKey;

    // If it's a URL, extract the key
    try {
      const urlObj = new URL(urlOrKey);
      return urlObj.pathname.substring(1);
    } catch {
      return urlOrKey.split("/").pop();
    }
  }, []);

  const loadSignedUrl = useCallback(
    async (photoUrlOrKey) => {
      if (
        !photoUrlOrKey ||
        photoUrlOrKey === "" ||
        photoUrlOrKey.includes("/dashboard/profile/default-profile.png")
      ) {
        setSignedUrl("/dashboard/profile/default-profile.png");
        return;
      }

      // If it's already a data URL (preview) or signed URL, use it directly
      if (
        photoUrlOrKey.startsWith("data:") ||
        photoUrlOrKey.includes("X-Amz-Signature")
      ) {
        setSignedUrl(photoUrlOrKey);
        return;
      }

      setIsLoading(true);

      try {
        // Handle both S3 keys and URLs
        const s3Key = photoUrlOrKey.startsWith("http")
          ? extractS3Key(photoUrlOrKey)
          : photoUrlOrKey;

        if (s3Key) {
          const signedUrlData = await getFileViewUrl(s3Key, 3600);
          const newSignedUrl =
            signedUrlData.signedUrl || signedUrlData.url || signedUrlData;

          if (newSignedUrl) {
            setSignedUrl(newSignedUrl);
          } else {
            // If signed URL generation failed and we have a full URL, try original
            setSignedUrl(
              photoUrlOrKey.startsWith("http")
                ? photoUrlOrKey
                : "/dashboard/profile/default-profile.png",
            );
          }
        } else {
          setSignedUrl("/dashboard/profile/default-profile.png");
        }
      } catch (error) {
        console.warn(
          "Failed to load signed URL for sidebar profile photo:",
          error,
        );
        // Fallback to original URL if it's a full URL, otherwise use default
        setSignedUrl(
          photoUrlOrKey.startsWith("http")
            ? photoUrlOrKey
            : "/dashboard/profile/default-profile.png",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [extractS3Key, getFileViewUrl],
  );

  useEffect(() => {
    loadSignedUrl(user?.profile_photo);
  }, [user?.profile_photo, loadSignedUrl]);

  const handleImageError = () => {
    setSignedUrl("/dashboard/profile/default-profile.png");
  };

  return (
    <Image
      width={48}
      height={48}
      src={signedUrl}
      priority={false}
      placeholder="blur"
      onError={handleImageError}
      alt={`${user?.username || "User"} Profile Photo`}
      className={`h-10 w-10 select-none rounded-md object-cover 3xl:h-12 3xl:w-12 ${
        isLoading ? "animate-pulse opacity-75" : ""
      }`}
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7+Cp9mJWl4nZkm73CqJSb7Cw+xRqYmwqM4a7rAHGKaX2sA88SsSwGkdHlHTjyf"
    />
  );
};

export default SidebarProfilePhoto;
