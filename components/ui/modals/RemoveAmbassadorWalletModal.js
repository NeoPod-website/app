"use client";

import React from "react";
import { Button } from "@heroui/react";
import { AlertCircleIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import MainModal from "./MainModal";

import { toggleRemoveAmbassadorWalletModal } from "@/redux/slice/modalsSlice";

const RemoveAmbassadorWalletModal = ({
  handleDisconnectConfirm,
  isUsingAmbassadorAddress,
}) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state) => state.modals.isRemoveAmbassadorWalletModalOpen,
  );

  const handleOnClose = () => {
    dispatch(toggleRemoveAmbassadorWalletModal());
  };

  return (
    <MainModal
      isOpen={isOpen}
      showFooter={true}
      title="Disconnect Wallet"
      handleOnClose={handleOnClose}
      footer={
        <>
          <Button onPress={handleOnClose}>Cancel</Button>

          <Button color="danger" onPress={handleDisconnectConfirm}>
            Disconnect
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <AlertCircleIcon size={24} className="mt-1 text-yellow-400" />

        <div>
          <p className="mb-2 text-white">
            Are you sure you want to disconnect your wallet?
          </p>

          <p className="text-sm text-gray-200">
            {isUsingAmbassadorAddress
              ? "This will remove your wallet from your account and log you out."
              : "This will disconnect your wallet and clear your session."}
          </p>
        </div>
      </div>
    </MainModal>
  );
};

export default RemoveAmbassadorWalletModal;
