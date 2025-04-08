"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button, Input } from "@heroui/react";

const EmailSignUp = () => {
  return (
    <div className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        variant="bordered"
        className="bg-dark"
        classNames={{
          inputWrapper:
            "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
        }}
      />

      <Button
        className="bg-white text-black font-semibold p-4 text-base h-12"
        fullWidth
        endContent={<ArrowRight size={16} />}
      >
        Continue
      </Button>
    </div>
  );
};

export default EmailSignUp;
