// "use client";

// import {
//   X,
//   User,
//   Mail,
//   Save,
//   Edit3,
//   MapPin,
//   Camera,
//   Upload,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";
// import { addToast } from "@heroui/react";
// import React, { useState, useEffect, useRef } from "react";
// import { Card, CardBody, Button, Input, Avatar } from "@heroui/react";

// const ProfileTab = ({
//   username,
//   email,
//   location,
//   profile_photo,
//   ambassador_id,
//   joining_date,
// }) => {
//   const [profileState, setProfileState] = useState({
//     isLoading: false,
//     isUpdating: false,
//     isUploadingPhoto: false,
//     error: null,
//     lastUpdated: null,
//     hasChanges: false,
//   });

//   const [formData, setFormData] = useState({
//     username: username || "",
//     email: email || "",
//     location: location || "",
//     profile_photo: profile_photo || "",
//   });

//   const [originalData, setOriginalData] = useState({});
//   const [previewPhoto, setPreviewPhoto] = useState(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     // Set original data for comparison
//     const original = {
//       username: username || "",
//       email: email || "",
//       location: location || "",
//       profile_photo: profile_photo || "",
//     };
//     setOriginalData(original);
//     setFormData(original);
//   }, [username, email, location, profile_photo]);

//   // Check if there are changes
//   useEffect(() => {
//     const hasChanges =
//       Object.keys(formData).some(
//         (key) => formData[key] !== originalData[key],
//       ) || previewPhoto !== null;
//     setProfileState((prev) => ({ ...prev, hasChanges }));
//   }, [formData, originalData, previewPhoto]);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handlePhotoSelect = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       addToast({
//         title: "Invalid File",
//         description: "Please select an image file",
//         color: "danger",
//         timeout: 4000,
//       });
//       return;
//     }

