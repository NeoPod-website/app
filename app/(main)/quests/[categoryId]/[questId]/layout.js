import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import SocialModal from "@/components/ui/modals/SocialModal";
import ShareQuestModal from "@/components/ui/modals/ShareQuestModal";

export const metadata = {
  title: "Quest Details | NeoPod",
  description:
    "Dive deep into this quest's challenges, complete tasks, and submit your progress to earn rewards and achievements in the NeoPod community.",
};

const QuestLayout = async ({ children, category, quest, params }) => {
  const { questId } = await params;

  const breadcrumbsList = [
    {
      title: "Quests",
      href: "/quests",
    },
    {
      title: "Quest Details",
      href: `/quests/${questId}`,
    },
  ];

  return (
    <>
      <ShareQuestModal />
      <SocialModal />

      <NeoBreadcrumbs list={breadcrumbsList} />

      <form className="flex flex-1 gap-4 overflow-hidden">
        {category}
        {quest}
      </form>
    </>
  );
};

export default QuestLayout;
