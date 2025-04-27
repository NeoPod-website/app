import React from "react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import QuestDetails from "@/components/layout/quests/detail/QuestDetails";
import CategoryContainer from "@/components/layout/category/CategoryContainer";

const breadcrumbsList = [
  {
    title: "Quests",
    href: "/quests",
  },
  {
    title: "Hot Campaigns",
    href: `/quests/1`,
  },
  {
    title: "Partners and Community Mixer",
    href: `/quests/1/1`,
  },
];

const category = {
  id: 1,
  title: "Hot Campaigns",
  icon: "/dashboard/category/icon-1.png",
  background: "/dashboard/category/background-2.jpg",
};

const QuestDetailsPage = async ({ params }) => {
  const { categoryId, questId } = await params;

  return (
    <>
      <NeoBreadcrumbs list={breadcrumbsList} />

      <section className="flex flex-1 gap-4 overflow-hidden">
        <CategoryContainer category={category} compact scrollable={true} />

        <QuestDetails />
      </section>
    </>
  );
};

export default QuestDetailsPage;
