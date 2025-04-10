import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/passwordless/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          client_id: process.env.AUTH0_CLIENT_ID,
          connection: "email",
          email,
          send: "code",
          authParams: {
            scope: "openid profile email",
            response_type: "token id_token",
            redirect_uri: `${process.env.APP_BASE_URL}/api/auth/callback`,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || "Failed to send OTP" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error starting passwordless flow:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
