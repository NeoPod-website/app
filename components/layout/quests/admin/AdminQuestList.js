import React from "react";

import AdminQuestListClient from "./AdminQuestListClient";

const AdminQuestList = ({ quests, category, scrollable = false }) => {
  return (
    <AdminQuestListClient
      quests={quests}
      category={category}
      scrollable={scrollable}
    />
  );
};

export default AdminQuestList;