//     // Validate file size (5MB limit)
//     if (file.size > 5 * 1024 * 1024) {
//       addToast({
//         title: "File Too Large",
//         description: "Please select an image smaller than 5MB",
//         color: "danger",
//         timeout: 4000,
//       });
//       return;
//     }

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreviewPhoto({
//         file,
//         preview: e.target.result,
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRemovePhoto = () => {
//     setPreviewPhoto(null);
//     setFormData((prev) => ({
//       ...prev,
//       profile_photo: "",
//     }));
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const uploadProfilePhoto = async (file) => {
//     const uploadFormData = new FormData();
//     uploadFormData.append("photo", file);
//     uploadFormData.append("type", "profile");

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/uploads/profile-photo`,
//       {
//         method: "POST",
//         credentials: "include",
//         body: uploadFormData,
//       },
//     );

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || "Failed to upload photo");
//     }

//     const data = await response.json();
//     return data.photoUrl;
//   };

//   const handleSaveProfile = async () => {
//     if (!profileState.hasChanges) {
//       addToast({
//         title: "No Changes",
//         description: "No changes detected to save",
//         color: "default",
//         timeout: 3000,
//       });
//       return;
//     }

//     setProfileState((prev) => ({ ...prev, isUpdating: true, error: null }));

//     try {
//       let updatedData = { ...formData };

//       // Upload photo if there's a new one
//       if (previewPhoto?.file) {
//         setProfileState((prev) => ({ ...prev, isUploadingPhoto: true }));
//         const photoUrl = await uploadProfilePhoto(previewPhoto.file);
//         updatedData.profile_photo = photoUrl;
//         setProfileState((prev) => ({ ...prev, isUploadingPhoto: false }));
//       }

//       // Update profile
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify(updatedData),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || "Failed to update profile");
//       }

//       // Update original data to reflect saved changes
//       setOriginalData(updatedData);
//       setFormData(updatedData);
//       setPreviewPhoto(null);

//       addToast({
//         title: "Profile Updated",
//         description: "Your profile has been successfully updated",
//         color: "success",
//         timeout: 4000,
//       });

//       setProfileState((prev) => ({
//         ...prev,
//         isUpdating: false,
//         isUploadingPhoto: false,
//         lastUpdated: new Date(),
//         hasChanges: false,
//       }));

//       // Refresh the page to get updated data
//       setTimeout(() => {
//         window.location.reload();
//       }, 2000);
//     } catch (error) {
//       console.error("Profile update error:", error);

//       addToast({
//         title: "Update Failed",
//         description: error.message,
//         color: "danger",
//         timeout: 6000,
//       });

//       setProfileState((prev) => ({
//         ...prev,
//         isUpdating: false,
//         isUploadingPhoto: false,
//         error: error.message,
//       }));
//     }
//   };

//   const handleResetChanges = () => {
//     setFormData(originalData);
//     setPreviewPhoto(null);
//     setProfileState((prev) => ({ ...prev, hasChanges: false, error: null }));

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     addToast({
//       title: "Changes Reset",
//       description: "All changes have been reset to original values",
//       color: "default",
//       timeout: 3000,
//     });
//   };

//   const getCurrentPhotoUrl = () => {
//     if (previewPhoto) return previewPhoto.preview;
//     if (formData.profile_photo) return formData.profile_photo;
//     return null;
//   };

//   // Loading state
//   // if (username === undefined || email === undefined) {
//   //   return (
//   //     <div className="mx-auto mt-10 text-center">
//   //       <Spinner size="lg" className="mb-4" color="white" />
//   //       <h3 className="mb-2 text-lg font-medium text-white">
//   //         Loading Profile Data
//   //       </h3>
//   //       <p className="text-sm text-gray-200">
//   //         Fetching your profile information...
//   //       </p>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//         <div className="flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
//             <Edit3 size={24} className="text-purple-400" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-400">
//                 Update your personal information
//               </span>
//               {profileState.lastUpdated && (
//                 <span className="text-xs text-gray-500">
//                   • Updated {profileState.lastUpdated.toLocaleTimeString()}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {profileState.hasChanges && (
//             <Button
//               variant="flat"
//               size="sm"
//               onPress={handleResetChanges}
//               startContent={<RefreshCw size={16} />}
//             >
//               Reset Changes
//             </Button>
//           )}
//           <Button
//             color="primary"
//             size="sm"
//             onPress={handleSaveProfile}
//             isLoading={profileState.isUpdating || profileState.isUploadingPhoto}
//             isDisabled={!profileState.hasChanges}
//             startContent={
//               !profileState.isUpdating &&
//               !profileState.isUploadingPhoto && <Save size={16} />
//             }
//           >
//             {profileState.isUploadingPhoto
//               ? "Uploading..."
//               : profileState.isUpdating
//                 ? "Saving..."
//                 : "Save Changes"}
//           </Button>
//         </div>
//       </div>

//       {/* Profile Photo Section */}
//       <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-6 flex items-center gap-2">
//             <Camera size={20} className="text-green-400" />
//             <h3 className="text-lg font-semibold text-white">Profile Photo</h3>
//             {previewPhoto && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-orange-900/50 px-2 py-1 text-xs font-medium text-orange-400">
//                 New Photo Selected
//               </span>
//             )}
//           </div>

//           <div className="flex flex-col items-center gap-6 sm:flex-row">
//             <div className="relative">
//               <Avatar
//                 src={getCurrentPhotoUrl()}
//                 name={formData.username || "User"}
//                 size="lg"
//                 className="h-24 w-24"
//                 classNames={{
//                   base: "ring-2 ring-gray-600",
//                   img: "object-cover",
//                 }}
//               />
//               {getCurrentPhotoUrl() && (
//                 <Button
//                   isIconOnly
//                   variant="flat"
//                   size="sm"
//                   className="absolute -right-2 -top-2 bg-red-600/80 text-white"
//                   onPress={handleRemovePhoto}
//                 >
//                   <X size={14} />
//                 </Button>
//               )}
//             </div>

//             <div className="flex-1 space-y-3">
//               <div>
//                 <h4 className="mb-1 text-sm font-medium text-white">
//                   Upload New Photo
//                 </h4>
//                 <p className="mb-3 text-xs text-gray-400">
//                   Choose a photo to represent your profile. Recommended size:
//                   400x400px, max 5MB.
//                 </p>
//               </div>

//               <div className="flex gap-2">
//                 <Button
//                   variant="flat"
//                   startContent={<Upload size={16} />}
//                   onPress={() => fileInputRef.current?.click()}
//                 >
//                   Choose Photo
//                 </Button>
//                 {getCurrentPhotoUrl() && (
//                   <Button
//                     variant="flat"
//                     color="danger"
//                     startContent={<X size={16} />}
//                     onPress={handleRemovePhoto}
//                   >
//                     Remove
//                   </Button>
//                 )}
//               </div>

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePhotoSelect}
//                 className="hidden"
//               />

//               <div className="text-xs text-gray-500">
//                 Supported formats: JPG, PNG, GIF • Maximum size: 5MB
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       {/* Personal Information */}
//       <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-6 flex items-center gap-2">
//             <User size={20} className="text-blue-400" />
//             <h3 className="text-lg font-semibold text-white">
//               Personal Information
//             </h3>
//             {profileState.hasChanges && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-orange-900/50 px-2 py-1 text-xs font-medium text-orange-400">
//                 Unsaved Changes
//               </span>
//             )}
//           </div>

//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             {/* Username */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-300">
//                 Username <span className="text-red-400">*</span>
//               </label>
//               <Input
//                 value={formData.username}
//                 onChange={(e) => handleInputChange("username", e.target.value)}
//                 placeholder="Enter your username"
//                 startContent={<User size={16} className="text-gray-400" />}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.username !== originalData.username
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//                 isRequired
//               />
//               <p className="text-xs text-gray-500">
//                 Public display name visible to other users
//               </p>
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-300">
//                 Email Address <span className="text-red-400">*</span>
//               </label>
//               <Input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 placeholder="Enter your email"
//                 startContent={<Mail size={16} className="text-gray-400" />}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.email !== originalData.email
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//                 isRequired
//               />
//               <p className="text-xs text-gray-500">
//                 Primary email for account notifications
//               </p>
//             </div>

//             {/* Location */}
//             <div className="space-y-2 lg:col-span-2">
//               <label className="text-sm font-medium text-gray-300">
//                 Location
//               </label>
//               <Input
//                 value={formData.location}
//                 onChange={(e) => handleInputChange("location", e.target.value)}
//                 placeholder="Enter your location (e.g., San Francisco, CA)"
//                 startContent={<MapPin size={16} className="text-gray-400" />}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.location !== originalData.location
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//               />
//               <p className="text-xs text-gray-500">
//                 Your location helps with regional quest matching (optional)
//               </p>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       {/* Save Actions */}
//       {profileState.hasChanges && (
//         <Card className="border border-orange-500/20 bg-gradient-to-br from-orange-900/20 to-yellow-900/20 backdrop-blur-xl">
//           <CardBody className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <AlertCircle size={20} className="text-orange-400" />
//                 <div>
//                   <p className="text-sm font-medium text-orange-400">
//                     Unsaved Changes
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     You have unsaved changes. Save or reset to continue.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="flat" size="sm" onPress={handleResetChanges}>
//                   Reset
//                 </Button>
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onPress={handleSaveProfile}
//                   isLoading={
//                     profileState.isUpdating || profileState.isUploadingPhoto
//                   }
//                   startContent={
//                     !profileState.isUpdating &&
//                     !profileState.isUploadingPhoto && <Save size={16} />
//                   }
//                 >
//                   {profileState.isUploadingPhoto
//                     ? "Uploading..."
//                     : profileState.isUpdating
//                       ? "Saving..."
//                       : "Save Changes"}
//                 </Button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {/* Error Display */}
//       {profileState.error && (
//         <Card className="border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl">
//           <CardBody className="p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle size={20} className="mt-0.5 text-red-400" />
//               <div>
//                 <h4 className="mb-2 font-medium text-red-400">
//                   Profile Update Error
//                 </h4>
//                 <p className="text-sm text-gray-300">{profileState.error}</p>
//                 <button
//                   onClick={() =>
//                     setProfileState((prev) => ({ ...prev, error: null }))
//                   }
//                   className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
//                 >
//                   Dismiss
//                 </button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {/* Help Section */}
//       <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="flex items-start gap-3">
//             <CheckCircle size={20} className="mt-0.5 text-blue-400" />
//             <div>
//               <h4 className="mb-2 font-medium text-blue-400">
//                 Profile Guidelines
//               </h4>
//               <div className="space-y-2 text-sm text-gray-300">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>
//                   <span>Choose a clear, recognizable profile photo</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
//                   <span>Use your real name or known handle as username</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
//                   <span>
//                     Keep your email updated for important notifications
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
//                   <span>
//                     Location helps us provide relevant regional content
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default ProfileTab;

// "use client";

// import {
//   X,
//   User,
//   Mail,
//   Save,
//   Edit3,
//   MapPin,
//   Camera,
//   Upload,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";
// import { addToast } from "@heroui/react";
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect, useRef } from "react";
// import { Card, CardBody, Button, Input, Avatar } from "@heroui/react";

// const ProfileTab = ({ user }) => {
//   const router = useRouter();

//   const [profileState, setProfileState] = useState({
//     error: null,
//     isLoading: false,
//     isUpdating: false,
//     lastUpdated: null,
//     hasChanges: false,
//     isUploadingPhoto: false,
//   });

//   const [formData, setFormData] = useState({
//     email: user?.email || "",
//     username: user?.username || "",
//     location: user?.location || "",
//     profile_photo: user?.profile_photo || "",
//   });

//   const [originalData, setOriginalData] = useState({});
//   const [previewPhoto, setPreviewPhoto] = useState(null);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const original = {
//       email: user?.email || "",
//       username: user?.username || "",
//       location: user?.location || "",
//       profile_photo: user?.profile_photo || "",
//     };

//     setOriginalData(original);
//     setFormData(original);
//   }, [user?.username, user?.email, user?.location, user?.profile_photo]);

//   // Check if there are changes
//   useEffect(() => {
//     const hasChanges =
//       Object.keys(formData).some(
//         (key) => formData[key] !== originalData[key],
//       ) || previewPhoto !== null;

//     setProfileState((prev) => ({ ...prev, hasChanges }));
//   }, [formData, originalData, previewPhoto]);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handlePhotoSelect = (event) => {
//     const file = event.target.files[0];

//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       addToast({
//         title: "Invalid File",
//         description: "Please select an image file",
//         color: "danger",
//         timeout: 4000,
//       });

//       return;
//     }

//     // Validate file size (5MB limit)
//     if (file.size > 5 * 1024 * 1024) {
//       addToast({
//         title: "File Too Large",
//         description: "Please select an image smaller than 5MB",
//         color: "danger",
//         timeout: 4000,
//       });

//       return;
//     }

//     // Create preview
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       setPreviewPhoto({
//         file,
//         preview: e.target.result,
//       });
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleRemovePhoto = () => {
//     setPreviewPhoto(null);
//     setFormData((prev) => ({
//       ...prev,
//       profile_photo: "",
//     }));

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const uploadProfilePhoto = async (file) => {
//     const uploadFormData = new FormData();

//     uploadFormData.append("photo", file);
//     uploadFormData.append("type", "profile");

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/uploads/profile-photo`,
//       {
//         method: "POST",
//         credentials: "include",
//         body: uploadFormData,
//       },
//     );

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || "Failed to upload photo");
//     }

//     const data = await response.json();
//     return data.photoUrl;
//   };

//   const handleSaveProfile = async () => {
//     if (!profileState.hasChanges) {
//       addToast({
//         title: "No Changes",
//         description: "No changes detected to save",
//         color: "default",
//         timeout: 3000,
//       });

//       return;
//     }

//     setProfileState((prev) => ({ ...prev, isUpdating: true, error: null }));

//     try {
//       let updatedData = { ...formData };

//       // Upload photo if there's a new one
//       if (previewPhoto?.file) {
//         setProfileState((prev) => ({ ...prev, isUploadingPhoto: true }));

//         const photoUrl = await uploadProfilePhoto(previewPhoto.file);

//         updatedData.profile_photo = photoUrl;
//         setProfileState((prev) => ({ ...prev, isUploadingPhoto: false }));
//       }

//       // Update profile
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/profile/me`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify(updatedData),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || "Failed to update profile");
//       }

//       // Update original data to reflect saved changes
//       setOriginalData(updatedData);
//       setFormData(updatedData);
//       setPreviewPhoto(null);

//       addToast({
//         title: "Profile Updated",
//         description: "Your profile has been successfully updated",
//         color: "success",
//         timeout: 4000,
//       });

//       setProfileState((prev) => ({
//         ...prev,
//         isUpdating: false,
//         isUploadingPhoto: false,
//         lastUpdated: new Date(),
//         hasChanges: false,
//       }));

//       // Refresh the page to get updated data
//       setTimeout(() => {
//         router.refresh();
//       }, 2000);
//     } catch (error) {
//       console.error("Profile update error:", error);

//       addToast({
//         title: "Update Failed",
//         description: error.message,
//         color: "danger",
//         timeout: 6000,
//       });

//       setProfileState((prev) => ({
//         ...prev,
//         isUpdating: false,
//         isUploadingPhoto: false,
//         error: error.message,
//       }));
//     }
//   };

//   const handleResetChanges = () => {
//     setFormData(originalData);
//     setPreviewPhoto(null);
//     setProfileState((prev) => ({ ...prev, hasChanges: false, error: null }));

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     addToast({
//       title: "Changes Reset",
//       description: "All changes have been reset to original values",
//       color: "default",
//       timeout: 3000,
//     });
//   };

//   const getCurrentPhotoUrl = () => {
//     if (previewPhoto) return previewPhoto.preview;
//     if (formData.profile_photo) return formData.profile_photo;
//     return null;
//   };

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//         <div className="flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
//             <Edit3 size={24} className="text-purple-400" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-400">
//                 Update your personal information
//               </span>
//               {profileState.lastUpdated && (
//                 <span className="text-xs text-gray-500">
//                   • Updated {profileState.lastUpdated.toLocaleTimeString()}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {profileState.hasChanges && (
//             <Button
//               variant="flat"
//               size="sm"
//               onPress={handleResetChanges}
//               startContent={<RefreshCw size={16} />}
//             >
//               Reset Changes
//             </Button>
//           )}
//           <Button
//             color="primary"
//             size="sm"
//             onPress={handleSaveProfile}
//             isLoading={profileState.isUpdating || profileState.isUploadingPhoto}
//             isDisabled={!profileState.hasChanges}
//             startContent={
//               !profileState.isUpdating &&
//               !profileState.isUploadingPhoto && <Save size={16} />
//             }
//           >
//             {profileState.isUploadingPhoto
//               ? "Uploading..."
//               : profileState.isUpdating
//                 ? "Saving..."
//                 : "Save Changes"}
//           </Button>
//         </div>
//       </div>

//       {/* Profile Photo Section */}
//       <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-6 flex items-center gap-2">
//             <Camera size={20} className="text-green-400" />
//             <h3 className="text-lg font-semibold text-white">Profile Photo</h3>
//             {previewPhoto && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-orange-900/50 px-2 py-1 text-xs font-medium text-orange-400">
//                 New Photo Selected
//               </span>
//             )}
//           </div>

//           <div className="flex flex-col items-center gap-6 sm:flex-row">
//             <div className="relative">
//               <Avatar
//                 src={getCurrentPhotoUrl()}
//                 name={formData.username || "User"}
//                 size="lg"
//                 className="h-24 w-24"
//                 classNames={{
//                   base: "ring-2 ring-gray-600",
//                   img: "object-cover",
//                 }}
//               />
//               {getCurrentPhotoUrl() && (
//                 <Button
//                   isIconOnly
//                   variant="flat"
//                   size="sm"
//                   className="absolute -right-2 -top-2 bg-red-600/80 text-white"
//                   onPress={handleRemovePhoto}
//                 >
//                   <X size={14} />
//                 </Button>
//               )}
//             </div>

//             <div className="flex-1 space-y-3">
//               <div>
//                 <h4 className="mb-1 text-sm font-medium text-white">
//                   Upload New Photo
//                 </h4>
//                 <p className="mb-3 text-xs text-gray-400">
//                   Choose a photo to represent your profile. Recommended size:
//                   400x400px, max 5MB.
//                 </p>
//               </div>

//               <div className="flex gap-2">
//                 <Button
//                   variant="flat"
//                   startContent={<Upload size={16} />}
//                   onPress={() => fileInputRef.current?.click()}
//                 >
//                   Choose Photo
//                 </Button>
//                 {getCurrentPhotoUrl() && (
//                   <Button
//                     variant="flat"
//                     color="danger"
//                     startContent={<X size={16} />}
//                     onPress={handleRemovePhoto}
//                   >
//                     Remove
//                   </Button>
//                 )}
//               </div>

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePhotoSelect}
//                 className="hidden"
//               />

//               <div className="text-xs text-gray-500">
//                 Supported formats: JPG, PNG, GIF • Maximum size: 5MB
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       {/* Personal Information */}
//       <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-6 flex items-center gap-2">
//             <User size={20} className="text-blue-400" />
//             <h3 className="text-lg font-semibold text-white">
//               Personal Information
//             </h3>
//             {profileState.hasChanges && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-orange-900/50 px-2 py-1 text-xs font-medium text-orange-400">
//                 Unsaved Changes
//               </span>
//             )}
//           </div>

//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             {/* Username */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-300">
//                 Username <span className="text-red-400">*</span>
//               </label>
//               <Input
//                 value={formData.username}
//                 onChange={(e) => handleInputChange("username", e.target.value)}
//                 placeholder="Enter your username"
//                 startContent={<User size={16} className="text-gray-400" />}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.username !== originalData.username
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//                 isRequired
//               />
//               <p className="text-xs text-gray-500">
//                 Public display name visible to other users
//               </p>
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-300">
//                 Email Address <span className="text-red-400">*</span>
//               </label>
//               <Input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 placeholder="Enter your email"
//                 startContent={<Mail size={16} className="text-gray-400" />}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.email !== originalData.email
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//                 isRequired
//               />
//               <p className="text-xs text-gray-500">
//                 Primary email for account notifications
//               </p>
//             </div>

//             {/* Location */}
//             <div className="space-y-2 lg:col-span-2">
//               <label className="text-sm font-medium text-gray-300">
//                 Location
//               </label>
//               <Input
//                 value={formData.location}
//                 onChange={(e) => handleInputChange("location", e.target.value)}
//                 placeholder="Enter your location (e.g., San Francisco, CA)"
//                 startContent={<MapPin size={16} className="text-gray-400" />}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.location !== originalData.location
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//               />
//               <p className="text-xs text-gray-500">
//                 Your location helps with regional quest matching (optional)
//               </p>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       {/* Save Actions */}
//       {profileState.hasChanges && (
//         <Card className="border border-orange-500/20 bg-gradient-to-br from-orange-900/20 to-yellow-900/20 backdrop-blur-xl">
//           <CardBody className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <AlertCircle size={20} className="text-orange-400" />
//                 <div>
//                   <p className="text-sm font-medium text-orange-400">
//                     Unsaved Changes
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     You have unsaved changes. Save or reset to continue.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="flat" size="sm" onPress={handleResetChanges}>
//                   Reset
//                 </Button>
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onPress={handleSaveProfile}
//                   isLoading={
//                     profileState.isUpdating || profileState.isUploadingPhoto
//                   }
//                   startContent={
//                     !profileState.isUpdating &&
//                     !profileState.isUploadingPhoto && <Save size={16} />
//                   }
//                 >
//                   {profileState.isUploadingPhoto
//                     ? "Uploading..."
//                     : profileState.isUpdating
//                       ? "Saving..."
//                       : "Save Changes"}
//                 </Button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {/* Error Display */}
//       {profileState.error && (
//         <Card className="border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl">
//           <CardBody className="p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle size={20} className="mt-0.5 text-red-400" />
//               <div>
//                 <h4 className="mb-2 font-medium text-red-400">
//                   Profile Update Error
//                 </h4>
//                 <p className="text-sm text-gray-300">{profileState.error}</p>
//                 <button
//                   onClick={() =>
//                     setProfileState((prev) => ({ ...prev, error: null }))
//                   }
//                   className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
//                 >
//                   Dismiss
//                 </button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {/* Help Section */}
//       <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="flex items-start gap-3">
//             <CheckCircle size={20} className="mt-0.5 text-blue-400" />
//             <div>
//               <h4 className="mb-2 font-medium text-blue-400">
//                 Profile Guidelines
//               </h4>
//               <div className="space-y-2 text-sm text-gray-300">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>
//                   <span>Choose a clear, recognizable profile photo</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
//                   <span>Use your real name or known handle as username</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
//                   <span>
//                     Keep your email updated for important notifications
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
//                   <span>
//                     Location helps us provide relevant regional content
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default ProfileTab;

// "use client";

// import {
//   X,
//   Eye,
//   User,
//   Mail,
//   Save,
//   Edit3,
//   MapPin,
//   Camera,
//   Upload,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";
// import { addToast } from "@heroui/react";
// import { useRouter } from "next/navigation";
// import { Card, CardBody, Button, Input } from "@heroui/react";
// import React, { useState, useEffect, useRef, useCallback } from "react";

// import useUpload from "@/hooks/useUpload";

// const ProfileTab = ({ user }) => {
//   const router = useRouter();
//   const {
//     uploadFile,
//     deleteFile,
//     getUploadState,
//     clearUploadState,
//     getFileViewUrl,
//   } = useUpload();

//   const [profileState, setProfileState] = useState({
//     error: null,
//     isLoading: false,
//     isUpdating: false,
//     lastUpdated: null,
//     hasChanges: false,
//     isUploadingPhoto: false,
//     isLoadingPreview: false,
//   });

//   const [formData, setFormData] = useState({
//     email: user?.email || "",
//     username: user?.username || "",
//     location: user?.location || "",
//     profile_photo: user?.profile_photo || "",
//   });

//   const [originalData, setOriginalData] = useState({});
//   const [previewPhoto, setPreviewPhoto] = useState(null);
//   const [currentPhotoSignedUrl, setCurrentPhotoSignedUrl] = useState(null);

//   const [oldProfilePhotoKey, setOldProfilePhotoKey] = useState(null);

//   const fileInputRef = useRef(null);
//   const photoUploadKey = "profile-photo-upload";

//   // Helper function to extract S3 key from URL
//   const extractS3Key = useCallback((url) => {
//     if (!url) return null;

//     // If it's already just a key, return it
//     if (!url.includes("/")) return url;

//     // Extract key from full S3 URL
//     try {
//       const urlObj = new URL(url);
//       return urlObj.pathname.substring(1);
//     } catch {
//       // Fallback: split by slash and take last part
//       return url.split("/").pop();
//     }
//   }, []);

//   // Function to get signed URL for current profile photo
//   const loadCurrentPhotoSignedUrl = useCallback(
//     async (photoUrl, forceRefresh = false) => {
//       if (!photoUrl) {
//         setCurrentPhotoSignedUrl(null);
//         return;
//       }

//       // If it's already a data URL (preview), use it directly
//       if (photoUrl.startsWith("data:")) {
//         setCurrentPhotoSignedUrl(photoUrl);
//         return;
//       }

//       // Check if we need to refresh the signed URL
//       if (!forceRefresh && photoUrl.includes("X-Amz-Signature")) {
//         try {
//           // Check if the signed URL is still valid by parsing expiry
//           const url = new URL(photoUrl);
//           const expires =
//             url.searchParams.get("X-Amz-Date") ||
//             url.searchParams.get("Expires");
//           const now = Math.floor(Date.now() / 1000);

//           if (expires && parseInt(expires) > now + 300) {
//             // 5 min buffer
//             setCurrentPhotoSignedUrl(photoUrl);
//             return;
//           }
//         } catch {
//           // If parsing fails, generate new signed URL
//         }
//       }

//       setProfileState((prev) => ({ ...prev, isLoadingPreview: true }));

//       try {
//         const s3Key = extractS3Key(photoUrl);

//         if (s3Key) {
//           const signedUrlData = await getFileViewUrl(s3Key, 7200);

//           const newSignedUrl =
//             signedUrlData.signedUrl || signedUrlData.url || signedUrlData;

//           if (newSignedUrl && newSignedUrl !== photoUrl) {
//             setCurrentPhotoSignedUrl(newSignedUrl);
//           } else {
//             // If signed URL generation failed, try original URL
//             setCurrentPhotoSignedUrl(photoUrl);
//           }
//         } else {
//           setCurrentPhotoSignedUrl(photoUrl);
//         }
//       } catch (error) {
//         console.warn("Failed to load signed URL for profile photo:", error);
//         // Fallback to original URL
//         setCurrentPhotoSignedUrl(photoUrl);
//       } finally {
//         setProfileState((prev) => ({ ...prev, isLoadingPreview: false }));
//       }
//     },
//     [extractS3Key, getFileViewUrl],
//   );

//   // Initialize component data
//   useEffect(() => {
//     const original = {
//       email: user?.email || "",
//       username: user?.username || "",
//       location: user?.location || "",
//       profile_photo: user?.profile_photo || "",
//     };

//     setOriginalData(original);
//     setFormData(original);

//     // Store the old profile photo key for potential deletion
//     if (user?.profile_photo) {
//       const photoKey = extractS3Key(user.profile_photo);
//       setOldProfilePhotoKey(photoKey);
//     }
//   }, [
//     user?.username,
//     user?.email,
//     user?.location,
//     user?.profile_photo,
//     extractS3Key,
//   ]);

//   // Add a refresh function for signed URLs
//   const refreshPhotoUrl = useCallback(async () => {
//     if (formData.profile_photo) {
//       await loadCurrentPhotoSignedUrl(formData.profile_photo, true);
//     }
//   }, [formData.profile_photo, loadCurrentPhotoSignedUrl]);

//   // Auto-refresh signed URL on component mount and when photo changes
//   useEffect(() => {
//     if (formData.profile_photo) {
//       // Add a small delay to ensure component is mounted
//       const timer = setTimeout(() => {
//         loadCurrentPhotoSignedUrl(formData.profile_photo, true);
//       }, 100);

//       return () => clearTimeout(timer);
//     }
//   }, [formData.profile_photo, loadCurrentPhotoSignedUrl]);

//   // Check if there are changes
//   useEffect(() => {
//     const hasChanges =
//       Object.keys(formData).some(
//         (key) => formData[key] !== originalData[key],
//       ) || previewPhoto !== null;

//     setProfileState((prev) => ({ ...prev, hasChanges }));
//   }, [formData, originalData, previewPhoto]);

//   // Monitor upload state
//   useEffect(() => {
//     const uploadState = getUploadState(photoUploadKey);
//     if (uploadState) {
//       setProfileState((prev) => ({
//         ...prev,
//         isUploadingPhoto: uploadState.status === "uploading",
//       }));

//       if (uploadState.status === "error") {
//         addToast({
//           color: "danger",
//           title: "Upload Failed",
//         });
//         clearUploadState(photoUploadKey);
//       }
//     }
//   }, [getUploadState(photoUploadKey), clearUploadState]);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const validateFile = (file) => {
//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       addToast({
//         color: "danger",
//         title: "Invalid File",
//         description: "Please select an image file",
//       });

//       return false;
//     }

//     // Validate file size (5MB limit)
//     if (file.size > 5 * 1024 * 1024) {
//       addToast({
//         color: "danger",
//         title: "File Too Large",
//         description: "Please select an image smaller than 5MB",
//       });

//       return false;
//     }

//     return true;
//   };

//   const handlePhotoSelect = (event) => {
//     const file = event.target.files[0];

//     if (!file) return;

//     if (!validateFile(file)) return;

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreviewPhoto({
//         file,
//         preview: e.target.result,
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRemovePhoto = () => {
//     setPreviewPhoto(null);
//     setFormData((prev) => ({
//       ...prev,
//       profile_photo: "/dashboard/profile/default-profile.png",
//     }));
//     setCurrentPhotoSignedUrl("/dashboard/profile/default-profile.png");

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const uploadProfilePhoto = async (file) => {
//     try {
//       const timestamp = Date.now();
//       const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
//       const fileName = `profile-${timestamp}-${sanitizedName}`;

//       const uploadOptions = {
//         size: "PROFILE",
//         multiSize: false,
//         fileName: fileName,
//         noSubfolder: false,
//         entityType: "USERS",
//         fileType: "profile_photo",
//         trackingKey: photoUploadKey,
//         entityId: user?.ambassador_id,
//         customFolder: "profile-photos",
//       };

//       const result = await uploadFile(file, uploadOptions);
//       return {
//         url: result.url,
//         key: result.key,
//       };
//     } catch (error) {
//       console.error("Profile photo upload error:", error);
//       throw error;
//     }
//   };

//   const deleteOldProfilePhoto = async (photoKey) => {
//     if (!photoKey) return true;

//     try {
//       const success = await deleteFile(photoKey);

//       return success;
//     } catch (error) {
//       return false;
//     }
//   };

//   const handleSaveProfile = async () => {
//     if (!profileState.hasChanges) {
//       addToast({
//         color: "default",
//         title: "No Changes",
//         description: "No changes detected to save",
//       });

//       return;
//     }

//     setProfileState((prev) => ({ ...prev, isUpdating: true, error: null }));

//     try {
//       let updatedData = { ...formData };
//       let uploadResult = null;

//       // Step 1: Upload new photo if there's one selected
//       if (previewPhoto?.file) {
//         setProfileState((prev) => ({ ...prev, isUploadingPhoto: true }));

//         uploadResult = await uploadProfilePhoto(previewPhoto.file);
//         updatedData.profile_photo = uploadResult.url;

//         setProfileState((prev) => ({ ...prev, isUploadingPhoto: false }));
//       }

//       // Step 2: Update profile in database first (safer approach)
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/profile/me`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify(updatedData),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || "Failed to update profile");
//       }

//       // Step 3: Delete old profile photo after successful database update
//       if (
//         uploadResult &&
//         oldProfilePhotoKey &&
//         oldProfilePhotoKey !== uploadResult.key
//       ) {
//         await deleteOldProfilePhoto(oldProfilePhotoKey);
//         setOldProfilePhotoKey(uploadResult.key);
//       }

//       // Step 3b: If user removed their photo, delete the old one and set to default
//       if (
//         updatedData.profile_photo ===
//           "/dashboard/profile/default-profile.png" &&
//         oldProfilePhotoKey
//       ) {
//         await deleteOldProfilePhoto(oldProfilePhotoKey);
//         setOldProfilePhotoKey(null);
//       }

//       // Step 4: Update local state after successful operations
//       setOriginalData(updatedData);
//       setFormData(updatedData);
//       setPreviewPhoto(null);

//       // Update current photo signed URL
//       if (uploadResult) {
//         loadCurrentPhotoSignedUrl(uploadResult.url);
//       } else if (
//         updatedData.profile_photo === "/dashboard/profile/default-profile.png"
//       ) {
//         setCurrentPhotoSignedUrl("/dashboard/profile/default-profile.png");
//       }

//       // Clear upload state
//       clearUploadState(photoUploadKey);

//       addToast({
//         title: "Profile Updated",
//         description: "Your profile has been successfully updated",
//         color: "success",
//         timeout: 4000,
//       });

//       setProfileState((prev) => ({
//         ...prev,
//         isUpdating: false,
//         isUploadingPhoto: false,
//         lastUpdated: new Date(),
//         hasChanges: false,
//       }));

//       // Refresh the page to get updated data
//       setTimeout(() => {
//         router.refresh();
//       }, 2000);
//     } catch (error) {
//       addToast({
//         title: "Update Failed",
//         description: error.message,
//         color: "danger",
//         timeout: 6000,
//       });

//       setProfileState((prev) => ({
//         ...prev,
//         isUpdating: false,
//         isUploadingPhoto: false,
//         error: error.message,
//       }));

//       // Clear upload state on error
//       clearUploadState(photoUploadKey);
//     }
//   };

//   const handleResetChanges = () => {
//     setFormData(originalData);
//     setPreviewPhoto(null);
//     setProfileState((prev) => ({ ...prev, hasChanges: false, error: null }));

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     // Clear any upload states
//     clearUploadState(photoUploadKey);

//     addToast({
//       color: "default",
//       title: "Changes Reset",
//       description: "All changes have been reset to original values",
//     });
//   };

//   const getCurrentPhotoUrl = () => {
//     if (previewPhoto) return previewPhoto.preview;

//     if (
//       currentPhotoSignedUrl &&
//       currentPhotoSignedUrl !== "/dashboard/profile/default-profile.png"
//     )
//       return currentPhotoSignedUrl;

//     if (
//       formData.profile_photo &&
//       formData.profile_photo !== "" &&
//       formData.profile_photo !== "/dashboard/profile/default-profile.png"
//     )
//       return formData.profile_photo;

//     return "/dashboard/profile/default-profile.png";
//   };

//   const isDefaultPhoto = () => {
//     const currentUrl = getCurrentPhotoUrl();

//     return (
//       currentUrl === "/dashboard/profile/default-profile.png" ||
//       !formData.profile_photo ||
//       formData.profile_photo === "" ||
//       formData.profile_photo === "/dashboard/profile/default-profile.png"
//     );
//   };

//   const hasCustomPhoto = () => {
//     return !isDefaultPhoto() && !previewPhoto;
//   };

//   const getPhotoDisplayState = () => {
//     if (previewPhoto) return "preview";
//     if (profileState.isLoadingPreview) return "loading";
//     if (
//       currentPhotoSignedUrl &&
//       currentPhotoSignedUrl !== "/dashboard/profile/default-profile.png"
//     )
//       return "signed";
//     if (
//       formData.profile_photo &&
//       formData.profile_photo !== "/dashboard/profile/default-profile.png" &&
//       formData.profile_photo !== ""
//     )
//       return "fallback";
//     return "none";
//   };

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//         <div className="flex items-start gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 3xl:h-12 3xl:w-12">
//             <Edit3
//               size={24}
//               className="h-5 w-5 text-purple-400 3xl:h-6 3xl:w-6"
//             />
//           </div>

//           <div>
//             <h2 className="text-xl font-bold text-white 3xl:text-2xl">
//               Edit Profile
//             </h2>

//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-200">
//                 Update your personal information
//               </span>

//               {profileState.lastUpdated && (
//                 <span className="text-xs text-gray-300">
//                   • Updated {profileState.lastUpdated.toLocaleTimeString()}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {profileState.hasChanges && (
//             <Button
//               size="sm"
//               variant="flat"
//               onPress={handleResetChanges}
//               startContent={<RefreshCw size={16} />}
//               isDisabled={
//                 profileState.isUpdating || profileState.isUploadingPhoto
//               }
//             >
//               Reset Changes
//             </Button>
//           )}

//           <Button
//             size="sm"
//             onPress={handleSaveProfile}
//             isDisabled={!profileState.hasChanges}
//             className="border border-gray-400 bg-gradient-dark"
//             isLoading={profileState.isUpdating || profileState.isUploadingPhoto}
//             startContent={
//               !profileState.isUpdating &&
//               !profileState.isUploadingPhoto && <Save size={16} />
//             }
//           >
//             {profileState.isUploadingPhoto
//               ? "Uploading Photo..."
//               : profileState.isUpdating
//                 ? "Saving Profile..."
//                 : "Save Changes"}
//           </Button>
//         </div>
//       </div>

//       <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-6 flex items-center gap-2">
//             <Camera size={20} className="text-green-400" />

//             <h3 className="text-lg font-semibold text-white">Profile Photo</h3>

//             {previewPhoto && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-orange-900/50 px-2 py-1 text-xs font-medium text-orange-400">
//                 New Photo Selected
//               </span>
//             )}

//             {getPhotoDisplayState() === "signed" && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-green-900/50 px-2 py-1 text-xs font-medium text-green-400">
//                 <Eye size={12} className="mr-1" />
//                 Secure View
//               </span>
//             )}
//           </div>

//           <div className="flex flex-col items-center gap-6 sm:flex-row">
//             <div className="relative">
//               <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-gray-600">
//                 <img
//                   src={getCurrentPhotoUrl()}
//                   alt={formData.username || "Profile"}
//                   className={`h-full w-full object-cover ${
//                     profileState.isLoadingPreview
//                       ? "animate-pulse opacity-50"
//                       : ""
//                   }`}
//                   style={{
//                     display: "block",
//                     maxWidth: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     backgroundColor: "transparent",
//                   }}
//                   onError={(e) => {
//                     e.target.src = "/dashboard/profile/default-profile.png";
//                   }}
//                 />
//               </div>

//               {profileState.isLoadingPreview && (
//                 <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-800/50">
//                   <RefreshCw size={16} className="animate-spin text-gray-200" />
//                 </div>
//               )}

//               {(hasCustomPhoto() || previewPhoto) &&
//                 !profileState.isLoadingPreview && (
//                   <Button
//                     size="sm"
//                     isIconOnly
//                     variant="flat"
//                     title="Remove photo"
//                     onPress={handleRemovePhoto}
//                     className="absolute -right-1 -top-1 h-5 w-5 min-w-0 bg-red-600/80 text-white hover:bg-red-600"
//                     isDisabled={
//                       profileState.isUploadingPhoto || profileState.isUpdating
//                     }
//                   >
//                     <X size={14} />
//                   </Button>
//                 )}

//               {hasCustomPhoto() &&
//                 !previewPhoto &&
//                 !profileState.isLoadingPreview && (
//                   <Button
//                     size="sm"
//                     isIconOnly
//                     variant="flat"
//                     title="Refresh image"
//                     onPress={refreshPhotoUrl}
//                     className="bg-blue-600/80 hover:bg-blue-600 absolute -bottom-2 -right-2 text-white"
//                     isDisabled={
//                       profileState.isUploadingPhoto || profileState.isUpdating
//                     }
//                   >
//                     <RefreshCw size={12} />
//                   </Button>
//                 )}
//             </div>

//             <div className="flex-1 space-y-3">
//               <div>
//                 <h4 className="mb-1 text-sm font-medium text-white">
//                   Upload New Photo
//                 </h4>

//                 <p className="mb-3 text-xs text-gray-300">
//                   Choose a photo to represent your profile. Recommended size:
//                   400x400px, max 5MB. Supported formats: JPG, PNG, GIF.
//                 </p>
//               </div>

//               <div className="flex gap-2">
//                 <Button
//                   variant="flat"
//                   startContent={<Upload size={16} />}
//                   onPress={() => fileInputRef.current?.click()}
//                   isDisabled={
//                     profileState.isUploadingPhoto || profileState.isUpdating
//                   }
//                 >
//                   {previewPhoto
//                     ? "Change Photo"
//                     : isDefaultPhoto()
//                       ? "Upload Photo"
//                       : "Change Photo"}
//                 </Button>

//                 {(hasCustomPhoto() || previewPhoto) && (
//                   <Button
//                     variant="flat"
//                     color="danger"
//                     startContent={<X size={16} />}
//                     onPress={handleRemovePhoto}
//                     isDisabled={
//                       profileState.isUploadingPhoto || profileState.isUpdating
//                     }
//                   >
//                     Remove
//                   </Button>
//                 )}
//               </div>

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handlePhotoSelect}
//               />

//               <div className="text-xs text-gray-300">
//                 {getPhotoDisplayState() === "loading" &&
//                   "Loading secure preview..."}
//                 {getPhotoDisplayState() === "signed" &&
//                   "Displaying secure signed URL"}
//                 {getPhotoDisplayState() === "preview" &&
//                   "Showing preview of selected file"}
//                 {getPhotoDisplayState() === "fallback" &&
//                   "Displaying original URL"}
//                 {getPhotoDisplayState() === "none" &&
//                   "Using default profile photo"}
//                 {hasCustomPhoto() && (
//                   <button
//                     onClick={refreshPhotoUrl}
//                     className="ml-2 text-blue-400 underline hover:text-blue-300"
//                   >
//                     Refresh Image
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-6 flex items-center gap-2">
//             <User size={20} className="text-blue-400" />

//             <h3 className="text-lg font-semibold text-white">
//               Personal Information
//             </h3>

//             {profileState.hasChanges && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-orange-900/50 px-2 py-1 text-xs font-medium text-orange-400">
//                 Unsaved Changes
//               </span>
//             )}
//           </div>

//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-200">
//                 Username <span className="text-red-400">*</span>
//               </label>

//               <Input
//                 isRequired
//                 value={formData.username}
//                 placeholder="Enter your username"
//                 startContent={<User size={16} className="text-gray-300" />}
//                 onChange={(e) => handleInputChange("username", e.target.value)}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.username !== originalData.username
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//                 isDisabled={
//                   profileState.isUpdating || profileState.isUploadingPhoto
//                 }
//               />

//               <p className="text-xs text-gray-300">
//                 Public display name visible to other users
//               </p>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-200">
//                 Email Address <span className="text-red-400">*</span>
//               </label>

//               <Input
//                 isRequired
//                 type="email"
//                 value={formData.email}
//                 placeholder="Enter your email"
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 startContent={<Mail size={16} className="text-gray-300" />}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.email !== originalData.email
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//                 isDisabled={
//                   profileState.isUpdating || profileState.isUploadingPhoto
//                 }
//               />

//               <p className="text-xs text-gray-300">
//                 Primary email for account notifications
//               </p>
//             </div>

//             <div className="space-y-2 lg:col-span-2">
//               <label className="text-sm font-medium text-gray-200">
//                 Location
//               </label>

//               <Input
//                 value={formData.location}
//                 placeholder="Enter your location (e.g., San Francisco, CA)"
//                 onChange={(e) => handleInputChange("location", e.target.value)}
//                 startContent={<MapPin size={16} className="text-gray-300" />}
//                 classNames={{
//                   input: "text-white",
//                   inputWrapper: `border-gray-700 bg-gray-800/50 ${
//                     formData.location !== originalData.location
//                       ? "border-orange-500/50"
//                       : ""
//                   }`,
//                 }}
//                 isDisabled={
//                   profileState.isUpdating || profileState.isUploadingPhoto
//                 }
//               />

//               <p className="text-xs text-gray-300">
//                 Your location helps with regional quest matching (optional)
//               </p>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       {profileState.hasChanges && (
//         <Card className="border border-orange-500/20 bg-gradient-to-br from-orange-900/20 to-yellow-900/20 backdrop-blur-xl">
//           <CardBody className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <AlertCircle size={20} className="text-orange-400" />

//                 <div>
//                   <p className="text-sm font-medium text-orange-400">
//                     Unsaved Changes
//                   </p>

//                   <p className="text-xs text-gray-300">
//                     You have unsaved changes. Save or reset to continue.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   size="sm"
//                   variant="flat"
//                   onPress={handleResetChanges}
//                   isDisabled={
//                     profileState.isUpdating || profileState.isUploadingPhoto
//                   }
//                 >
//                   Reset
//                 </Button>

//                 <Button
//                   size="sm"
//                   color="primary"
//                   onPress={handleSaveProfile}
//                   isLoading={
//                     profileState.isUpdating || profileState.isUploadingPhoto
//                   }
//                   startContent={
//                     !profileState.isUpdating &&
//                     !profileState.isUploadingPhoto && <Save size={16} />
//                   }
//                 >
//                   {profileState.isUploadingPhoto
//                     ? "Uploading Photo..."
//                     : profileState.isUpdating
//                       ? "Saving Profile..."
//                       : "Save Changes"}
//                 </Button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {profileState.error && (
//         <Card className="border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl">
//           <CardBody className="p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle size={20} className="mt-0.5 text-red-400" />

//               <div>
//                 <h4 className="mb-2 font-medium text-red-400">
//                   Profile Update Error
//                 </h4>

//                 <p className="text-sm text-gray-200">{profileState.error}</p>

//                 <button
//                   onClick={() =>
//                     setProfileState((prev) => ({ ...prev, error: null }))
//                   }
//                   className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
//                 >
//                   Dismiss
//                 </button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="flex items-start gap-3">
//             <CheckCircle size={20} className="mt-0.5 text-blue-400" />

//             <div>
//               <h4 className="mb-2 font-medium text-blue-400">
//                 Profile Guidelines & Security
//               </h4>

//               <div className="space-y-2 text-sm text-gray-200">
//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>

//                   <span>
//                     Profile photos are securely stored and accessed via signed
//                     URLs
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>

//                   <span>
//                     Choose a clear, recognizable profile photo (max 5MB)
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>

//                   <span>Use your real name or known handle as username</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>

//                   <span>
//                     Keep your email updated for important notifications
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>

//                   <span>
//                     Location helps us provide relevant regional content
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default ProfileTab;

"use client";

import {
  X,
  Eye,
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
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button, Input } from "@heroui/react";

import useUpload from "@/hooks/useUpload";

// Constants moved outside to prevent recreation
const PHOTO_UPLOAD_KEY = "profile-photo-upload";
const DEFAULT_PHOTO_PATH = "/dashboard/profile/default-profile.png";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SIGNED_URL_BUFFER = 300; // 5 minutes

// Helper functions moved outside component
const extractS3Key = (url) => {
  if (!url) return null;
  if (!url.includes("/")) return url;

  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1);
  } catch {
    return url.split("/").pop();
  }
};

