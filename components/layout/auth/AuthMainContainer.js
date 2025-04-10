import React from "react";
import Link from "next/link";

const AuthMainContainer = ({
  title,
  description,
  children,
  margin = "space-y-2",
}) => {
  return (
    <div className="max-w-sm space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-work-sans font-medium">{title}</h2>

        <p className="text-gray-300 ">{description}</p>
      </div>

      <div className={`max-w-xs mx-auto ${margin}`}>
        {children}

        <div className="text-gray-300 text-sm mx-auto w-fit">
          Admin?{" "}
          <Link href="/admin/login" className="underline text-white">
            Click Here
          </Link>
        </div>

        <div className="text-gray-400 text-center text-sm">
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
