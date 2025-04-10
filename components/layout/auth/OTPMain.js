"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button, InputOtp } from "@heroui/react";

import AuthMainContainer from "./AuthMainContainer";

const OTPMain = () => {
  const [otpValue, setOtpValue] = useState("");

  const isComplete = otpValue.length === 6;

  return (
    <AuthMainContainer
      title="Check Your Inbox"
      description="We've sent a code to anoyroyc3545@gmail.com. Please enter the code immediately, as it will soon expire."
      margin="space-y-4"
    >
      <InputOtp
        length={6}
        size="lg"
        variant="bordered"
        value={otpValue}
        onValueChange={setOtpValue}
        classNames={{
          segment:
            "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
        }}
        className="w-fit mx-auto text-center"
      />

      <Button
        className="bg-white text-black font-semibold p-4 text-base h-12"
        fullWidth
        isDisabled={!isComplete}
        endContent={<ArrowRight size={16} />}
      >
        Continue
      </Button>
    </AuthMainContainer>
  );
};

export default OTPMain;
