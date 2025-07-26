"use client";

import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";

import { languages } from "@/data/langData";

import { setUserState } from "@/redux/slice/userSlice";

export const useSignup = (session, inviteCode) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const email = useSelector((state) => state.user?.email);
  const address = useSelector((state) => state.user?.address);
  const login_method = useSelector((state) => state.user?.login_method);

  // Component state
  const [username, setUsername] = useState("");
  const [selectedPod, setSelectedPod] = useState(new Set());

  const [allPods, setAllPods] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPods, setIsLoadingPods] = useState(true);

  // Invite code state
  const [hasInviteCode, setHasInviteCode] = useState(!!inviteCode);
  const [enteredInviteCode, setEnteredInviteCode] = useState(inviteCode || "");

  // Inviter info state
  const [inviterInfo, setInviterInfo] = useState(null);
  const [inviterError, setInviterError] = useState(null);
  const [isLoadingInviter, setIsLoadingInviter] = useState(false);

  // Check if user has valid access to signup page
  const hasValidAccess = session?.user?.email || email || address;

  // Protect signup page - redirect if no valid access
  useEffect(() => {
    if (!hasValidAccess) {
      router.replace(`/login${inviteCode ? `?inviteCode=${inviteCode}` : ""}`);
      return;
    }
  }, [session, email, address, router, hasValidAccess]);

  // Initialize invite code if provided via URL
  useEffect(() => {
    if (inviteCode) {
      setHasInviteCode(true);
      setEnteredInviteCode(inviteCode);
    }
  }, [inviteCode]);

  // Get language name helper
  const getLanguageName = useCallback((code) => {
    return languages.find((lang) => lang.code === code)?.name || code;
  }, []);

  // Handle pod selection change
  const handlePodSelectionChange = useCallback((keys) => {
    setSelectedPod(keys);
  }, []);

  // Handle invite code toggle
  const handleInviteCodeToggle = useCallback((isSelected) => {
    setHasInviteCode(isSelected);

    if (!isSelected) {
      setEnteredInviteCode("");
      setInviterInfo(null);
      setInviterError(null);
    }
  }, []);

  // Fetch inviter information
  const fetchInviterInfo = useCallback(async (code) => {
    if (!code || code.length !== 8) return;

    setIsLoadingInviter(true);
    setInviterError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/ambassadors/inviter/${code}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid invite code");
      }

      setInviterInfo(data.data);
    } catch (error) {
      setInviterError(error.message);
      setInviterInfo(null);
    } finally {
      setIsLoadingInviter(false);
    }
  }, []);

  // Handle invite code change
  const handleInviteCodeChange = useCallback(
    (value) => {
      // Filter only alphanumeric characters and convert to uppercase
      const filteredValue = value.toUpperCase().replace(/[^A-Za-z0-9]/g, "");
      setEnteredInviteCode(filteredValue);

      // Reset inviter info when code changes
      setInviterInfo(null);
      setInviterError(null);

      // Fetch inviter info only when code is 8 characters
      if (filteredValue.length === 8) {
        fetchInviterInfo(filteredValue);
      }
    },
    [fetchInviterInfo],
  );

  // Fetch inviter info on component mount if invite code is provided
  useEffect(() => {
    if (inviteCode && inviteCode.length === 8) {
      fetchInviterInfo(inviteCode);
    }
  }, [inviteCode, fetchInviterInfo]);

  // Fetch available pods
  useEffect(() => {
    if (!hasValidAccess) return;

    const fetchPods = async () => {
      setIsLoadingPods(true);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${API_URL}/pods/public`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `Error ${res.status}`);
        }

        const pods = data.data.pods || [];

        // Filter out test pods for production
        const filteredPods = pods.filter((pod) => pod.language !== "test");

        setAllPods(filteredPods);

        // Set first pod as default if available
        if (filteredPods.length > 0) {
          setSelectedPod(new Set([filteredPods[0].pod_id]));
        }
      } catch (err) {
        addToast({
          color: "danger",
          description: err.message,
          title: "Error loading pods",
        });
      } finally {
        setIsLoadingPods(false);
      }
    };

    fetchPods();
  }, [hasValidAccess]);

  // Handle form submission
  const handleSignUp = useCallback(
    async (e) => {
      e.preventDefault();

      if (!username.trim()) {
        addToast({
          title: "Username is required",
          color: "warning",
        });
        return;
      }

      if (!selectedPod.size) {
        addToast({
          title: "Pod selection is required",
          color: "warning",
        });
        return;
      }

      if (username) {
        if (username.includes(" ")) {
          addToast({
            title: "Username cannot contain spaces",
            color: "warning",
          });

          return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          addToast({
            title:
              "Username can only contain letters, numbers, and underscores",
            color: "warning",
          });

          return;
        }
      }

      // Validate invite code if entered
      if (hasInviteCode && enteredInviteCode.length === 8 && inviterError) {
        addToast({
          title: "Invalid invite code",
          description: "Please enter a valid invite code",
          color: "warning",
        });

        return;
      }

      setIsSubmitting(true);

      try {
        const selectedPodId = Array.from(selectedPod)[0];
        const selectedPodData = allPods.find(
          (pod) => pod.pod_id === selectedPodId,
        );

        const loginPayload = {
          login_method,
          pod_id: selectedPodId,
          invite_code: inviteCode,
          username: username.trim(),
          language: selectedPodData?.language,
          invite_code_used:
            hasInviteCode && enteredInviteCode.length === 8
              ? enteredInviteCode.trim().toUpperCase()
              : null,
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
              role: data.user.isAdmin ? "admin" : "ambassador",
              user: data.user,
              username: username.trim(),
              email: loginPayload.email,
              address: loginPayload.address,
              login_method: loginPayload.login_method,
            }),
          );

          localStorage.setItem("neo-jwt", token);

          // Show success message if invite code was used
          if (hasInviteCode && enteredInviteCode.length === 8) {
            addToast({
              title: "Welcome!",
              description: `Account created successfully! Thanks to ${inviterInfo?.username || "your friend"} for the invite.`,
              color: "success",
            });
          }

          router.push("/");
        } else {
          const errorData = await res.json();

          addToast({
            title: "Error",
            description: errorData.error?.msg || "Something went wrong",
            color: "danger",
          });
        }
      } catch (err) {
        addToast({
          title: "Error",
          description: "Something went wrong",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      email,
      router,
      allPods,
      address,
      session,
      dispatch,
      username,
      selectedPod,
      inviterInfo,
      login_method,
      inviterError,
      hasInviteCode,
      enteredInviteCode,
    ],
  );

  return {
    // Access control
    hasValidAccess,

    // Form state
    allPods,
    username,
    setUsername,
    selectedPod,
    isLoadingPods,
    isSubmitting,

    // Invite code state
    hasInviteCode,
    enteredInviteCode,

    // Inviter info state
    inviterInfo,
    inviterError,
    isLoadingInviter,

    // Handlers
    handleSignUp,
    getLanguageName,
    handleInviteCodeToggle,
    handleInviteCodeChange,
    handlePodSelectionChange,
  };
};
