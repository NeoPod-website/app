"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { setUserState } from "@/redux/slice/userSlice";

import AuthMainContainer from "@/components/layout/auth/AuthMainContainer";

const SocialLoginRedirect = ({ session }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const loginToBackend = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login/social`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.tokenSet.accessToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email: session.user.email }),
          },
        );

        const { token, data } = await res.json();

        dispatch(
          setUserState({
            role: data.user.isAdmin ? "admin" : "ambassador",
            user: data.user,
            username: data.user.username,
            login_method: data.user.login_method,
            address: data.user.wallet_address,
            email: session.user.email,
          }),
        );

        localStorage.setItem("neo-jwt", token);
        // localStorage.setItem("user", JSON.stringify(data.user));

        if (res.ok) {
          router.push("/");
        } else {
          router.push(
            `/error?reason=${res.errors.msg || "Backend-signup-failed"}`,
          );
        }
      } catch (err) {
        console.error("Client login failed:", err);
        router.push("/error?reason=Something-went-wrong");
      }
    };

    if (session !== null) {
      loginToBackend();
    }
  }, []);

  return (
    <AuthMainContainer title="Loggin In" description="Loading your account...">
      <div className="flex items-center justify-center">
        <div className="mb-12 h-8 w-8 animate-spinner-ease-spin rounded-full border-b-2 border-t-2 border-white"></div>
      </div>
    </AuthMainContainer>
  );
};

export default SocialLoginRedirect;
