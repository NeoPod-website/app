"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  Avatar,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  UserIcon,
  CameraIcon,
  EditIcon,
  GlobeIcon,
  ExternalLinkIcon,
} from "lucide-react";

const ProfileTab = () => {
  const [profileData, setProfileData] = useState({
    name: "Alexandra Chen",
    username: "alexchen",
    email: "alex.chen@example.com",
    bio: "Blockchain enthusiast, community builder, and tech innovator. Passionate about decentralized technologies and building the future of web3.",
    location: "San Francisco, CA",
    website: "https://alexchen.dev",
    joinDate: "March 2023",
    profileCompletion: 85,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleProfileUpdate = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute -bottom-8 left-8">
          <div className="relative">
            <Avatar
              src="/api/placeholder/100/100"
              className="h-20 w-20 border-4 border-gray-900"
              fallback={<UserIcon size={32} />}
            />
            <Button
              isIconOnly
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 absolute -bottom-1 -right-1 border-2 border-gray-900"
              onClick={onOpen}
            >
              <CameraIcon size={14} />
            </Button>
          </div>
        </div>
        <div className="px-8 pb-6 pt-12">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {profileData.name}
              </h2>
              <p className="text-gray-400">@{profileData.username}</p>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Joined {profileData.joinDate}
                </span>
                <Chip size="sm" color="success" variant="flat">
                  Ambassador
                </Chip>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 text-sm text-gray-400">
                Profile Completion
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={profileData.profileCompletion}
                  className="w-20"
                  color="success"
                  size="sm"
                />
                <span className="text-sm font-medium text-white">
                  {profileData.profileCompletion}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
          <CardBody className="space-y-6 p-6">
            <div className="mb-4 flex items-center gap-2">
              <UserIcon size={20} className="text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Personal Information
              </h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => handleProfileUpdate("name", e.target.value)}
                variant="bordered"
                classNames={{
                  input: "text-white",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-gray-800/50 border-gray-600 hover:border-gray-500 focus-within:!border-blue-500",
                }}
              />

              <Input
                label="Username"
                value={profileData.username}
                startContent={<span className="text-gray-400">@</span>}
                onChange={(e) =>
                  handleProfileUpdate("username", e.target.value)
                }
                variant="bordered"
                classNames={{
                  input: "text-white",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-gray-800/50 border-gray-600 hover:border-gray-500 focus-within:!border-blue-500",
                }}
              />

              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileUpdate("email", e.target.value)}
                variant="bordered"
                classNames={{
                  input: "text-white",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-gray-800/50 border-gray-600 hover:border-gray-500 focus-within:!border-blue-500",
                }}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Location"
                  value={profileData.location}
                  startContent={
                    <GlobeIcon size={16} className="text-gray-400" />
                  }
                  onChange={(e) =>
                    handleProfileUpdate("location", e.target.value)
                  }
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    label: "text-gray-300",
                    inputWrapper:
                      "bg-gray-800/50 border-gray-600 hover:border-gray-500 focus-within:!border-blue-500",
                  }}
                />

                <Input
                  label="Website"
                  value={profileData.website}
                  startContent={
                    <ExternalLinkIcon size={16} className="text-gray-400" />
                  }
                  onChange={(e) =>
                    handleProfileUpdate("website", e.target.value)
                  }
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    label: "text-gray-300",
                    inputWrapper:
                      "bg-gray-800/50 border-gray-600 hover:border-gray-500 focus-within:!border-blue-500",
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <EditIcon size={20} className="text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Bio & Description
              </h3>
            </div>

            <Textarea
              label="About You"
              value={profileData.bio}
              onChange={(e) => handleProfileUpdate("bio", e.target.value)}
              rows={8}
              variant="bordered"
              classNames={{
                input: "text-white",
                label: "text-gray-300",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-gray-500 focus-within:!border-blue-500",
              }}
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {profileData.bio.length}/500 characters
              </span>
              <Button size="sm" variant="flat" color="primary">
                AI Enhance
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Avatar Upload Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        backdrop="blur"
      >
        <ModalContent className="border border-gray-700 bg-gray-900">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-800">
                <h3 className="text-white">Update Profile Picture</h3>
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="space-y-6 text-center">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-dashed border-gray-600 bg-gray-800">
                    <CameraIcon size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <Button color="primary" className="mb-3">
                      Choose File
                    </Button>
                    <p className="text-sm text-gray-400">
                      Upload a square image (JPG, PNG, GIF). Max size: 5MB
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-800">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Upload & Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileTab;
