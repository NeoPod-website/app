import React from "react";

import InboxModal from "@/components/ui/modals/InboxModal";

const QuestLayout = ({ children }) => {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <InboxModal />
      {children}
    </div>
  );
};

export default QuestLayout;
