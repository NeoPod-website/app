// "use client";

// import React from "react";
// import Image from "next/image";

// import useUpload from "@/hooks/useUpload";

// import shortAddress from "@/utils/shortAddress";

// import CopyToClipboard from "@/components/ui/CopyToClipboard";

// const ProfileHeader = ({ user }) => {
//   const { getPresignedUrl } = useUpload();

//   return (
//     <div className="relative">
//       <div className="relative h-32 w-full overflow-hidden rounded-2xl sm:h-40 md:h-44">
//         <Image
//           fill
//           alt="Profile Banner Image"
//           src="/backgrounds/background-2.png"
//           className="absolute left-0 top-0 h-full w-full object-cover opacity-70"
//         />
//       </div>

//       <div className="mx-6 -mt-12 flex items-end justify-between sm:-mt-14 md:-mt-16">
//         <div className="relative aspect-square w-28 overflow-hidden rounded-full border-4 border-black sm:w-32 md:w-36">
//           <Image
//             fill
//             alt="profile"
//             src={
//               user?.profile_photo || "/dashboard/profile/default-profile.png"
//             }
//             className="absolute left-0 top-0 h-full w-full object-cover"
//           />
//         </div>

//         <div className="mb-2 flex w-fit items-center gap-3 rounded-lg border-t border-gray-400 bg-gradient-dark px-4 py-2.5 text-sm font-bold sm:text-base">
//           {shortAddress(
//             user?.wallet_address ||
//               "0x0000000000000000000000000000000000000000",
//           )}
//           <CopyToClipboard text={user?.wallet_address || ""} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileHeader;

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

import useUpload from "@/hooks/useUpload";

import shortAddress from "@/utils/shortAddress";

import CopyToClipboard from "@/components/ui/CopyToClipboard";

const ProfileHeader = ({ user }) => {
  const { getFileViewUrl } = useUpload();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    "/dashboard/profile/default-profile.png",
  );
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

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

  const loadProfilePhoto = useCallback(
    async (photoUrlOrKey) => {
      if (
        !photoUrlOrKey ||
        photoUrlOrKey === "" ||
        photoUrlOrKey.includes("/dashboard/profile/default-profile.png")
      ) {
        setProfilePhotoUrl("/dashboard/profile/default-profile.png");
        return;
      }

      // If it's already a data URL (preview) or signed URL, use it directly
      if (
        photoUrlOrKey.startsWith("data:") ||
        photoUrlOrKey.includes("X-Amz-Signature")
      ) {
        setProfilePhotoUrl(photoUrlOrKey);
        return;
      }

      setIsLoadingPhoto(true);

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
            setProfilePhotoUrl(newSignedUrl);
          } else {
            // If signed URL generation failed and we have a full URL, try original
            setProfilePhotoUrl(
              photoUrlOrKey.startsWith("http")
                ? photoUrlOrKey
                : "/dashboard/profile/default-profile.png",
            );
          }
        } else {
          setProfilePhotoUrl("/dashboard/profile/default-profile.png");
        }
      } catch (error) {
        console.warn(
          "Failed to load signed URL for profile header photo:",
          error,
        );
        // Fallback to original URL if it's a full URL, otherwise use default
        setProfilePhotoUrl(
          photoUrlOrKey.startsWith("http")
            ? photoUrlOrKey
            : "/dashboard/profile/default-profile.png",
        );
      } finally {
        setIsLoadingPhoto(false);
      }
    },
    [extractS3Key, getFileViewUrl],
  );

  useEffect(() => {
    loadProfilePhoto(user?.profile_photo);
  }, [user?.profile_photo, loadProfilePhoto]);

  const handleImageError = () => {
    setProfilePhotoUrl("/dashboard/profile/default-profile.png");
  };

  return (
    <div className="relative">
      <div className="relative h-24 w-full overflow-hidden rounded-2xl sm:h-40 md:h-44 xl:h-28 3xl:h-32">
        <Image
          fill
          alt="Profile Banner Image"
          src="/backgrounds/background-2.png"
          className="absolute left-0 top-0 h-full w-full object-cover opacity-70"
        />
      </div>

      <div className="mx-6 -mt-12 flex items-end justify-between sm:-mt-14 md:-mt-16">
        <div className="relative aspect-square w-28 overflow-hidden rounded-full border-4 border-black xl:w-32 3xl:w-36">
          <Image
            fill
            alt="profile"
            src={profilePhotoUrl}
            onError={handleImageError}
            className={`absolute left-0 top-0 h-full w-full object-cover ${isLoadingPhoto ? "animate-pulse opacity-75" : ""}`}
          />
        </div>

        <div className="mb-2 flex w-fit items-center gap-3 rounded-lg border-t border-gray-400 bg-gradient-dark px-4 py-2.5 text-sm font-bold 3xl:text-base">
          {shortAddress(
            user?.wallet_address ||
              "0x0000000000000000000000000000000000000000",
          )}
          <CopyToClipboard text={user?.wallet_address || ""} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
