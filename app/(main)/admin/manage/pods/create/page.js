import React from "react";
import Link from "next/link";
import { Undo2Icon } from "lucide-react";

import { getCachedSession } from "@/lib/userSession";

import AdminPodMain from "@/components/layout/pods/manage/AdminPodsMain";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

const breadcrumbsList = [
  {
    title: "Manage",
  },

  {
    title: "Pods",
    href: "/admin/manage/pods",
  },

  {
    title: "Create",
    href: "/admin/manage/pods/create",
  },
];

export const metadata = {
  title: "Create POD | Admin Panel | NeoPod",
  description:
    "Create a new POD for ambassadors and admins to manage and engage with them.",
};

const CreatePodPage = async () => {
  const { user } = await getCachedSession();

  return (
    <ManagePageWrapper
      linkLabel="Go Back"
      scrollable={false}
      list={breadcrumbsList}
      href="/admin/manage/pods"
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      {user.role_type === "super" ? (
        <AdminPodMain isNew={true} />
      ) : (
        <div className="mt-8 flex h-full flex-col items-center justify-center rounded-xl border border-red-500/40 bg-red-500/5 p-8">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            You are not Super Admin
          </h2>

          <p className="mb-6 text-center text-red-300">
            You do not have permission to create a new pod.
          </p>

          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="rounded-full border border-white/20 bg-white/10 !px-6 !py-2 text-white transition-colors hover:bg-white/20"
            >
              Visit Home
            </Link>

            <Link
              href="/admin/manage/pods"
              className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-white hover:border-gray-600"
            >
              Go Back
            </Link>
          </div>
        </div>
      )}
    </ManagePageWrapper>
  );
};

export default CreatePodPage;
