"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

import OTPMain from "./OTPMain";
import LoginMain from "./LoginMain";

const AuthMain = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email) {
      addToast({
        title: "Please enter an email address",
        color: "default",
      });
      return;
    }

    if (!isValidEmail(email)) {
      addToast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        color: "warning",
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/passwordless/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      setShowOTPForm(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/passwordless/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return showOTPForm ? (
    <OTPMain />
  ) : (
    <LoginMain
      email={email}
      setEmail={setEmail}
      isLoading={isLoading}
      handleEmailSubmit={handleEmailSubmit}
    />
  );
};

export default AuthMain;
