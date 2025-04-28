import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";
import AdminQuestContainer from "@/components/layout/quests/admin/AdminQuestContainer";

export const metadata = {
  title: "Manage Quests | Admin Panel | NEO POD",
  description:
    "Create, edit, and organize quests for ambassadors. Shape the journey and engagement through meaningful tasks and challenges.",
};

const categories = [
  {
    id: 1,
    title: "Hot Campaigns",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
    description: "This is a description for the category.",
  },
  {
    id: 2,
    title: "Hot Campaigns",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
    description: "This is a description for the category.",
  },
  {
    id: 3,
    title: "Hot Campaigns",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
    description: "This is a description for the category.",
  },
  {
    id: 4,
    title: "Hot Campaigns",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
    description: "This is a description for the category.",
  },
];

const ManageQuestsPage = () => {
  return (
    <MainPageScroll scrollable>
      {categories.map((category) => (
        <AdminQuestContainer key={category.id} category={category} />
      ))}
    </MainPageScroll>
  );
};

export default ManageQuestsPage;
