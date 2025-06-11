"use client";

import { addToast } from "@heroui/react";
import React, { useEffect, useState, useCallback } from "react";

const ResendEmailTimer = ({ email, onResend, timeLeft, setTimeLeft }) => {
  const INITIAL_TIME = 60;

  const [loading, setLoading] = useState(false);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/passwordless/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to resend code");
      }

      setTimeLeft(INITIAL_TIME);

      if (onResend) onResend();
    } catch (err) {
      addToast({
        title: err.message || "Failed to resend code",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [email, onResend]);

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <p className="text-gray-300">Didn't Receive the Code?</p>

      <button
        type="button"
        onClick={handleResend}
        disabled={timeLeft > 0 || loading}
        className={`disabled:cursor-not-allowed disabled:text-gray-200 ${
          timeLeft > 0 || loading
            ? "cursor-not-allowed text-gray-200"
            : "text-white"
        }`}
      >
        {loading ? "Sending..." : "Resend Code"}
      </button>

      {timeLeft > 0 && (
        <span className="text-sm text-gray-300">
          in <strong className="text-red-500">{formatTime(timeLeft)}</strong>
        </span>
      )}
    </div>
  );
};

export default ResendEmailTimer;
