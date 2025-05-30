import React from "react";
import Link from "next/link";

const AuthMainContainer = ({
  title,
  children,
  description,
  isAdmin = false,
  margin = "space-y-2",
}) => {
  console.log(isAdmin);

  return (
    <div className="flex h-full max-w-sm flex-col items-center justify-center space-y-12">
      <div className="space-y-2 text-center">
        <h2 className="font-work-sans text-4xl font-medium">{title}</h2>

        <p className="text-gray-300">{description}</p>
      </div>

      <div className={`mx-auto max-w-xs ${margin}`}>
        {children}

        {isAdmin ? (
          <div className="mx-auto w-fit text-sm text-gray-300">
            Ambassador?{" "}
            <Link href="/login" className="text-white underline">
              Click Here
            </Link>
          </div>
        ) : (
          <div className="mx-auto w-fit text-sm text-gray-300">
            Admin?{" "}
            <Link href="/login/admin" className="text-white underline">
              Click Here
            </Link>
          </div>
        )}

        <div className="text-center text-sm text-gray-400">
          By continuing, you agree to NeoPod’s{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default AuthMainContainer;
