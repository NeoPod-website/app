"use client";

import React from "react";
import { Button } from "@heroui/react";
import { AlertCircleIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import MainModal from "./MainModal";

import { toggleDisconnectedSocialModal } from "@/redux/slice/modalsSlice";

const DisconnectSocialModal = ({
  platforms,
  selectedPlatform,
  disconnectingPlatform,
  handleDisconnectConfirm,
}) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state) => state.modals.isDisconnectedSocialModalOpen,
  );

  const handleOnClose = () => {
    dispatch(toggleDisconnectedSocialModal());
  };

  return (
    <MainModal
      isOpen={isOpen}
      showFooter={true}
      handleOnClose={handleOnClose}
      title="Disconnect Social Account"
      description="Are you sure you want to disconnect your account?"
      footer={
        <>
          <Button variant="light" onPress={handleOnClose}>
            Cancel
          </Button>

          <Button
            color="danger"
            onPress={handleDisconnectConfirm}
            isLoading={!!disconnectingPlatform}
          >
            Disconnect
          </Button>
        </>
      }
    >
      {selectedPlatform && (
        <div className="flex items-start gap-3">
          <AlertCircleIcon size={24} className="mt-1 text-red-400" />

          <div>
            <p className="mb-2 text-white">
              Are you sure you want to disconnect your{" "}
              <span className="font-semibold">
                {platforms[selectedPlatform]?.name}
              </span>{" "}
              account?
            </p>

            <p className="text-sm text-gray-200">
              This will remove the account from your verification and may affect
              your ambassador status and rewards eligibility.
            </p>
          </div>
        </div>
      )}
    </MainModal>
  );
};

export default DisconnectSocialModal;
