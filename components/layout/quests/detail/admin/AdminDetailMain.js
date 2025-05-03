import React from "react";

import AdminDetailMainHeader from "./main/AdminDetailMainHeader";
import AdminDetailDescriptionContainer from "./main/AdminDetailDescriptionContainer";

import WrapperContainer from "@/components/common/WrapperContainer";

const AdminDetailMain = () => {
  return (
    <div className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
      <AdminDetailMainHeader />

      <WrapperContainer scrollable className="space-y-2 p-10">
        <AdminDetailDescriptionContainer
          title="Share about NEO POD Ambassador Program"
          tasks={[
            {
              name: "url",
            },
          ]}
        />
      </WrapperContainer>
    </div>
  );
};

export default AdminDetailMain;
