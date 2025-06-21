import Link from "next/link";
import { SearchXIcon } from "lucide-react";

import MainPageScroll from "@/components/common/MainPageScroll";

export const metadata = {
  title: "Category | Not Found",
  description:
    "The category page you're looking for could not be found. It may have been moved or doesn't exist.",
};

const NotFound = () => {
  const NotFoundContent = () => (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-gray-700 bg-black/30 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-500/30 bg-gray-500/20">
        <SearchXIcon size={32} className="text-gray-400" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-white">404 - Page Not Found</h1>

        <p className="max-w-md text-base text-gray-200">
          The category page you're looking for could not be found. It may have
          been moved or doesn't exist.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/quests"
          className="rounded-full border border-gray-400 bg-black/50 px-6 py-2 text-center text-white transition-colors hover:border-gray-600 hover:bg-black/70"
        >
          Back to Quests
        </Link>

        <Link
          href="/"
          className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-center text-white"
        >
          Go Home
        </Link>
      </div>

      <p className="mt-4 text-sm text-gray-100">
        Need help? Contact support if you believe this is an error.
      </p>
    </div>
  );

  return (
    <MainPageScroll scrollable={false}>
      <NotFoundContent />
    </MainPageScroll>
  );
};

export default NotFound;
