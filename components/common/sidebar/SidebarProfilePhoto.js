"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useUpload from "@/hooks/useUpload";

const SidebarProfilePhoto = ({ user }) => {
  const { getFileViewUrl } = useUpload();
  const [signedUrl, setSignedUrl] = useState(
    "/dashboard/profile/default-profile.png",
  );
  const [isLoading, setIsLoading] = useState(false);

  const extractS3Key = useCallback((url) => {
    if (!url || url.includes("/dashboard/profile/default-profile.png"))
      return null;
    if (!url.includes("/")) return url;

    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1);
    } catch {
      return url.split("/").pop();
    }
  }, []);

  const loadSignedUrl = useCallback(
    async (photoUrl) => {
      if (
        !photoUrl ||
        photoUrl === "" ||
        photoUrl.includes("/dashboard/profile/default-profile.png")
      ) {
        setSignedUrl("/dashboard/profile/default-profile.png");
        return;
      }

      if (
        photoUrl.startsWith("data:") ||
        photoUrl.includes("X-Amz-Signature")
      ) {
        setSignedUrl(photoUrl);
        return;
      }

      setIsLoading(true);

      try {
        const s3Key = extractS3Key(photoUrl);
        if (s3Key) {
          const signedUrlData = await getFileViewUrl(s3Key, 3600);
          const newSignedUrl =
            signedUrlData.signedUrl || signedUrlData.url || signedUrlData;
          setSignedUrl(
            newSignedUrl || "/dashboard/profile/default-profile.png",
          );
        } else {
          setSignedUrl(photoUrl);
        }
      } catch (error) {
        setSignedUrl("/dashboard/profile/default-profile.png");
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
      alt={`${user?.username || "User"} Profile Photo`}
      className={`h-10 w-10 rounded-md object-cover 3xl:h-12 3xl:w-12 ${
        isLoading ? "animate-pulse opacity-75" : ""
      }`}
      src={signedUrl}
      onError={handleImageError}
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7+Cp9mJWl4nZkm73CqJSb7Cw+xRqYmwqM4a7rAHGKaX2sA88SsSwGkdHlHTjyf"
    />
  );
};

export default SidebarProfilePhoto;
