import React from "react";

import PodProvider from "@/providers/PodProvider";
import CategoryContainerLoader from "@/components/ui/loader/category/CategoryContainerLoader";

export const metadata = {
  title: "Admin Quests View | NeoPod",
  description:
    "Create and organize quest categories for better structure and discoverability. Categorize quests to align with different ambassador goals.",
};

const AmbassadorViewQuestPage = async () => {
  return (
    <PodProvider>
      <CategoryContainerLoader compact={false} scrollable={true} />
    </PodProvider>
  );
};

export default AmbassadorViewQuestPage;
