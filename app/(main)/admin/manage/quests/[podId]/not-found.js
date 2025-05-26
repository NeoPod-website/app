import { SendHorizontalIcon } from "lucide-react";

import ManageNotFound from "@/components/common/manage/ManageNotFound";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

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
      linkLabel="Create POD"
      list={breadcrumbsList}
      href="/admin/manage/pods/create"
      icon={<SendHorizontalIcon size={16} className="-mt-0.5" />}
    >
      <ManageNotFound
        backToLabel="PODS"
        title="404 - Not Found"
        backToHref="/admin/manage/pods"
        description="The POD you're looking for could not be found. Select a different POD to continue."
      />
    </ManagePageWrapper>
  );
};

export default NotFound;
