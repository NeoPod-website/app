import React from "react";

import AdminDetailMainHeader from "./main/AdminDetailMainHeader";
import AdminDetailDescriptionContainer from "./main/AdminDetailDescriptionContainer";

import WrapperContainer from "@/components/common/WrapperContainer";

const AdminDetailMain = ({ isNew, podId, categoryId }) => {
  return (
    <form className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
      <AdminDetailMainHeader
        isNew={isNew}
        podId={podId}
        categoryId={categoryId}
      />

      <WrapperContainer scrollable className="space-y-2 p-10">
        <AdminDetailDescriptionContainer
          isNew={isNew}
          name="Your Quest Title"
        />
      </WrapperContainer>
    </form>
  );
};

export default AdminDetailMain;
