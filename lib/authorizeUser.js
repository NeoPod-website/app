// import { cookies } from "next/headers";

// async function getServerSession() {
//   const cookieStore = await cookies();

//   const token = cookieStore.get("neo-jwt")?.value;

//   if (!token) {
//     return { user: null, error: null };
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
//       return {
//         user: null,
//         error: `Authentication-failed-with-status: ${res.status}`,
//       };
//     }

//     const { data } = await res.json();

//     if (!data?.user) {
//       return { user: null, error: "No-user-data-received-from-the-server." };
//     }

//     return {
//       isAdmin: data.user.isAdmin,
//       user: {
//         ...data.user,
//         role: data.user.isAdmin ? "admin" : "ambassador",
//         error: null,
//       },
//     };
//   } catch (error) {
//     console.error("Server-side-auth-check-failed:", error);

//     return {
//       user: null,
//       error: "Failed-to-connect-to-the-server.",
//     };
//   }
// }

// export { getServerSession };

import { cookies } from "next/headers";

async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt")?.value;

  // No token case
  if (!token) {
    return {
      user: null,
      error: "auth/no-token",
      message: "No authentication token found",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login/me`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `neo-jwt=${token}`,
        },
        // Adding timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      },
    );

    // Network or server error responses
    if (!res.ok) {
      const statusCode = res.status;

      // Handle specific status codes
      if (statusCode === 401 || statusCode === 403) {
        return {
          user: null,
          error: "auth/invalid-token",
          message: "Your session has expired or is invalid",
        };
      } else if (statusCode >= 500) {
        return {
          user: null,
          error: "auth/server-error",
          message: "Authentication server error",
          details: `Status code: ${statusCode}`,
        };
      } else {
        return {
          user: null,
          error: "auth/request-failed",
          message: "Authentication request failed",
          details: `Status code: ${statusCode}`,
        };
      }
    }

    const response = await res.json();
    const { data, error: apiError } = response;

    // API returned an error in the response body
    if (apiError) {
      return {
        user: null,
        error: "auth/api-error",
        message: apiError.message || "Error from authentication API",
        details: apiError,
      };
    }

    // No user data in the response
    if (!data?.user) {
      return {
        user: null,
        error: "auth/no-user-data",
        message: "No user data received from the server",
      };
    }

    // Success case
    return {
      user: {
        ...data.user,
      },
      isAdmin: data.user.isAdmin,
      error: null,
    };
  } catch (error) {
    console.error("Server-side auth check failed:", error);

    // Categorize errors
    if (error.name === "AbortError") {
      return {
        user: null,
        error: "auth/timeout",
        message: "Authentication request timed out",
      };
    } else if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        user: null,
        error: "auth/network-error",
        message: "Failed to connect to authentication server",
      };
    }

    // Generic error fallback
    return {
      user: null,
      error: "auth/unknown-error",
      message: "An unexpected error occurred during authentication",
      details: error.message,
    };
  }
}

export { getServerSession };
