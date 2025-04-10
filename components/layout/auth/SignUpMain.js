"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

import AuthMainContainer from "./AuthMainContainer";

const SignUpMain = () => {
  return (
    <AuthMainContainer
      title="Sign Up"
      description="Create your account and start completing quests to earn rewards!"
      margin="space-y-4"
    >
      <Input
        label="Your Username"
        type="text"
        variant="bordered"
        className="bg-dark"
        classNames={{
          inputWrapper:
            "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
        }}
      />

      <Select
        label="Your Language"
        variant="bordered"
        defaultSelectedKeys={["zh"]}
        className="bg-dark"
        classNames={{
          trigger:
            "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
        }}
      >
        <SelectItem key="zh" value="Chinese">
          Chinese
        </SelectItem>
        <SelectItem key="en" value="English">
          English
        </SelectItem>
        {/* Add more language options as needed */}
      </Select>

      <Button
        className="h-12 bg-white p-4 text-base font-semibold text-black"
        fullWidth
        endContent={<ArrowRight size={16} />}
      >
        Continue
      </Button>
    </AuthMainContainer>
  );
};

export default SignUpMain;
