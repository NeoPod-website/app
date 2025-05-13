import Link from "next/link";

import PodContainerWrapper from "@/components/layout/pods/PodContainerWrapper";

const breadcrumbsList = [
  {
    title: "Admin PODS",
    href: "/admin/manage/pods",
  },

  {
    title: "Not Found",
    href: "/admin/manage/pods",
  },
];

export default function NotFound() {
  return (
    <PodContainerWrapper list={breadcrumbsList}>
      <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-black/30 p-8">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          404 - Not Found
        </h2>

        <p className="mb-6 text-center text-gray-300">
          The PODs you're looking for could not be found.
        </p>

        <div className="flex gap-4">
          <Link
            href="/admin/manage/pods"
            className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-white transition-colors hover:bg-white/20"
          >
            Back to PODs
          </Link>

          <Link
            href="/admin/manage/pods/create"
            className="rounded-full border-gray-100 bg-gradient-primary px-6 py-2 text-white hover:border-gray-600"
          >
            Create POD
          </Link>
        </div>
      </div>
    </PodContainerWrapper>
  );
}
