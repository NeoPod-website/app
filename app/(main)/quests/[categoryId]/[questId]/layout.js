import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import ShareQuestModal from "@/components/ui/modals/ShareQuestModal";
import SocialModal from "@/components/ui/modals/SocialModal";

const QuestLayout = async ({ children, category, quest, params }) => {
  const { questId } = await params;

  // Basic breadcrumbs
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

      <section className="flex flex-1 gap-4 overflow-hidden">
        {category}
        {quest}
      </section>

      {children}
    </>
  );
};

export default QuestLayout;
