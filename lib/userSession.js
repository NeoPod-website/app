import { cookies } from "next/headers";

const requestSessionCache = new Map();

async function getCachedSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("neo-jwt");

  const cacheKey = sessionCookie?.value || "no-session";

  // Return from cache if available
  if (requestSessionCache.has(cacheKey)) {
    return requestSessionCache.get(cacheKey);
  }

  // Default response structure
  let sessionResult = {
    user: null,
    isAdmin: false,
    isAuthenticated: false,
    error: null,
    message: null,
  };

  // No cookie case
  if (!sessionCookie?.value) {
    sessionResult.error = "auth/no-token";
    sessionResult.message = "No authentication token found";
    requestSessionCache.set(cacheKey, sessionResult);
    return sessionResult;
  }

  try {
    // Split the JWT token and decode the payload
    const tokenParts = sessionCookie.value.split(".");

    if (tokenParts.length !== 3) {
      sessionResult.error = "auth/malformed-token";
      sessionResult.message = "The authentication token is malformed";
      requestSessionCache.set(cacheKey, sessionResult);
      return sessionResult;
    }

    // Decode the base64 payload
    const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      sessionResult.error = "auth/expired-token";
      sessionResult.message = "Your session has expired";
      requestSessionCache.set(cacheKey, sessionResult);
      return sessionResult;
    }

    // Extract user data from payload
    if (!payload.user) {
      sessionResult.error = "auth/invalid-token-data";
      sessionResult.message = "Invalid user data in token";
      requestSessionCache.set(cacheKey, sessionResult);
      return sessionResult;
    }

    // Set successful session data
    sessionResult = {
      user: {
        ...payload.user,
      },
      isAdmin: payload.user.isAdmin,
      isAuthenticated: true,
      error: null,
      message: null,
    };
  } catch (error) {
    console.error("Error parsing session token:", error);
    sessionResult.error = "auth/token-parse-error";
    sessionResult.message = "Failed to parse authentication token";
  }

  // Cache the result for this request
  requestSessionCache.set(cacheKey, sessionResult);
  return sessionResult;
}

export { getCachedSession };
