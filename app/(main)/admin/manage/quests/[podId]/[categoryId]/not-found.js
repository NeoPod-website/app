import { UndoIcon } from "lucide-react";

import ManageNotFound from "@/components/common/manage/ManageNotFound";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

export const metadata = {
  title: "Categories Not Found | Admin Panel | NeoPod",
  description: "The Categories you're looking for could not be found.",
};

const breadcrumbsList = [
  {
    title: "Manage",
  },

  {
    title: "Categories",
    href: "/admin/manage/categories",
  },

  {
    title: "Not Found",
  },
];

const NotFound = () => {
  return (
    <ManagePageWrapper
      scrollable={false}
      linkLabel="Back to Categories"
      list={breadcrumbsList}
      href="/admin/manage/categories"
      icon={<UndoIcon size={16} className="-mt-0.5" />}
    >
      <ManageNotFound
        backToLabel="Categories"
        title="404 - Not Found"
        backToHref="/admin/manage/categories"
        description="The Category you're looking for could not be found. Select a different Category to continue."
      />
    </ManagePageWrapper>
  );
};

export default NotFound;
