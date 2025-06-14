import React from "react";

import InboxModal from "@/components/ui/modals/InboxModal";

const QuestLayout = ({ children }) => {
  return (
    <>
      <InboxModal />
      {children}
    </>
  );
};

export default QuestLayout;
