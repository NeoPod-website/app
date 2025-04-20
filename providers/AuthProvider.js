"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setUserState } from "@/redux/slice/userSlice";

export default function AuthProvider({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login/me`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const { data } = await res.json();

        if (!data?.user) {
          throw new Error("No user found");
        }

        dispatch(
          setUserState({
            role: data.isAdmin ? "admin" : "ambassador",
            user: data.user,
            username: data.user.username,
            login_method: data.user.login_method,
            address: data.user.wallet_address,
            email: data.user.email,
          }),
        );

        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      }
    };

    if (!user) {
      checkAuth();
    }
  }, [router]);

  return <>{children}</>;
}
