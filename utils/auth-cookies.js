const AUTH_COOKIE_NAME = "app_user_data";
const JWT_COOKIE_NAME = "app_auth_token";

// Max Age is set to 7 days
const MAX_AGE = 60 * 60 * 24 * 7;

export function setAuthCookies(res, token, userData) {
  // Set the JWT token cookie
  res.cookies.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  // Set user data cookie (exclude sensitive info if needed)
  res.cookies.set(AUTH_COOKIE_NAME, JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  return res;
}

export function removeAuthCookies(res) {
  res.cookies.set(JWT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });

  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });

  return res;
}

export function getAuthCookies(req) {
  const cookies = req.cookies;

  return {
    token: cookies.get(JWT_COOKIE_NAME)?.value || null,
    userData: cookies.get(AUTH_COOKIE_NAME)?.value
      ? JSON.parse(cookies.get(AUTH_COOKIE_NAME).value)
      : null,
  };
}
