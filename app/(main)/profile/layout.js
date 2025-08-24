import React from "react";

import InboxModal from "@/components/ui/modals/InboxModal";

const ProfileLayout = ({ children }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <InboxModal />
      {children}
    </div>
  );
};

export default ProfileLayout;
