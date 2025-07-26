import React from "react";

import AdminDetailMainHeader from "./main/AdminDetailMainHeader";
import AdminDetailDescriptionContainer from "./main/AdminDetailDescriptionContainer";

import WrapperContainer from "@/components/common/WrapperContainer";

const AdminDetailMain = ({ isNew, podId, categoryId, quest }) => {
  return (
    <form className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
      <AdminDetailMainHeader
        isNew={isNew}
        podId={podId}
        quest={quest}
        categoryId={categoryId}
      />

      <WrapperContainer scrollable className="space-y-2 p-6 3xl:p-10">
        <AdminDetailDescriptionContainer
          isNew={isNew}
          name={quest?.name}
          tasks={quest?.tasks}
          description={quest?.description}
        />
      </WrapperContainer>
    </form>
  );
};

export default AdminDetailMain;
