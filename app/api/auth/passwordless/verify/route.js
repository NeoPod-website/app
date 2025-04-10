import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
          client_id: process.env.AUTH0_CLIENT_ID,
          username: email,
          otp,
          realm: "email",
          scope: "openid profile email",
          client_secret: process.env.AUTH0_CLIENT_SECRET,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || "Invalid OTP" },
        { status: response.status }
      );
    }

    // Set cookies or session with the tokens
    const cookieStore = cookies();

    cookieStore.set("auth_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
      path: "/",
    });

    // You can also decode and store user information
    return NextResponse.json({
      success: true,
      user: {
        email,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
