import React from "react";

import AdminDetailProperty from "./options/AdminDetailProperty";
import AdminDetailOptionHeader from "./options/properties/AdminDetailOptionHeader";

import WrapperContainer from "@/components/common/WrapperContainer";

const AdminDetailOption = ({ podId, categoryId, quest }) => {
  return (
    <div className="flex max-w-md flex-1 flex-col gap-2 overflow-hidden">
      <AdminDetailOptionHeader />

      <WrapperContainer scrollable className="px-10 py-6">
        <AdminDetailProperty
          podId={podId}
          quest={quest}
          categoryId={categoryId}
        />
      </WrapperContainer>
    </div>
  );
};

export default AdminDetailOption;
