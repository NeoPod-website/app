"use client";

import {
  X,
  User,
  Mail,
  Save,
  Edit3,
  MapPin,
  Camera,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { addToast } from "@heroui/react";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Button, Input, Avatar } from "@heroui/react";

const ProfileTab = ({
  username,
  email,
  location,
  profile_photo,
  ambassador_id,
  joining_date,
}) => {
  const [profileState, setProfileState] = useState({
    isLoading: false,
    isUpdating: false,
    isUploadingPhoto: false,
    error: null,
    lastUpdated: null,
    hasChanges: false,
  });

  const [formData, setFormData] = useState({
    username: username || "",
    email: email || "",
    location: location || "",
    profile_photo: profile_photo || "",
  });

  const [originalData, setOriginalData] = useState({});
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Set original data for comparison
    const original = {
      username: username || "",
      email: email || "",
      location: location || "",
      profile_photo: profile_photo || "",
    };
    setOriginalData(original);
    setFormData(original);
  }, [username, email, location, profile_photo]);

  // Check if there are changes
  useEffect(() => {
    const hasChanges =
      Object.keys(formData).some(
        (key) => formData[key] !== originalData[key],
      ) || previewPhoto !== null;
    setProfileState((prev) => ({ ...prev, hasChanges }));
  }, [formData, originalData, previewPhoto]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Invalid File",
        description: "Please select an image file",
        color: "danger",
        timeout: 4000,
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        color: "danger",
        timeout: 4000,
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewPhoto({
        file,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreviewPhoto(null);
    setFormData((prev) => ({
      ...prev,
      profile_photo: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadProfilePhoto = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append("photo", file);
    uploadFormData.append("type", "profile");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/uploads/profile-photo`,
      {
        method: "POST",
        credentials: "include",
        body: uploadFormData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload photo");
    }

    const data = await response.json();
    return data.photoUrl;
  };

  const handleSaveProfile = async () => {
    if (!profileState.hasChanges) {
      addToast({
        title: "No Changes",
        description: "No changes detected to save",
        color: "default",
        timeout: 3000,
      });
      return;
    }

    setProfileState((prev) => ({ ...prev, isUpdating: true, error: null }));

    try {
      let updatedData = { ...formData };

      // Upload photo if there's a new one
      if (previewPhoto?.file) {
        setProfileState((prev) => ({ ...prev, isUploadingPhoto: true }));
        const photoUrl = await uploadProfilePhoto(previewPhoto.file);
        updatedData.profile_photo = photoUrl;
        setProfileState((prev) => ({ ...prev, isUploadingPhoto: false }));
      }

      // Update profile
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      // Update original data to reflect saved changes
      setOriginalData(updatedData);
      setFormData(updatedData);
      setPreviewPhoto(null);

      addToast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
        color: "success",
        timeout: 4000,
      });

      setProfileState((prev) => ({
        ...prev,
        isUpdating: false,
        isUploadingPhoto: false,
        lastUpdated: new Date(),
        hasChanges: false,
      }));

      // Refresh the page to get updated data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Profile update error:", error);

      addToast({
        title: "Update Failed",
        description: error.message,
        color: "danger",
        timeout: 6000,
      });

      setProfileState((prev) => ({
        ...prev,
        isUpdating: false,
        isUploadingPhoto: false,
        error: error.message,
      }));
    }
  };

  const handleResetChanges = () => {
    setFormData(originalData);
    setPreviewPhoto(null);
    setProfileState((prev) => ({ ...prev, hasChanges: false, error: null }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    addToast({
      title: "Changes Reset",
      description: "All changes have been reset to original values",
      color: "default",
      timeout: 3000,
    });
  };

  const getCurrentPhotoUrl = () => {
    if (previewPhoto) return previewPhoto.preview;
    if (formData.profile_photo) return formData.profile_photo;
    return null;
  };

  // Loading state
  // if (username === undefined || email === undefined) {
  //   return (
  //     <div className="mx-auto mt-10 text-center">
  //       <Spinner size="lg" className="mb-4" color="white" />
  //       <h3 className="mb-2 text-lg font-medium text-white">
  //         Loading Profile Data
  //       </h3>
  //       <p className="text-sm text-gray-200">
  //         Fetching your profile information...
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
            <Edit3 size={24} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Update your personal information
              </span>
              {profileState.lastUpdated && (
                <span className="text-xs text-gray-500">
                  • Updated {profileState.lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profileState.hasChanges && (
            <Button
              variant="flat"
              size="sm"
              onPress={handleResetChanges}
              startContent={<RefreshCw size={16} />}
            >
              Reset Changes
            </Button>
          )}
          <Button
            color="primary"
            size="sm"
            onPress={handleSaveProfile}
            isLoading={profileState.isUpdating || profileState.isUploadingPhoto}
            isDisabled={!profileState.hasChanges}
            startContent={
              !profileState.isUpdating &&
              !profileState.isUploadingPhoto && <Save size={16} />
            }
          >
            {profileState.isUploadingPhoto
              ? "Uploading..."
              : profileState.isUpdating
                ? "Saving..."
                : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Profile Photo Section */}
      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <Camera size={20} className="text-green-400" />
            <h3 className="text-lg font-semibold text-white">Profile Photo</h3>
            {previewPhoto && (
              <span className="ml-2 inline-flex items-center rounded-full bg-orange-900/50 px-2 py-1 text-xs font-medium text-orange-400">
                New Photo Selected
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative">
              <Avatar
                src={getCurrentPhotoUrl()}
                name={formData.username || "User"}
                size="lg"
                className="h-24 w-24"
                classNames={{
                  base: "ring-2 ring-gray-600",
                  img: "object-cover",
                }}
              />
              {getCurrentPhotoUrl() && (
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  className="absolute -right-2 -top-2 bg-red-600/80 text-white"
                  onPress={handleRemovePhoto}
                >
                  <X size={14} />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h4 className="mb-1 text-sm font-medium text-white">
                  Upload New Photo
                </h4>
                <p className="mb-3 text-xs text-gray-400">
                  Choose a photo to represent your profile. Recommended size:
                  400x400px, max 5MB.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="flat"
                  startContent={<Upload size={16} />}
                  onPress={() => fileInputRef.current?.click()}
                >
                  Choose Photo
                </Button>
                {getCurrentPhotoUrl() && (
                  <Button
                    variant="flat"
                    color="danger"
                    startContent={<X size={16} />}
                    onPress={handleRemovePhoto}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <div className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF • Maximum size: 5MB
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Personal Information */}
      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Personal Information
            </h3>
            {profileState.hasChanges && (
              <span className="ml-2 inline-flex items-center rounded-full bg-orange-900/50 px-2 py-1 text-xs font-medium text-orange-400">
                Unsaved Changes
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Username <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Enter your username"
                startContent={<User size={16} className="text-gray-400" />}
                classNames={{
                  input: "text-white",
                  inputWrapper: `border-gray-700 bg-gray-800/50 ${
                    formData.username !== originalData.username
                      ? "border-orange-500/50"
                      : ""
                  }`,
                }}
                isRequired
              />
              <p className="text-xs text-gray-500">
                Public display name visible to other users
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                startContent={<Mail size={16} className="text-gray-400" />}
                classNames={{
                  input: "text-white",
                  inputWrapper: `border-gray-700 bg-gray-800/50 ${
                    formData.email !== originalData.email
                      ? "border-orange-500/50"
                      : ""
                  }`,
                }}
                isRequired
              />
              <p className="text-xs text-gray-500">
                Primary email for account notifications
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-gray-300">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter your location (e.g., San Francisco, CA)"
                startContent={<MapPin size={16} className="text-gray-400" />}
                classNames={{
                  input: "text-white",
                  inputWrapper: `border-gray-700 bg-gray-800/50 ${
                    formData.location !== originalData.location
                      ? "border-orange-500/50"
                      : ""
                  }`,
                }}
              />
              <p className="text-xs text-gray-500">
                Your location helps with regional quest matching (optional)
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Save Actions */}
      {profileState.hasChanges && (
        <Card className="border border-orange-500/20 bg-gradient-to-br from-orange-900/20 to-yellow-900/20 backdrop-blur-xl">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-orange-400">
                    Unsaved Changes
                  </p>
                  <p className="text-xs text-gray-400">
                    You have unsaved changes. Save or reset to continue.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="flat" size="sm" onPress={handleResetChanges}>
                  Reset
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onPress={handleSaveProfile}
                  isLoading={
                    profileState.isUpdating || profileState.isUploadingPhoto
                  }
                  startContent={
                    !profileState.isUpdating &&
                    !profileState.isUploadingPhoto && <Save size={16} />
                  }
                >
                  {profileState.isUploadingPhoto
                    ? "Uploading..."
                    : profileState.isUpdating
                      ? "Saving..."
                      : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Error Display */}
      {profileState.error && (
        <Card className="border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 text-red-400" />
              <div>
                <h4 className="mb-2 font-medium text-red-400">
                  Profile Update Error
                </h4>
                <p className="text-sm text-gray-300">{profileState.error}</p>
                <button
                  onClick={() =>
                    setProfileState((prev) => ({ ...prev, error: null }))
                  }
                  className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Help Section */}
      <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="mt-0.5 text-blue-400" />
            <div>
              <h4 className="mb-2 font-medium text-blue-400">
                Profile Guidelines
              </h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>
                  <span>Choose a clear, recognizable profile photo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Use your real name or known handle as username</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  <span>
                    Keep your email updated for important notifications
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                  <span>
                    Location helps us provide relevant regional content
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileTab;
