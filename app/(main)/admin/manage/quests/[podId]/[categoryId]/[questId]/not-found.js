import { UndoIcon } from "lucide-react";

import ManageNotFound from "@/components/common/manage/ManageNotFound";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

export const metadata = {
  title: "Quest Not Found | Admin Panel | NeoPod",
  description: "The Quest you're looking for could not be found.",
};

const breadcrumbsList = [
  {
    title: "Manage",
  },

  {
    title: "Quests",
    href: "/admin/manage/quests",
  },

  {
    title: "Not Found",
  },
];

const NotFound = () => {
  return (
    <ManagePageWrapper
      scrollable={false}
      linkLabel="Back to Quests"
      list={breadcrumbsList}
      href="/admin/manage/quests"
      icon={<UndoIcon size={16} className="-mt-0.5" />}
    >
      <ManageNotFound
        backToLabel="Quests"
        title="404 - Not Found"
        backToHref="/admin/manage/quests"
        description="The Quest you're looking for could not be found. Select a different Quest to continue."
      />
    </ManagePageWrapper>
  );
};

export default NotFound;
