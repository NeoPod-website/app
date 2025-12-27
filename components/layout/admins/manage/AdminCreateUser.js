"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, User, Mail, Shield } from "lucide-react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

import AdminPodSelector from "./AdminPodSelector";

import WrapperContainer from "@/components/common/WrapperContainer";

const ROLE_OPTIONS = [
  { value: "community", label: "Community Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "reviewer", label: "Reviewer" },
];

const AdminCreateUser = ({
  adminData,
  isSubmitting,
  setIsSubmitting,
  handleAdminDataChange,
}) => {
  const router = useRouter();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!adminData.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (adminData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(adminData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers and underscores";
    }

    if (!adminData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!adminData.role_type) {
      newErrors.role_type = "Role type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        username: adminData.username.trim().toLowerCase(),
        email: adminData.email.trim().toLowerCase(),
        role_type: adminData.role_type,
        assigned_pods: adminData.assigned_pods || [],
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super/admins`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to create admin (${response.status})`,
        );
      }

      const data = await response.json();
      console.log("Admin created successfully:", data);

      // Redirect to admin management page
      router.push("/admin/manage/admins");
    } catch (error) {
      console.error("Failed to create admin:", error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WrapperContainer scrollable className="flex-1">
      <div className="hide-scroll space-y-6 overflow-y-auto p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Create New Admin</h1>

          <p className="text-gray-400">
            Create a new admin account to manage PODs and oversee community
            activities.
          </p>
        </div>

        {errors.submit && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-4 text-sm text-red-300">
            {errors.submit}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Username"
            value={adminData.username}
            isInvalid={!!errors.username}
            errorMessage={errors.username}
            placeholder="Enter admin username"
            startContent={<User size={18} className="text-gray-400" />}
            onValueChange={(value) => handleAdminDataChange("username", value)}
            description="Must be unique and contain only letters, numbers and underscores"
            classNames={{
              inputWrapper:
                "bg-gray-700/50 border border-gray-600 hover:border-gray-500",
              input: "text-white",
              label: "text-gray-300 font-medium",
              description: "text-gray-300",
            }}
            disabled={isSubmitting}
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter admin email"
            value={adminData.email}
            onValueChange={(value) => handleAdminDataChange("email", value)}
            startContent={<Mail size={18} className="text-gray-400" />}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            description="Will be used for login and notifications"
            classNames={{
              inputWrapper:
                "bg-gray-700/50 border border-gray-600 hover:border-gray-500",
              input: "text-white",
              label: "text-gray-300 font-medium",
              description: "text-gray-300",
            }}
            disabled={isSubmitting}
          />

          <Select
            label="Role Type"
            disabled={isSubmitting}
            isInvalid={!!errors.role_type}
            errorMessage={errors.role_type}
            placeholder="Select admin role"
            selectedKeys={adminData.role_type ? [adminData.role_type] : []}
            startContent={<Shield size={18} className="text-gray-400" />}
            onSelectionChange={(keys) =>
              handleAdminDataChange("role_type", [...keys][0])
            }
            description="Determines the admin's permissions and access level"
            classNames={{
              trigger:
                "bg-gray-700/50 border border-gray-600 hover:border-gray-500 h-14",
              value: "text-white",
              label: "text-gray-300 font-medium",
              description: "text-gray-300",
              popoverContent: "bg-black/90 border border-gray-600",
            }}
          >
            {ROLE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-200 hover:bg-gray-700/50"
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>

          <AdminPodSelector
            assignedPods={adminData.assigned_pods || []}
            onChange={(pods) => handleAdminDataChange("assigned_pods", pods)}
          />
        </div>

        <div className="space-y-3 rounded-lg bg-gray-700/40 p-4">
          <h3 className="text-sm font-medium text-gray-200">
            Role Permissions:
          </h3>

          <div className="space-y-2 text-xs text-gray-100">
            <div className="flex gap-2">
              <span className="font-medium text-blue-400">Community:</span>
              <span>
                Manage assigned pods, ambassadors, and user interactions.
              </span>
            </div>

            <div className="flex gap-2">
              <span className="font-medium text-purple-400">Moderator:</span>
              <span>Moderate ambassadors, and manage user interactions.</span>
            </div>

            <div className="flex gap-2">
              <span className="font-medium text-orange-400">Reviewer:</span>
              <span>Review and approve submissions.</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            size="md"
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            startContent={!isSubmitting && <Save size={18} />}
            className="flex-1 bg-gradient-primary"
          >
            {isSubmitting ? "Creating Admin..." : "Create Admin"}
          </Button>

          <Button
            size="md"
            variant="bordered"
            onPress={() => router.back()}
            disabled={isSubmitting}
            className="border-gray-600 px-8 text-gray-100 hover:border-red-400 hover:text-red-400"
          >
            Cancel
          </Button>
        </div>

        <div className="bg-blue-500/20 rounded-lg border border-blue-500/30 p-4">
          <h4 className="mb-2 text-sm font-medium text-blue-300">
            Important Notes:
          </h4>

          <ul className="space-y-1 text-xs text-blue-200">
            <li>• The admin will receive login instructions via email</li>
            <li>• Pod assignments can be managed after creation</li>
            <li>• Admin status will be set to active by default</li>
            <li>• Only super admins can create new admin accounts</li>
          </ul>
        </div>
      </div>
    </WrapperContainer>
  );
};

export default AdminCreateUser;
