import React from "react";

import AdminDetailMainHeader from "./main/AdminDetailMainHeader";

import WrapperContainer from "@/components/common/WrapperContainer";
import AdminDetailDescriptionEditor from "./main/AdminDetailDescriptionEditor";

const AdminDetailMain = () => {
  return (
    <div className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
      <AdminDetailMainHeader />

      <WrapperContainer scrollable className="space-y-2 p-10">
        <AdminDetailDescriptionEditor />
      </WrapperContainer>
    </div>
  );
};

export default AdminDetailMain;
