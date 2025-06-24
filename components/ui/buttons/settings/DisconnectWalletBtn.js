"use client";

import React from "react";
import { Button } from "@heroui/react";
import { LogOutIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import { toggleRemoveAmbassadorWalletModal } from "@/redux/slice/modalsSlice";

const DisconnectWalletBtn = () => {
  const dispatch = useDispatch();

  const handleDisconnectConfirm = () => {
    dispatch(toggleRemoveAmbassadorWalletModal());
  };

  return (
    <Button
      size="sm"
      color="danger"
      variant="flat"
      onPress={handleDisconnectConfirm}
      startContent={<LogOutIcon size={16} />}
    >
      Disconnect
    </Button>
  );
};

export default DisconnectWalletBtn;
