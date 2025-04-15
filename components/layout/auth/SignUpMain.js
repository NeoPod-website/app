"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Select, SelectItem } from "@heroui/react";

import { setUserState } from "@/redux/slice/userSlice";

import AuthMainContainer from "./AuthMainContainer";

const SignUpMain = ({ session }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const email = useSelector((state) => state.user?.email);
  const address = useSelector((state) => state.user?.address);
  const login_method = useSelector((state) => state.user?.login_method);

  const [username, setUsername] = useState();
  console.log(username);
  const [selectedLanguage, setSelectedLanguage] = useState(new Set(["zh"]));

  const handleSelectionChange = (keys) => {
    setSelectedLanguage(keys);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const loginPayload = {
        login_method,
        username,
        language: Array.from(selectedLanguage)[0],
      };

      if (email) {
        loginPayload.email = email;
      } else if (address) {
        loginPayload.wallet_address = address;
      } else {
        loginPayload.email = session.user.email;
        loginPayload.login_method = "social";
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(loginPayload),
        },
      );

      if (res.ok) {
        const { token, data } = await res.json();

        dispatch(
          setUserState({
            role: data.isAdmin ? "admin" : "ambassador",
            user: data.user,
            username: username,
            email: loginPayload.email,
            address: loginPayload.address,
            login_method: loginPayload.login_method,
          }),
        );

        localStorage.setItem("neo-token", token);

        router.push("/");
      } else {
        router.push(
          `/error?reason=${res.errors.msg || "Backend-signup-failed"}`,
        );
      }
    } catch (err) {
      console.error("Client signup failed:", err);
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
          onValueChange={setUsername}
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
