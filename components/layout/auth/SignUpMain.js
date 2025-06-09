"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

import { useSignup } from "@/hooks/useSignup";
import AuthMainContainer from "./AuthMainContainer";

const SignUpMain = ({ session }) => {
  const {
    allPods,
    username,
    setUsername,
    selectedPod,
    isSubmitting,
    handleSignUp,
    isLoadingPods,
    hasValidAccess,
    getLanguageName,
    handlePodSelectionChange,
  } = useSignup(session);

  if (!hasValidAccess) {
    <AuthMainContainer title="Signing Up" description="Fetching your email">
      <div className="flex items-center justify-center">
        <div className="mb-12 h-8 w-8 animate-spinner-ease-spin rounded-full border-b-2 border-t-2 border-white"></div>
      </div>
    </AuthMainContainer>;
  }

  return (
    <AuthMainContainer
      title="Sign Up"
      description="Create your account and start completing quests to earn rewards!"
    >
      <form onSubmit={handleSignUp} className="mb-4 space-y-4">
        <Input
          type="text"
          value={username}
          variant="bordered"
          label="Your Username"
          className="bg-dark"
          onValueChange={setUsername}
          classNames={{
            inputWrapper:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
        />

        <Select
          label="Select Your Pod"
          variant="bordered"
          isLoading={isLoadingPods}
          selectedKeys={selectedPod}
          onSelectionChange={handlePodSelectionChange}
          className="bg-dark"
          classNames={{
            trigger:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
        >
          {allPods.map((pod) => (
            <SelectItem key={pod.pod_id} value={pod.pod_id}>
              {getLanguageName(pod.language)}
            </SelectItem>
          ))}
        </Select>

        <Button
          type="submit"
          className="h-12 bg-white p-4 text-base font-semibold text-black"
          fullWidth
          endContent={<ArrowRight size={16} />}
          isDisabled={isLoadingPods || isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Continue"}
        </Button>
      </form>
    </AuthMainContainer>
  );
};

export default SignUpMain;
