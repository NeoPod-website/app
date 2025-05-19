// userSession.js
import { cookies } from "next/headers";

const requestSessionCache = new Map();

/**
 * Gets the current user session, with caching for performance
 * @returns {Promise<{user: Object|null, isAdmin: boolean, isAuthenticated: boolean, error: string|null, message: string|null}>}
 */

async function getCachedSession() {
  // Get session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("neo-jwt");
  const cacheKey = sessionCookie?.value || "no-session";

  // Return from cache if available
  if (requestSessionCache.has(cacheKey)) {
    return requestSessionCache.get(cacheKey);
  }

  // Default response structure
  const sessionResult = {
    user: null,
    isAdmin: false,
    isAuthenticated: false,
    error: null,
    message: null,
  };

  // Handle no cookie case
  if (!sessionCookie?.value) {
    sessionResult.error = "auth/no-token";
    sessionResult.message = "No authentication token found";
    requestSessionCache.set(cacheKey, sessionResult);
    return sessionResult;
  }

  try {
    // Validate and parse JWT
    const payload = parseAndValidateJwt(sessionCookie.value);

    // Set successful session data
    sessionResult.user = { ...payload.user };
    sessionResult.isAdmin = Boolean(payload.user.isAdmin);
    sessionResult.isAuthenticated = true;
  } catch (error) {
    sessionResult.error = error.code || "auth/unknown-error";
    sessionResult.message = error.message || "An unknown error occurred";
  }

  // Cache the result for this request
  requestSessionCache.set(cacheKey, sessionResult);
  return sessionResult;
}

/**
 * Parses and validates a JWT token
 * @param {string} token - The JWT token to parse
 * @returns {Object} The decoded payload
 * @throws {Error} If token is invalid
 */
function parseAndValidateJwt(token) {
  // Validate token format
  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    const error = new Error("The authentication token is malformed");
    error.code = "auth/malformed-token";

    throw error;
  }

  // Decode payload safely
  let payload;
  try {
    payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
  } catch (e) {
    const error = new Error("Failed to parse authentication token");
    error.code = "auth/token-parse-error";

    throw error;
  }

  // Check token expiration
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < currentTime) {
    const error = new Error("Your session has expired");
    error.code = "auth/expired-token";

    throw error;
  }

  // Validate user data in payload
  if (!payload.user || typeof payload.user !== "object") {
    const error = new Error("Invalid user data in token");
    error.code = "auth/invalid-token-data";

    throw error;
  }

  return payload;
}

export { getCachedSession };
