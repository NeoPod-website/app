import Link from "next/link";

const errorMessages = {
  "auth/no-token": "You need to sign in to access this page",
  "auth/invalid-token": "Your session has expired, please sign in again",
  "auth/server-error": "Our authentication service is temporarily unavailable",
  "auth/timeout": "Authentication request timed out, please try again",
  "auth/network-error":
    "Unable to connect to our servers, please check your connection",
  "auth/unknown-error": "An unexpected error occurred during authentication",
  default: "Something went wrong",
};

const ErrorPage = ({ errorCode, message, canRetry = true }) => {
  const displayMessage =
    message || errorMessages[errorCode] || errorMessages.default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Authentication Error
        </h1>

        <p className="mb-6 text-gray-600">{displayMessage}</p>

        {canRetry && (
          <div className="space-y-4">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 block w-full rounded-md px-6 py-3 font-medium text-white transition duration-200"
            >
              Sign In
            </Link>

            <Link
              href="/login"
              className="block w-full rounded-md bg-gray-200 px-6 py-3 font-medium text-gray-800 transition duration-200 hover:bg-gray-300"
            >
              Go to Homepage
            </Link>
          </div>
        )}

        {!canRetry && (
          <div className="mt-4 text-sm text-gray-500">
            <p>
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        )}

        {errorCode && (
          <div className="mt-8 text-xs text-gray-400">
            Error code: {errorCode}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
