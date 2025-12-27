"use client";

import {
  Copy,
  Clock,
  Shield,
  Search,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { addToast } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Code } from "@heroui/react";

const TelegramVerificationFlow = ({
  onBack,
  platform,
  onSuccess,
  platformKey,
}) => {
  const [verificationState, setVerificationState] = useState({
    code: null,
    error: null,
    expiresAt: null,
    manualChecks: 0,
    step: "generate",
    isLoading: false,
    isChecking: false,
    timeRemaining: null,
  });

  // Update time remaining countdown
  useEffect(() => {
    let interval;

    if (verificationState.expiresAt && verificationState.step === "waiting") {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, verificationState.expiresAt - now);

        if (remaining === 0) {
          setVerificationState((prev) => ({
            ...prev,
            step: "error",
            error:
              "Verification code expired after 5 minutes. Please generate a new one.",
          }));
        } else {
          setVerificationState((prev) => ({
            ...prev,
            timeRemaining: remaining,
          }));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [verificationState.expiresAt, verificationState.step]);

  const generateVerificationCode = async () => {
    setVerificationState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      manualChecks: 0,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/socials/telegram/generate-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to generate verification code",
        );
      }

      const data = await response.json();

      setVerificationState((prev) => ({
        ...prev,
        step: "waiting",
        code: data.verificationCode,
        isLoading: false,
        expiresAt: Date.now() + data.expiresIn * 1000,
        timeRemaining: data.expiresIn * 1000,
        manualChecks: 0,
      }));

      addToast({
        title: "Verification Code Generated",
        description: "Copy the code and send it to our Telegram bot.",
        color: "success",
        timeout: 4000,
      });
    } catch (error) {
      setVerificationState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
        step: "error",
      }));

      addToast({
        title: "Generation Failed",
        description: error.message,
        color: "danger",
        timeout: 6000,
      });
    }
  };

  const checkVerificationStatus = async () => {
    if (!verificationState.code || verificationState.isChecking) return;

    setVerificationState((prev) => ({
      ...prev,
      isChecking: true,
      manualChecks: prev.manualChecks + 1,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/socials/telegram/verification-status?verificationCode=${verificationState.code}`,
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to check verification status");
      }

      const data = await response.json();

      // Check for token refresh response (indicates successful verification)
      if (data.status === "success" && data.data?.user?.telegram) {
        setVerificationState((prev) => ({ ...prev, step: "success" }));

        addToast({
          title: "Telegram Connected!",
          description: "Your account has been verified and token refreshed!",
          color: "success",
          timeout: 4000,
        });

        // Wait a moment then trigger success with page refresh
        setTimeout(() => {
          onSuccess(platformKey, {
            platform: "telegram",
            userData: data.data.user,
          });

          // Force a hard refresh to get updated user data with new token
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }, 2000);
      }
      // Check for verification status response
      else if (data.success && data.status === "completed") {
        setVerificationState((prev) => ({ ...prev, step: "success" }));

        addToast({
          title: "Telegram Connected!",
          description:
            "Your account has been verified. Refreshing your session...",
          color: "success",
          timeout: 4000,
        });

        // Wait a moment then trigger success with page refresh
        setTimeout(() => {
          onSuccess(platformKey, { platform: "telegram" });

          // Force a hard refresh to get updated user data with new token
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }, 2000);
      }
      // Handle error statuses
      else if (data.status === "invalid" || data.status === "expired") {
        setVerificationState((prev) => ({
          ...prev,
          step: "error",
          error: data.message || "Verification code is invalid or has expired.",
        }));
      }
      // Still pending
      else {
        // Still pending - show helpful message
        const remainingAttempts = Math.max(0, data.attemptsRemaining || 0);
        const statusMessage =
          data.status === "pending"
            ? `Verification pending. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : ""}`
            : "Verification in progress...";

        addToast({
          title: "Not verified yet",
          description: statusMessage,
          color: "warning",
          timeout: 3000,
        });
      }
    } catch (error) {
      console.error("Status check error:", error);
      addToast({
        title: "Check Failed",
        description: "Unable to check status. Please try again.",
        color: "danger",
        timeout: 4000,
      });
    } finally {
      setVerificationState((prev) => ({
        ...prev,
        isChecking: false,
      }));
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      addToast({
        title: "Copied!",
        description: "Verification code copied to clipboard",
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      addToast({
        title: "Copy Failed",
        description: "Please copy the code manually",
        color: "warning",
        timeout: 3000,
      });
    }
  };

  const formatTimeRemaining = (ms) => {
    if (!ms) return "0:00";

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const resetFlow = () => {
    setVerificationState({
      code: null,
      error: null,
      expiresAt: null,
      manualChecks: 0,
      step: "generate",
      isLoading: false,
      isChecking: false,
      timeRemaining: null,
    });
  };

  const botUsername =
    platform.botUsername ||
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
    "neopod_bot";

  const botUrl = `https://t.me/${botUsername}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button isIconOnly variant="flat" size="sm" onPress={onBack}>
          <ArrowLeft size={16} />
        </Button>

        <div>
          <h2 className="text-2xl font-bold text-white">Connect Telegram</h2>

          <p className="text-gray-200">
            Verify your Telegram account with our bot verification system
          </p>
        </div>
      </div>

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-8">
          {verificationState.step === "generate" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-600/20">
                  <MessageCircle size={32} className="text-sky-400" />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-white">
                  Connect Your Telegram
                </h3>

                <p className="mx-auto max-w-2xl text-gray-200">
                  Generate a verification code and send it to our Telegram bot
                  to connect your account
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-900/20 p-6">
                <AlertCircle size={20} className="mt-0.5 text-sky-400" />

                <div>
                  <p className="mb-3 text-sm font-medium text-sky-400">
                    How Telegram Verification Works
                  </p>

                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-sky-400">1.</span>
                      <span>Generate a unique verification code</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-sky-400">2.</span>
                      <span>Open our Telegram bot</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-sky-400">3.</span>

                      <span>
                        Send the code using{" "}
                        <code className="rounded bg-gray-700 px-1">
                          /verify [code]
                        </code>
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-sky-400">4.</span>
                      <span>Click "Check Status" to verify connection</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-900/20 p-4">
                <Shield size={20} className="mt-0.5 text-green-400" />

                <div>
                  <p className="mb-2 text-sm font-medium text-green-400">
                    Secure & Private
                  </p>

                  <div className="space-y-1 text-xs text-gray-300">
                    <p>• Previous codes automatically invalidated</p>
                    <p>• Code expires in 5 minutes for security</p>
                    <p>• Only basic profile info is accessed</p>
                    <p>• Disconnect anytime from settings</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onPress={generateVerificationCode}
                isLoading={verificationState.isLoading}
                className="w-full bg-sky-600 font-semibold text-white"
                startContent={
                  !verificationState.isLoading && <MessageCircle size={16} />
                }
              >
                Generate Verification Code
              </Button>
            </div>
          )}

          {verificationState.step === "waiting" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-600/20">
                  <Clock size={32} className="text-sky-400" />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-white">
                  Verification Code Generated
                </h3>

                <p className="mx-auto max-w-2xl text-gray-200">
                  Send this code to our Telegram bot, then click "Check Status"
                  to verify
                </p>
              </div>

              <div className="rounded-xl border border-sky-500/20 bg-sky-900/20 p-6">
                <div className="space-y-4 text-center">
                  <p className="text-sm font-medium text-sky-400">
                    Your Verification Code
                  </p>

                  <div className="relative">
                    <Code className="rounded-lg border border-gray-600 bg-gray-800 px-6 py-4 font-mono text-2xl">
                      {verificationState.code}
                    </Code>

                    <Button
                      isIconOnly
                      variant="flat"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onPress={() => copyToClipboard(verificationState.code)}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Clock size={16} className="text-orange-400" />

                    <span className="text-orange-400">
                      Expires in{" "}
                      {formatTimeRemaining(verificationState.timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-800/50 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/20">
                      <MessageCircle size={20} className="text-sky-400" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">
                        Send to Telegram Bot
                      </h4>

                      <p className="text-sm text-gray-400">
                        Follow these steps:
                      </p>
                    </div>
                  </div>

                  <div className="pl-13 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600/20 text-xs font-bold text-sky-400">
                        1
                      </span>

                      <div>
                        <p className="text-sm font-medium text-white">
                          Open Our Bot
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <Code className="text-sm">@{botUsername}</Code>

                          <Button
                            size="sm"
                            variant="flat"
                            endContent={<ExternalLink size={14} />}
                            onPress={() => window.open(botUrl, "_blank")}
                          >
                            Open Bot
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600/20 text-xs font-bold text-sky-400">
                        2
                      </span>

                      <div>
                        <p className="text-sm font-medium text-white">
                          Send Verification Command
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <Code className="text-sm">
                            /verify {verificationState.code}
                          </Code>

                          <Button
                            size="sm"
                            variant="flat"
                            endContent={<Copy size={14} />}
                            onPress={() =>
                              copyToClipboard(
                                `/verify ${verificationState.code}`,
                              )
                            }
                          >
                            Copy Command
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600/20 text-xs font-bold text-sky-400">
                        3
                      </span>

                      <div>
                        <p className="text-sm font-medium text-white">
                          Check Status Here
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          After sending the command, click "Check Status" below
                          to verify
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  onPress={checkVerificationStatus}
                  isLoading={verificationState.isChecking}
                  className="w-full bg-green-600 font-semibold text-white"
                  startContent={
                    !verificationState.isChecking && <Search size={16} />
                  }
                >
                  {verificationState.isChecking
                    ? "Checking..."
                    : "Check Status"}
                </Button>

                {verificationState.manualChecks > 0 && (
                  <div className="bg-blue-900/20 rounded-xl border border-blue-500/20 p-3">
                    <div className="flex items-center justify-center gap-2 text-center">
                      <AlertCircle size={16} className="text-blue-400" />

                      <span className="text-sm text-blue-400">
                        Status checked {verificationState.manualChecks} time
                        {verificationState.manualChecks !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="flat" onPress={resetFlow} className="flex-1">
                  Generate New Code
                </Button>

                <Button variant="flat" onPress={onBack} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {verificationState.step === "success" && (
            <div className="space-y-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-600/20">
                <CheckCircle size={32} className="text-green-400" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Telegram Connected!
              </h3>

              <p className="text-gray-200">
                Your Telegram account has been successfully verified and
                connected to your NeoPod profile.
              </p>

              <div className="rounded-xl border border-green-500/20 bg-green-900/20 p-4">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />

                  <span className="text-sm text-green-400">
                    Verification Complete - Refreshing session...
                  </span>
                </div>
              </div>

              <div className="bg-blue-900/20 rounded-xl border border-blue-500/20 p-4">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin text-blue-400" />

                  <span className="text-sm text-blue-400">
                    Updating your account data...
                  </span>
                </div>
              </div>
            </div>
          )}

          {verificationState.step === "error" && (
            <div className="space-y-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-600/20">
                <AlertCircle size={32} className="text-red-400" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Verification Failed
              </h3>

              <p className="text-gray-200">{verificationState.error}</p>

              <Button
                color="primary"
                onPress={resetFlow}
                startContent={<RefreshCw size={16} />}
              >
                Try Again
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 text-yellow-400" />

            <div>
              <h4 className="mb-2 font-medium text-yellow-400">
                Need help connecting?
              </h4>

              <div className="space-y-1 text-sm text-gray-100">
                <p>• Make sure you have Telegram installed and are logged in</p>
                <p>• Only one verification code is valid at a time</p>
                <p>• The verification code expires in 5 minutes</p>
                <p>
                  • Wait for the bot to show "⏳ Verifying..." before clicking
                  "Check Status"
                </p>
                <p>
                  • If verification fails, generate a new code and try again
                </p>
                <p>• You can check status multiple times if needed</p>
                <p>• Contact support if you continue having issues</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="flat" onPress={onBack}>
                  Back to Social Connections
                </Button>

                <Button
                  size="sm"
                  variant="flat"
                  endContent={<ExternalLink size={14} />}
                  onPress={() => window.open(botUrl, "_blank")}
                >
                  Open Bot
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TelegramVerificationFlow;
