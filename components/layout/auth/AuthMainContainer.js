import React from "react";
import Link from "next/link";

const AuthMainContainer = ({
  title,
  children,
  description,
  className = "",
  isAdmin = false,
  margin = "space-y-2",
}) => {
  return (
    <div
      className={`flex h-full max-w-sm flex-col items-center justify-center space-y-12 ${className}`}
    >
      <div className="space-y-2 text-center">
        <h2 className="font-work-sans text-4xl font-medium">{title}</h2>

        <div className="text-gray-300">{description}</div>
      </div>

      <div className={`mx-auto max-w-xs ${margin}`}>
        {children}

        {isAdmin ? (
          <div className="mx-auto w-fit text-sm text-gray-200">
            Login as Ambassador?{" "}
            <Link href="/login" className="text-white underline">
              Click Here
            </Link>
          </div>
        ) : (
          <div className="mx-auto w-fit text-sm text-gray-200">
            Login as Admin?{" "}
            <Link href="/login/admin" className="text-white underline">
              Click Here
            </Link>
          </div>
        )}

        <div className="text-center text-sm text-gray-300">
          By continuing, you agree to NeoPod’s{" "}
          <Link
            href="/terms"
            className="underline transition-colors hover:text-gray-200"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline transition-colors hover:text-gray-200"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default AuthMainContainer;
