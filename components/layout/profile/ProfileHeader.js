"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo } from "react";

import useUpload from "@/hooks/useUpload";

import shortAddress from "@/utils/shortAddress";

import CopyToClipboard from "@/components/ui/CopyToClipboard";

const DEFAULT_PROFILE_IMAGE = "/dashboard/profile/default-profile.png";
const DEFAULT_WALLET = "0x0000000000000000000000000000000000000000";

const ProfileHeader = React.memo(({ user }) => {
  const { getFileViewUrl } = useUpload();

  const [imageError, setImageError] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(DEFAULT_PROFILE_IMAGE);

  const extractS3Key = useCallback((urlOrKey) => {
    if (!urlOrKey || urlOrKey.includes(DEFAULT_PROFILE_IMAGE)) return null;
    if (!urlOrKey.startsWith("http")) return urlOrKey;

    try {
      const urlObj = new URL(urlOrKey);
      return urlObj.pathname.substring(1);
    } catch {
      return urlOrKey.split("/").pop();
    }
  }, []);

  const loadProfilePhoto = useCallback(
    async (photoUrlOrKey) => {
      if (!photoUrlOrKey || photoUrlOrKey.includes(DEFAULT_PROFILE_IMAGE)) {
        setProfilePhotoUrl(DEFAULT_PROFILE_IMAGE);
        setImageError(false);
        return;
      }

      // Use existing signed URLs or data URLs directly
      if (
        photoUrlOrKey.startsWith("data:") ||
        photoUrlOrKey.includes("X-Amz-Signature")
      ) {
        setProfilePhotoUrl(photoUrlOrKey);
        setImageError(false);
        return;
      }

      setIsLoadingPhoto(true);
      setImageError(false);

      try {
        const s3Key = photoUrlOrKey.startsWith("http")
          ? extractS3Key(photoUrlOrKey)
          : photoUrlOrKey;

        if (s3Key) {
          const signedUrlData = await getFileViewUrl(s3Key, 3600);
          const newSignedUrl =
            signedUrlData?.signedUrl || signedUrlData?.url || signedUrlData;

          if (newSignedUrl) {
            setProfilePhotoUrl(newSignedUrl);
          } else {
            setProfilePhotoUrl(
              photoUrlOrKey.startsWith("http")
                ? photoUrlOrKey
                : DEFAULT_PROFILE_IMAGE,
            );
          }
        } else {
          setProfilePhotoUrl(DEFAULT_PROFILE_IMAGE);
        }
      } catch (error) {
        console.warn("Failed to load profile photo:", error.message);
        setProfilePhotoUrl(
          photoUrlOrKey.startsWith("http")
            ? photoUrlOrKey
            : DEFAULT_PROFILE_IMAGE,
        );
        setImageError(true);
      } finally {
        setIsLoadingPhoto(false);
      }
    },
    [extractS3Key, getFileViewUrl],
  );

  useEffect(() => {
    if (user?.profile_photo) {
      loadProfilePhoto(user.profile_photo);
    }
  }, [user?.profile_photo, loadProfilePhoto]);

  const handleImageError = useCallback(() => {
    if (!imageError) {
      setProfilePhotoUrl(DEFAULT_PROFILE_IMAGE);
      setImageError(true);
    }
  }, [imageError]);

  const walletAddress = useMemo(
    () => user?.wallet_address || DEFAULT_WALLET,
    [user?.wallet_address],
  );

  const shortWalletAddress = useMemo(
    () => shortAddress(walletAddress),
    [walletAddress],
  );

  return (
    <div className="relative">
      <div className="relative h-24 w-full overflow-hidden rounded-2xl sm:h-40 md:h-44 xl:h-28 3xl:h-32">
        <Image
          fill
          alt="Profile Banner"
          src="/backgrounds/background-2.png"
          className="object-cover opacity-70"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
      </div>

      <div className="mx-6 -mt-12 flex items-end justify-between sm:-mt-14 md:-mt-16">
        <div className="relative aspect-square w-28 overflow-hidden rounded-full border-4 border-black xl:w-32 3xl:w-36">
          <Image
            fill
            src={profilePhotoUrl}
            onError={handleImageError}
            alt={`${user?.username || "User"} profile picture`}
            className={`object-cover transition-opacity duration-200 ${
              isLoadingPhoto ? "animate-pulse opacity-75" : "opacity-100"
            }`}
            sizes="(max-width: 1280px) 112px, (max-width: 1536px) 128px, 144px"
          />
        </div>

        <div className="mb-2 flex items-center gap-3 rounded-lg border-t border-gray-400 bg-gradient-dark px-4 py-2.5 text-sm font-bold 3xl:text-base">
          <span className="select-all">{shortWalletAddress}</span>
          <CopyToClipboard text={walletAddress} />
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = "ProfileHeader";

export default ProfileHeader;
