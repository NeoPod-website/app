"use client";

import {
  Input,
  Button,
  Select,
  Switch,
  Spinner,
  SelectItem,
} from "@heroui/react";
import React from "react";
import Image from "next/image";
import { ArrowRightIcon, GiftIcon } from "lucide-react";

import { useSignup } from "@/hooks/useSignup";

import AuthMainContainer from "./AuthMainContainer";

const SignUpMain = ({ session, inviteCode }) => {
  const {
    allPods,
    username,
    setUsername,
    selectedPod,
    inviterInfo,
    isSubmitting,
    inviterError,
    handleSignUp,
    isLoadingPods,
    hasInviteCode,
    hasValidAccess,
    getLanguageName,
    isLoadingInviter,
    enteredInviteCode,
    handleInviteCodeToggle,
    handleInviteCodeChange,
    handlePodSelectionChange,
  } = useSignup(session, inviteCode);

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
      className={`${hasInviteCode ? "-mt-16" : ""}`}
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
          variant="bordered"
          className="bg-dark"
          label="Select Your Pod"
          isLoading={isLoadingPods}
          selectedKeys={selectedPod}
          onSelectionChange={handlePodSelectionChange}
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GiftIcon className="h-4 w-4 text-gray-300" />

              <span className="text-sm font-medium text-gray-200">
                {inviteCode ? "Invited by a friend" : "Have an invite code?"}
              </span>
            </div>

            {!inviteCode && (
              <Switch
                size="sm"
                isSelected={hasInviteCode}
                onValueChange={handleInviteCodeToggle}
                classNames={{
                  wrapper: "group-data-[selected=true]:bg-[#FF006B]",
                }}
              />
            )}
          </div>

          {hasInviteCode && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-200">
                    Enter your 8-character invite code
                  </p>
                  <p className="text-xs text-gray-300">
                    Code can contain letters (A-Z) and numbers (0-9)
                  </p>
                </div>

                <Input
                  size="lg"
                  maxLength={8}
                  variant="bordered"
                  value={enteredInviteCode}
                  isDisabled={!!inviteCode}
                  className="mx-auto w-fit"
                  onValueChange={handleInviteCodeChange}
                  classNames={{
                    input: "text-center font-mono text-lg",
                    inputWrapper:
                      "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
                  }}
                />
              </div>

              {enteredInviteCode.length === 8 && (
                <div className="rounded-lg border border-gray-600 bg-gray-800/30 p-4">
                  {isLoadingInviter ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" color="white" />

                      <span className="text-sm text-gray-300">
                        Verifying invite code...
                      </span>
                    </div>
                  ) : inviterError ? (
                    <div className="text-center">
                      <p className="mb-1 text-sm font-medium text-red-400">
                        Invalid invite code
                      </p>

                      <p className="text-xs text-gray-400">{inviterError}</p>
                    </div>
                  ) : inviterInfo ? (
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="mb-2 text-sm font-medium text-green-400">
                          ✓ Valid invite code
                        </p>

                        <p className="mb-3 text-xs text-gray-300">
                          You're being invited by:
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <Image
                          width={48}
                          height={48}
                          alt={inviterInfo.username}
                          className="rounded-full border border-gray-600"
                          src={
                            inviterInfo.profile_photo ||
                            "/dashboard/profile/default-profile.png"
                          }
                        />

                        <div className="text-left">
                          <p className="text-sm font-medium capitalize text-white">
                            {inviterInfo.username}
                          </p>

                          <p className="text-xs text-gray-100">
                            {inviterInfo.invite_count || 0} successful invites
                          </p>

                          {inviterInfo.member_since && (
                            <p className="text-xs text-gray-200">
                              Member since{" "}
                              {new Date(
                                inviterInfo.member_since,
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {inviteCode && (
                <div className="text-center">
                  <p className="text-xs text-green-400">
                    ✓ Invite code applied from link
                  </p>
                </div>
              )}

              {!inviteCode &&
                enteredInviteCode.length > 0 &&
                enteredInviteCode.length < 8 && (
                  <div className="text-center">
                    <p className="text-xs text-yellow-400">
                      Code must be 8 characters ({enteredInviteCode.length}/8)
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>

        <Button
          fullWidth
          type="submit"
          isLoading={isSubmitting}
          endContent={<ArrowRightIcon size={16} />}
          isDisabled={
            isSubmitting ||
            isLoadingPods ||
            // Disable if invite code toggle is on but code is incomplete or invalid
            (hasInviteCode &&
              (enteredInviteCode.length === 0 || // No code entered
                (enteredInviteCode.length > 0 &&
                  enteredInviteCode.length < 8) || // Incomplete code
                (enteredInviteCode.length === 8 &&
                  (inviterError || isLoadingInviter)))) // Invalid or still loading
          }
          className="h-12 bg-white p-4 text-base font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? "Creating Account..."
            : hasInviteCode && enteredInviteCode.length === 0
              ? "Enter invite code to continue"
              : hasInviteCode &&
                  enteredInviteCode.length > 0 &&
                  enteredInviteCode.length < 8
                ? "Complete invite code to continue"
                : hasInviteCode &&
                    enteredInviteCode.length === 8 &&
                    isLoadingInviter
                  ? "Verifying invite code..."
                  : hasInviteCode &&
                      enteredInviteCode.length === 8 &&
                      inviterError
                    ? "Invalid invite code"
                    : "Continue"}
        </Button>
      </form>
    </AuthMainContainer>
  );
};

export default SignUpMain;
