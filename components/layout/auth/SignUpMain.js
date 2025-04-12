"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

import AuthMainContainer from "./AuthMainContainer";

const SignUpMain = () => {
  const [username, setUsername] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState(new Set(["zh"]));

  const handleSelectionChange = (keys) => {
    setSelectedLanguage(keys);
  };

  const handleSignUp = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: email }),
        },
      );

      const userData = await res.json();

      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.data.user));

      if (res.ok) {
        router.push("/");
      } else {
        router.push("/error?reason=Backend-login-failed");
      }
    } catch (err) {
      console.error("Client login failed:", err);
      router.push("/error?reason=Something-went-wrong");
    }
  };

  return (
    <AuthMainContainer
      title="Sign Up"
      description="Create your account and start completing quests to earn rewards!"
    >
      <form onSubmit={handleSignUp} className="mb-4 space-y-4">
        <Input
          label="Your Username"
          type="text"
          value={username}
          onChange={setUsername}
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
          selectedKeys={selectedLanguage}
          onSelectionChange={handleSelectionChange}
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
          type="submit"
          className="h-12 bg-white p-4 text-base font-semibold text-black"
          fullWidth
          endContent={<ArrowRight size={16} />}
        >
          Continue
        </Button>
      </form>
    </AuthMainContainer>
  );
};

export default SignUpMain;
