"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button, Input } from "@heroui/react";

const EmailSignUp = ({
  email,
  setEmail,
  isLoading,
  isValidEmail,
  handleEmailSubmit,
}) => {
  return (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        variant="bordered"
        value={email}
        onValueChange={setEmail}
        className="bg-dark"
        classNames={{
          inputWrapper:
            "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
        }}
      />

      <Button
        type="submit"
        className="h-12 bg-white p-4 text-base font-semibold text-black"
        fullWidth
        endContent={<ArrowRight size={16} />}
        isLoading={isLoading}
        isDisabled={!email || !isValidEmail(email)}
      >
        Continue
      </Button>
    </form>
  );
};

export default EmailSignUp;
