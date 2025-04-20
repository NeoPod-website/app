"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { addToast, Button, InputOtp } from "@heroui/react";

import AuthMainContainer from "./AuthMainContainer";
import ResendEmailTimer from "./button/ResendEmailTimer";

const OTPMain = ({
  otp,
  email,
  setOtp,
  timeLeft,
  isLoading,
  setTimeLeft,
  setShowOTPForm,
  handleOTPSubmit,
}) => {
  const isComplete = otp.length === 6;

  const onResendSuccess = () => {
    addToast({
      title: "Resent code",
      description: "A new code has been sent to your email.",
      color: "success",
    });
  };

  return (
    <AuthMainContainer
      title="Check Your Inbox"
      description={
        <>
          We've sent a code to <span className="text-white">{email}</span>.
          Please enter the code immediately, as it will soon expire.
        </>
      }
      margin="space-y-4"
    >
      <form onSubmit={handleOTPSubmit} className="space-y-3">
        <InputOtp
          length={6}
          size="lg"
          variant="bordered"
          value={otp}
          onValueChange={setOtp}
          classNames={{
            segment:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
          className="mx-auto w-fit text-center"
        />

        <Button
          className="h-12 bg-white p-4 text-base font-semibold text-black"
          fullWidth
          isDisabled={!isComplete}
          endContent={<ArrowRight size={16} />}
          type="submit"
          isLoading={isLoading}
        >
          Continue
        </Button>

        <ResendEmailTimer
          email={email}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onResend={onResendSuccess}
        />

        <div className="text-center text-sm text-gray-300">
          Wrong Email?{" "}
          <button
            type="button"
            className="text-white underline"
            onClick={() => {
              setShowOTPForm(false);
              setTimeLeft(0);
              setOtp("");
            }}
          >
            Go Back
          </button>
        </div>
      </form>
    </AuthMainContainer>
  );
};

export default OTPMain;
