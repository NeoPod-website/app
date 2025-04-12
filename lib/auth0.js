import { NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

// import { getAuthCookies, setAuthCookies } from "@/utils/auth-cookies";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email",
  },

  async onCallback(error, context, session) {
    if (error) {
      console.error("❌ Auth0 Error:", error);
      return NextResponse.redirect(
        new URL(`/error?error=${error.message}`, process.env.APP_BASE_URL),
      );
    }

    const email = session?.user?.email;

    if (!email) {
      return NextResponse.redirect(
        new URL("/sign-up", process.env.APP_BASE_URL),
      );
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/email/${email}`,
      );

      if (res.status === 404) {
        return NextResponse.redirect(
          new URL("/sign-up", process.env.APP_BASE_URL),
        );
      }

      const user = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/social`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.tokenSet.accessToken}`,
          },
          body: JSON.stringify({
            email,
          }),
          credentials: "include",
        },
      );

      if (user.status !== 200) {
        console.log(user.status);
        return NextResponse.redirect(
          new URL(
            `/error?error="Something went wrong"`,
            process.env.APP_BASE_URL,
          ),
        );
      }

      const data = await user.json();

      const response = NextResponse.redirect(
        new URL("/", process.env.APP_BASE_URL),
      );

      // Store the JWT and user data in HTTP-only cookies
      // if (data.token && data.data?.user) {
      //   setAuthCookies(response, data.token, data.data.user);
      // }

      return response;
    } catch (err) {
      console.error("❌ API fetch error:", err);
      return NextResponse.redirect(new URL("/error", process.env.APP_BASE_URL));
    }
  },
});
