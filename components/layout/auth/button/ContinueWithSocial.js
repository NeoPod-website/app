"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { useDispatch } from "react-redux";

import { toggleSocialModal } from "@/redux/slice/modalsSlice";

const ContinueWithSocial = () => {
  const dispatch = useDispatch();

  const handleModal = () => {
    dispatch(toggleSocialModal());
  };
  return (
    <Button
      size="lg"
      fullWidth
      variant="bordered"
      className="gap-2.5 border-gray-300 bg-dark"
      startContent={
        <Image
          width={32}
          height={32}
          src="/auth/social/social.svg"
          alt="Social Login Logo"
        />
      }
      onPress={handleModal}
    >
      Continue With Social
    </Button>
  );
};

export default ContinueWithSocial;
