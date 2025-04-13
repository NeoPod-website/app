"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

import OTPMain from "./OTPMain";
import EmailSignUp from "./EmailSignUp";
import AuthMainContainer from "./AuthMainContainer";

const AdminAuth = () => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

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

      setTimeLeft(60);
      setShowOTPForm(true);
    } catch (err) {
      addToast({
        title: err.message || "Failed to send verification code",
        color: "danger",
      });

      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      addToast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        color: "warning",
      });

      return;
    }

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

      addToast({
        title: "OTP Verified",
        description: "Your email has been verified.",
        color: "success",
      });

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/email/${email}`,
        );

        if (res.ok) {
          const loginRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },

              body: JSON.stringify({ email, login_method: "email" }),
              credentials: "include",
            },
          );

          router.push("/");

          const userData = await loginRes.json();

          localStorage.setItem("token", userData.token);
          localStorage.setItem("user", JSON.stringify(userData.data.user));

          setOtp("");
          setEmail("");
        }
      } catch (err) {
        addToast({
          title: "500: Something went wrong",
          color: "danger",
        });
      }
    } catch (err) {
      setError(err.message);

      addToast({
        title: err.message || "Failed to send verification code",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return showOTPForm ? (
    <OTPMain
      otp={otp}
      email={email}
      setOtp={setOtp}
      timeLeft={timeLeft}
      isLoading={isLoading}
      setTimeLeft={setTimeLeft}
      setShowOTPForm={setShowOTPForm}
      handleOTPSubmit={handleOTPSubmit}
    />
  ) : (
    <AuthMainContainer
      title="Welcome back"
      description="Access the admin dashboard to manage ambassadors, review activity, and keep the community thriving!"
    >
      <EmailSignUp
        email={email}
        setEmail={setEmail}
        isLoading={isLoading}
        isValidEmail={isValidEmail}
        handleEmailSubmit={handleEmailSubmit}
      />
    </AuthMainContainer>
  );
};

export default AdminAuth;
