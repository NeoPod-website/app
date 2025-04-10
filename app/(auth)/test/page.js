import EmailOTPLogin from "./email-otp-login";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            Sign in to your account
          </h1>
        </div>

        <EmailOTPLogin />
      </div>
    </div>
  );
}
