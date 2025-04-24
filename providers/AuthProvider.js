"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAdminView, setUserState } from "@/redux/slice/userSlice";

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

        dispatch(setAdminView(data.user.isAdmin));

        if (data.user.isAdmin) {
          router.replace("/admin/dashboard");
        }

        dispatch(
          setUserState({
            role: data.user.isAdmin ? "admin" : "ambassador",
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { setUserState, setAdminView } from "@/redux/slice/userSlice"; // These actions need to be handled differently in a server context

// async function getServerSession() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("neo-jwt")?.value; // Replace with your actual auth token cookie name

//   if (!token) {
//     redirect("/login");
//   }

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/auth/login/me`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `neo-jwt=${token}`,
//         },
//       },
//     );

//     if (!res.ok) {
//       return null;
//     }

//     const { data } = await res.json();

//     if (!data?.user) {
//       return null;
//     }

//     return {
//       isAdmin: data.user.isAdmin,
//       user: {
//         role: data.user.isAdmin ? "admin" : "ambassador",
//         user: data.user,
//         username: data.user.username,
//         login_method: data.user.login_method,
//         address: data.user.wallet_address,
//         email: data.user.email,
//       },
//     };
//   } catch (error) {
//     console.error("Server-side auth check failed:", error);
//     return null;
//   }
// }

// export default async function AuthProvider({ children }) {
//   const session = await getServerSession();

//   console.log(session);

//   if (!session?.user) {
//     redirect("/login"); // Redirect on the server if not authenticated
//   }

//   // We can't directly dispatch Redux actions in a Server Component.
//   // The state needs to be managed on the client.
//   // You'll likely need to pass the user data down to client components
//   // that need to interact with your Redux store.

//   return <>{children}</>;
// }
