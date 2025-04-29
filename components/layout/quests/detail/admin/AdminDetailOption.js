import React from "react";

import AdminDetailProperty from "./options/AdminDetailProperty";
import AdminDetailOptionHeader from "./options/AdminDetailOptionHeader";

import WrapperContainer from "@/components/common/WrapperContainer";

const AdminDetailOption = () => {
  return (
    <div className="flex max-w-md flex-1 flex-col gap-2 overflow-hidden">
      <AdminDetailOptionHeader />

      <WrapperContainer scrollable className="px-10 py-6">
        <AdminDetailProperty />
      </WrapperContainer>
    </div>
  );
};

export default AdminDetailOption;
