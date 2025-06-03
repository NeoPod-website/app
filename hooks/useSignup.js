// hooks/useSignup.js
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@heroui/react";

import { languages } from "@/data/langData";
import { setUserState } from "@/redux/slice/userSlice";

export const useSignup = (session) => {
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

  // Check if user has valid access to signup page
  const hasValidAccess = session?.user?.email || email || address;

  // Protect signup page - redirect if no valid access
  useEffect(() => {
    if (!hasValidAccess) {
      router.replace("/login");
      return;
    }
  }, [session, email, address, router, hasValidAccess]);

  // Get language name helper
  const getLanguageName = useCallback((code) => {
    return languages.find((lang) => lang.code === code)?.name || code;
  }, []);

  // Handle pod selection change
  const handlePodSelectionChange = useCallback((keys) => {
    setSelectedPod(keys);
  }, []);

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
        setAllPods(pods);

        // Set first pod as default if available
        if (pods.length > 0) {
          setSelectedPod(new Set([pods[0].pod_id]));
        }
      } catch (err) {
        addToast({
          title: "Error loading pods",
          color: "danger",
          description: err.message,
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
          color: "danger",
        });
        return;
      }

      if (!selectedPod.size) {
        addToast({
          title: "Pod selection is required",
          color: "danger",
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
          username: username.trim(),
          pod_id: selectedPodId,
          language: selectedPodData?.language,
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

          localStorage.setItem("neo-token", token);

          router.push("/");
        } else {
          const errorData = await res.json();
          router.push(
            `/error?reason=${errorData.error?.msg || "Backend-signup-failed"}`,
          );
        }
      } catch (err) {
        console.error("Client signup failed:", err);
        router.push("/error?reason=Something-went-wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      username,
      selectedPod,
      allPods,
      login_method,
      email,
      address,
      session,
      dispatch,
      router,
    ],
  );

  return {
    // Access control
    hasValidAccess,

    // Form state
    username,
    setUsername,
    selectedPod,
    allPods,
    isLoadingPods,
    isSubmitting,

    // Handlers
    handlePodSelectionChange,
    handleSignUp,
    getLanguageName,
  };
};
