import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    const userAgent = request.headers.get("user-agent");
    const forwarded = request.headers.get("x-forwarded-for");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedPort = request.headers.get("x-forwarded-port");
    const forwardedProto = request.headers.get("x-forwarded-proto");

    const secChUa = request.headers.get("sec-ch-ua");
    const secChUaMobile = request.headers.get("sec-ch-ua-mobile");
    const secChUaPlatform = request.headers.get("sec-ch-ua-platform");

    const language = request.headers.get("accept-language");

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth0-Forwarded-For": forwarded,
          "X-Forwarded-For": forwarded,
          "X-Forwarded-Proto": forwardedProto,
          "X-Forwarded-Host": forwardedHost,
          "X-Forwarded-Port": forwardedPort,

          "user-agent": userAgent,
          "sec-ch-ua": secChUa,
          "sec-ch-ua-mobile": secChUaMobile,
          "sec-ch-ua-platform": secChUaPlatform,
          "accept-language": language,
        },

        body: JSON.stringify({
          grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
          client_id: process.env.AUTH0_CLIENT_ID,
          username: email,
          otp,
          realm: "email",
          scope: "openid profile email",
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || "Invalid OTP" },
        { status: response.status },
      );
    }

    // Get cookies instance
    const cookieStore = await cookies();

    // Set cookies or session with the tokens
    // cookieStore.set("auth_token", data.access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: data.expires_in,
    //   path: "/",
    // });

    // You can also decode and store user information
    return NextResponse.json({
      success: true,
      token: data.access_token,
      user: {
        email,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
