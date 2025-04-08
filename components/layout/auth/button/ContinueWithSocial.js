"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";

const ContinueWithSocial = () => {
  return (
    <Button
      size="lg"
      fullWidth
      variant="bordered"
      className=" bg-dark border-gray-300 gap-2.5"
      classNames={{
        content: "text-base",
      }}
      startContent={
        <Image width={32} height={32} src="/auth/google.svg" alt="Google" />
      }
    >
      Continue With Social
    </Button>
  );
};

export default ContinueWithSocial;
