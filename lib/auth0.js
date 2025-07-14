// import { NextResponse } from "next/server";
// import { Auth0Client } from "@auth0/nextjs-auth0/server";

// export const auth0 = new Auth0Client({
//   authorizationParameters: {
//     scope: process.env.AUTH0_SCOPE,
//     audience: process.env.AUTH0_AUDIENCE,
//   },

//   async onCallback(error, context, session) {
//     console.log("Auth0 callback:", { error, context, session });
//     if (error) {
//       console.error("❌ Auth0 Error:", error);
//       return NextResponse.redirect(
//         new URL(`/error?error=${error.message}`, process.env.APP_BASE_URL),
//       );
//     }

//     const email = session?.user?.email;

//     if (!email) {
//       return NextResponse.redirect(
//         new URL("/sign-up", process.env.APP_BASE_URL),
//       );
//     }

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/email/${email}`,
//       );

//       if (res.status === 404) {
//         return NextResponse.redirect(
//           new URL("/sign-up", process.env.APP_BASE_URL),
//         );
//       }

//       const response = NextResponse.redirect(
//         new URL("/post-auth-redirect", process.env.APP_BASE_URL),
//       );

//       return response;
//     } catch (err) {
//       console.error("❌ API fetch error:", err);
//       return NextResponse.redirect(new URL("/error", process.env.APP_BASE_URL));
//     }
//   },
// });

import { NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },

  async onCallback(error, context, session) {
    console.log("Auth0 callback:", { error, context, session });
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

      const response = NextResponse.redirect(
        new URL("/post-auth-redirect", process.env.APP_BASE_URL),
      );

      return response;
    } catch (err) {
      console.error("❌ API fetch error:", err);
      return NextResponse.redirect(new URL("/error", process.env.APP_BASE_URL));
    }
  },
});