const validateFile = (file) => {
  if (!file.type.startsWith("image/")) {
    addToast({
      color: "danger",
      title: "Invalid File",
      description: "Please select an image file",
    });
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    addToast({
      color: "danger",
      title: "File Too Large",
      description: "Please select an image smaller than 5MB",
    });
    return false;
  }

  return true;
};

const ProfileTab = ({ user }) => {
  const router = useRouter();
  const {
    uploadFile,
    deleteFile,
    getUploadState,
    clearUploadState,
    getFileViewUrl,
  } = useUpload();

  const [profileState, setProfileState] = useState({
    error: null,
    isLoading: false,
    isUpdating: false,
    lastUpdated: null,
    hasChanges: false,
    isUploadingPhoto: false,
    isLoadingPreview: false,
  });

  // Memoize initial form data to prevent unnecessary re-initializations
  const initialFormData = useMemo(
    () => ({
      email: user?.email || "",
      username: user?.username || "",
      location: user?.location || "",
      profile_photo: user?.profile_photo || "",
    }),
    [user?.email, user?.username, user?.location, user?.profile_photo],
  );

  const [originalData, setOriginalData] = useState({});
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const [oldProfilePhotoKey, setOldProfilePhotoKey] = useState(null);
  const [currentPhotoSignedUrl, setCurrentPhotoSignedUrl] = useState(null);

  const fileInputRef = useRef(null);

  // Memoized change detection
  const hasFormChanges = useMemo(
    () =>
      Object.keys(formData).some((key) => formData[key] !== originalData[key]),
    [formData, originalData],
  );

  // Function to get signed URL for current profile photo
  const loadCurrentPhotoSignedUrl = useCallback(
    async (photoUrl, forceRefresh = false) => {
      if (!photoUrl) {
        setCurrentPhotoSignedUrl(null);
        return;
      }

      // If it's already a data URL (preview), use it directly
      if (photoUrl.startsWith("data:")) {
        setCurrentPhotoSignedUrl(photoUrl);
        return;
      }

      // Check if we need to refresh the signed URL
      if (!forceRefresh && photoUrl.includes("X-Amz-Signature")) {
        try {
          // Check if the signed URL is still valid by parsing expiry
          const url = new URL(photoUrl);
          const expires =
            url.searchParams.get("X-Amz-Date") ||
            url.searchParams.get("Expires");
          const now = Math.floor(Date.now() / 1000);

          if (expires && parseInt(expires) > now + SIGNED_URL_BUFFER) {
            setCurrentPhotoSignedUrl(photoUrl);
            return;
          }
        } catch {
          // If parsing fails, generate new signed URL
        }
      }

      setProfileState((prev) => ({ ...prev, isLoadingPreview: true }));

      try {
        const s3Key = extractS3Key(photoUrl);

        if (s3Key) {
          const signedUrlData = await getFileViewUrl(s3Key, 7200);

          const newSignedUrl =
            signedUrlData.signedUrl || signedUrlData.url || signedUrlData;

          if (newSignedUrl && newSignedUrl !== photoUrl) {
            setCurrentPhotoSignedUrl(newSignedUrl);
          } else {
            // If signed URL generation failed, try original URL
            setCurrentPhotoSignedUrl(photoUrl);
          }
        } else {
          setCurrentPhotoSignedUrl(photoUrl);
        }
      } catch (error) {
        console.warn("Failed to load signed URL for profile photo:", error);
        // Fallback to original URL
        setCurrentPhotoSignedUrl(photoUrl);
      } finally {
        setProfileState((prev) => ({ ...prev, isLoadingPreview: false }));
      }
    },
    [getFileViewUrl],
  );

  // Initialize component data
  useEffect(() => {
    setOriginalData(initialFormData);
    setFormData(initialFormData);

    // Store the old profile photo key for potential deletion
    if (user?.profile_photo) {
      const photoKey = extractS3Key(user.profile_photo);
      setOldProfilePhotoKey(photoKey);
    }
  }, [initialFormData, user?.profile_photo]);

  // Add a refresh function for signed URLs
  const refreshPhotoUrl = useCallback(async () => {
    if (formData.profile_photo) {
      await loadCurrentPhotoSignedUrl(formData.profile_photo, true);
    }
  }, [formData.profile_photo, loadCurrentPhotoSignedUrl]);

  // Auto-refresh signed URL on component mount and when photo changes
  useEffect(() => {
    if (formData.profile_photo) {
      // Add a small delay to ensure component is mounted
      const timer = setTimeout(() => {
        loadCurrentPhotoSignedUrl(formData.profile_photo, true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [formData.profile_photo, loadCurrentPhotoSignedUrl]);

  // Check if there are changes
  useEffect(() => {
    const hasChanges = hasFormChanges || previewPhoto !== null;
    setProfileState((prev) => ({ ...prev, hasChanges }));
  }, [hasFormChanges, previewPhoto]);

  // Monitor upload state
  useEffect(() => {
    const uploadState = getUploadState(PHOTO_UPLOAD_KEY);
    if (uploadState) {
      setProfileState((prev) => ({
        ...prev,
        isUploadingPhoto: uploadState.status === "uploading",
      }));

      if (uploadState.status === "error") {
        addToast({
          color: "danger",
          title: "Upload Failed",
        });
        clearUploadState(PHOTO_UPLOAD_KEY);
      }
    }
  }, [getUploadState(PHOTO_UPLOAD_KEY), clearUploadState]);

  // Memoized input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePhotoSelect = useCallback((event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!validateFile(file)) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewPhoto({
        file,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setPreviewPhoto(null);
    setFormData((prev) => ({
      ...prev,
      profile_photo: DEFAULT_PHOTO_PATH,
    }));
    setCurrentPhotoSignedUrl(DEFAULT_PHOTO_PATH);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const uploadProfilePhoto = useCallback(
    async (file) => {
      try {
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
        const fileName = `profile-${timestamp}-${sanitizedName}`;

        const uploadOptions = {
          size: "PROFILE",
          multiSize: false,
          fileName: fileName,
          noSubfolder: false,
          entityType: "USERS",
          fileType: "profile_photo",
          trackingKey: PHOTO_UPLOAD_KEY,
          entityId: user?.ambassador_id,
          customFolder: "profile-photos",
        };

        const result = await uploadFile(file, uploadOptions);
        return {
          url: result.url,
          key: result.key,
        };
      } catch (error) {
        console.error("Profile photo upload error:", error);
        throw error;
      }
    },
    [uploadFile, user?.ambassador_id],
  );

  const deleteOldProfilePhoto = useCallback(
    async (photoKey) => {
      if (!photoKey) return true;

      try {
        const success = await deleteFile(photoKey);
        return success;
      } catch (error) {
        return false;
      }
    },
    [deleteFile],
  );

  const handleSaveProfile = useCallback(async () => {
    if (!profileState.hasChanges) {
      addToast({
        color: "default",
        title: "No Changes",
        description: "No changes detected to save",
      });

      return;
    }

    setProfileState((prev) => ({ ...prev, isUpdating: true, error: null }));

    try {
      let updatedData = { ...formData };
      let uploadResult = null;

      // Step 1: Upload new photo if there's one selected
      if (previewPhoto?.file) {
        setProfileState((prev) => ({ ...prev, isUploadingPhoto: true }));

        uploadResult = await uploadProfilePhoto(previewPhoto.file);
        updatedData.profile_photo = uploadResult.url;

        setProfileState((prev) => ({ ...prev, isUploadingPhoto: false }));
      }

      // Step 2: Update profile in database first (safer approach)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/profile/me`,
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

      // Step 3: Delete old profile photo after successful database update
      if (
        uploadResult &&
        oldProfilePhotoKey &&
        oldProfilePhotoKey !== uploadResult.key
      ) {
        await deleteOldProfilePhoto(oldProfilePhotoKey);
        setOldProfilePhotoKey(uploadResult.key);
      }

      // Step 3b: If user removed their photo, delete the old one and set to default
      if (
        updatedData.profile_photo === DEFAULT_PHOTO_PATH &&
        oldProfilePhotoKey
      ) {
        await deleteOldProfilePhoto(oldProfilePhotoKey);
        setOldProfilePhotoKey(null);
      }

      // Step 4: Update local state after successful operations
      setOriginalData(updatedData);
      setFormData(updatedData);
      setPreviewPhoto(null);

      // Update current photo signed URL
      if (uploadResult) {
        loadCurrentPhotoSignedUrl(uploadResult.url);
      } else if (updatedData.profile_photo === DEFAULT_PHOTO_PATH) {
        setCurrentPhotoSignedUrl(DEFAULT_PHOTO_PATH);
      }

      // Clear upload state
      clearUploadState(PHOTO_UPLOAD_KEY);

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
        router.refresh();
      }, 2000);
    } catch (error) {
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

      // Clear upload state on error
      clearUploadState(PHOTO_UPLOAD_KEY);
    }
  }, [
    profileState.hasChanges,
    formData,
    previewPhoto,
    uploadProfilePhoto,
    oldProfilePhotoKey,
    deleteOldProfilePhoto,
    setOriginalData,
    setFormData,
    setPreviewPhoto,
    loadCurrentPhotoSignedUrl,
    clearUploadState,
    router,
  ]);

  const handleResetChanges = useCallback(() => {
    setFormData(originalData);
    setPreviewPhoto(null);
    setProfileState((prev) => ({ ...prev, hasChanges: false, error: null }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clear any upload states
    clearUploadState(PHOTO_UPLOAD_KEY);

    addToast({
      color: "default",
      title: "Changes Reset",
      description: "All changes have been reset to original values",
    });
  }, [originalData, clearUploadState]);

  // Memoized computed values
  const getCurrentPhotoUrl = useCallback(() => {
    if (previewPhoto) return previewPhoto.preview;

    if (currentPhotoSignedUrl && currentPhotoSignedUrl !== DEFAULT_PHOTO_PATH)
      return currentPhotoSignedUrl;

    if (
      formData.profile_photo &&
      formData.profile_photo !== "" &&
      formData.profile_photo !== DEFAULT_PHOTO_PATH
    )
      return formData.profile_photo;

    return DEFAULT_PHOTO_PATH;
  }, [previewPhoto, currentPhotoSignedUrl, formData.profile_photo]);

  const isDefaultPhoto = useCallback(() => {
    const currentUrl = getCurrentPhotoUrl();

    return (
      currentUrl === DEFAULT_PHOTO_PATH ||
      !formData.profile_photo ||
      formData.profile_photo === "" ||
      formData.profile_photo === DEFAULT_PHOTO_PATH
    );
  }, [getCurrentPhotoUrl, formData.profile_photo]);

  const hasCustomPhoto = useCallback(() => {
    return !isDefaultPhoto() && !previewPhoto;
  }, [isDefaultPhoto, previewPhoto]);

  const getPhotoDisplayState = useCallback(() => {
    if (previewPhoto) return "preview";
    if (profileState.isLoadingPreview) return "loading";
    if (currentPhotoSignedUrl && currentPhotoSignedUrl !== DEFAULT_PHOTO_PATH)
      return "signed";
    if (
      formData.profile_photo &&
      formData.profile_photo !== DEFAULT_PHOTO_PATH &&
      formData.profile_photo !== ""
    )
      return "fallback";
    return "none";
  }, [
    previewPhoto,
    profileState.isLoadingPreview,
    currentPhotoSignedUrl,
    formData.profile_photo,
  ]);

  // Memoized style classes for inputs
  const getInputWrapperClass = useCallback(
    (fieldName) =>
      `border-gray-700 bg-gray-800/50 ${
        formData[fieldName] !== originalData[fieldName]
          ? "border-orange-500/50"
          : ""
      }`,
    [formData, originalData],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 3xl:h-12 3xl:w-12">
            <Edit3
              size={24}
              className="h-5 w-5 text-purple-400 3xl:h-6 3xl:w-6"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white 3xl:text-2xl">
              Edit Profile
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-200">
                Update your personal information
              </span>

              {profileState.lastUpdated && (
                <span className="text-xs text-gray-300">
                  • Updated {profileState.lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profileState.hasChanges && (
            <Button
              size="sm"
              variant="flat"
              onPress={handleResetChanges}
              startContent={<RefreshCw size={16} />}
              isDisabled={
                profileState.isUpdating || profileState.isUploadingPhoto
              }
            >
              Reset Changes
            </Button>
          )}

          <Button
            size="sm"
            onPress={handleSaveProfile}
            isDisabled={!profileState.hasChanges}
            className="border border-gray-400 bg-gradient-dark"
            isLoading={profileState.isUpdating || profileState.isUploadingPhoto}
            startContent={
              !profileState.isUpdating &&
              !profileState.isUploadingPhoto && <Save size={16} />
            }
          >
            {profileState.isUploadingPhoto
              ? "Uploading Photo..."
              : profileState.isUpdating
                ? "Saving Profile..."
                : "Save Changes"}
          </Button>
        </div>
      </div>

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

            {getPhotoDisplayState() === "signed" && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-900/50 px-2 py-1 text-xs font-medium text-green-400">
                <Eye size={12} className="mr-1" />
                Secure View
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative">
              <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-gray-600">
                <img
                  src={getCurrentPhotoUrl()}
                  alt={formData.username || "Profile"}
                  className={`h-full w-full object-cover ${
                    profileState.isLoadingPreview
                      ? "animate-pulse opacity-50"
                      : ""
                  }`}
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    height: "100%",
                    objectFit: "cover",
                    backgroundColor: "transparent",
                  }}
                  onError={(e) => {
                    e.target.src = DEFAULT_PHOTO_PATH;
                  }}
                />
              </div>

              {profileState.isLoadingPreview && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-800/50">
                  <RefreshCw size={16} className="animate-spin text-gray-200" />
                </div>
              )}

              {(hasCustomPhoto() || previewPhoto) &&
                !profileState.isLoadingPreview && (
                  <Button
                    size="sm"
                    isIconOnly
                    variant="flat"
                    title="Remove photo"
                    onPress={handleRemovePhoto}
                    className="absolute -right-1 -top-1 h-5 w-5 min-w-0 bg-red-600/80 text-white hover:bg-red-600"
                    isDisabled={
                      profileState.isUploadingPhoto || profileState.isUpdating
                    }
                  >
                    <X size={14} />
                  </Button>
                )}

              {hasCustomPhoto() &&
                !previewPhoto &&
                !profileState.isLoadingPreview && (
                  <Button
                    size="sm"
                    isIconOnly
                    variant="flat"
                    title="Refresh image"
                    onPress={refreshPhotoUrl}
                    className="bg-blue-600/80 hover:bg-blue-600 absolute -bottom-2 -right-2 text-white"
                    isDisabled={
                      profileState.isUploadingPhoto || profileState.isUpdating
                    }
                  >
                    <RefreshCw size={12} />
                  </Button>
                )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h4 className="mb-1 text-sm font-medium text-white">
                  Upload New Photo
                </h4>

                <p className="mb-3 text-xs text-gray-300">
                  Choose a photo to represent your profile. Recommended size:
                  400x400px, max 5MB. Supported formats: JPG, PNG, GIF.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="flat"
                  startContent={<Upload size={16} />}
                  onPress={() => fileInputRef.current?.click()}
                  isDisabled={
                    profileState.isUploadingPhoto || profileState.isUpdating
                  }
                >
                  {previewPhoto
                    ? "Change Photo"
                    : isDefaultPhoto()
                      ? "Upload Photo"
                      : "Change Photo"}
                </Button>

                {(hasCustomPhoto() || previewPhoto) && (
                  <Button
                    variant="flat"
                    color="danger"
                    onPress={handleRemovePhoto}
                    startContent={<X size={16} />}
                    isDisabled={
                      profileState.isUploadingPhoto || profileState.isUpdating
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
              />

              <div className="text-xs text-gray-300">
                {getPhotoDisplayState() === "loading" &&
                  "Loading secure preview..."}
                {getPhotoDisplayState() === "signed" &&
                  "Displaying secure signed URL"}
                {getPhotoDisplayState() === "preview" &&
                  "Showing preview of selected file"}
                {getPhotoDisplayState() === "fallback" &&
                  "Displaying original URL"}
                {getPhotoDisplayState() === "none" &&
                  "Using default profile photo"}
                {hasCustomPhoto() && (
                  <button
                    onClick={refreshPhotoUrl}
                    className="ml-2 text-blue-400 underline hover:text-blue-300"
                  >
                    Refresh Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Username <span className="text-red-400">*</span>
              </label>

              <Input
                isRequired
                value={formData.username}
                placeholder="Enter your username"
                startContent={<User size={16} className="text-gray-300" />}
                onChange={(e) => handleInputChange("username", e.target.value)}
                classNames={{
                  input: "text-white",
                  inputWrapper: getInputWrapperClass("username"),
                }}
                isDisabled={
                  profileState.isUpdating || profileState.isUploadingPhoto
                }
              />

              <p className="text-xs text-gray-300">
                Public display name visible to other users
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Email Address <span className="text-red-400">*</span>
              </label>

              <Input
                isRequired
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={(e) => handleInputChange("email", e.target.value)}
                startContent={<Mail size={16} className="text-gray-300" />}
                classNames={{
                  input: "text-white",
                  inputWrapper: getInputWrapperClass("email"),
                }}
                isDisabled={
                  profileState.isUpdating || profileState.isUploadingPhoto
                }
              />

              <p className="text-xs text-gray-300">
                Primary email for account notifications
              </p>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-gray-200">
                Location
              </label>

              <Input
                value={formData.location}
                placeholder="Enter your location (e.g., San Francisco, CA)"
                onChange={(e) => handleInputChange("location", e.target.value)}
                startContent={<MapPin size={16} className="text-gray-300" />}
                classNames={{
                  input: "text-white",
                  inputWrapper: getInputWrapperClass("location"),
                }}
                isDisabled={
                  profileState.isUpdating || profileState.isUploadingPhoto
                }
              />

              <p className="text-xs text-gray-300">
                Your location helps with regional quest matching (optional)
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

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

                  <p className="text-xs text-gray-300">
                    You have unsaved changes. Save or reset to continue.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={handleResetChanges}
                  isDisabled={
                    profileState.isUpdating || profileState.isUploadingPhoto
                  }
                >
                  Reset
                </Button>

                <Button
                  size="sm"
                  color="primary"
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
                    ? "Uploading Photo..."
                    : profileState.isUpdating
                      ? "Saving Profile..."
                      : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {profileState.error && (
        <Card className="border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 text-red-400" />

              <div>
                <h4 className="mb-2 font-medium text-red-400">
                  Profile Update Error
                </h4>

                <p className="text-sm text-gray-200">{profileState.error}</p>

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

      <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="mt-0.5 text-blue-400" />

            <div>
              <h4 className="mb-2 font-medium text-blue-400">
                Profile Guidelines & Security
              </h4>

              <div className="space-y-2 text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>

                  <span>
                    Profile photos are securely stored and accessed via signed
                    URLs
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>

                  <span>
                    Choose a clear, recognizable profile photo (max 5MB)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>

                  <span>Use your real name or known handle as username</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>

                  <span>
                    Keep your email updated for important notifications
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>

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
