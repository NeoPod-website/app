import { SendHorizontalIcon } from "lucide-react";

import ManageNotFound from "@/components/common/manage/ManageNotFound";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

export const metadata = {
  title: "PODS Not Found | Admin Panel | NeoPod",
  description: "The PODs you're looking for could not be found.",
};

const breadcrumbsList = [
  {
    title: "Manage",
  },

  {
    title: "PODS",
    href: "/admin/manage/pods",
  },

  {
    title: "Not Found",
  },
];

const NotFound = () => {
  return (
    <ManagePageWrapper
      scrollable={false}
      linkLabel="Create Pod"
      list={breadcrumbsList}
      href="/admin/manage/pods/create"
      icon={<SendHorizontalIcon size={16} className="-mt-0.5" />}
    >
      <ManageNotFound
        title="404 - Not Found"
        description="The PODs you're looking for could not be found."
        backToHref="/admin/manage/pods"
        backToLabel="PODS"
        createHref="/admin/manage/pods/create"
        createLabel="Create POD"
      />
    </ManagePageWrapper>
  );
};

export default NotFound;
