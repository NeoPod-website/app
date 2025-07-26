import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";

import AdminDetailMainHeaderLoader from "@/components/ui/loader/quest/admin/detail/AdminDetailMainHeader";
import AdminDetailPropertyLoader from "@/components/ui/loader/quest/admin/detail/AdminDetailPropertyLoader";
import AdminDetailOptionHeaderLoader from "@/components/ui/loader/quest/admin/detail/AdminDetailOptionHeaderLoader";
import AdminDetailDescriptionContainerLoader from "@/components/ui/loader/quest/admin/detail/AdminDetailContainerLoader";

const QuestDetailsLoading = () => {
  return (
    <div className="flex h-full flex-1 gap-4 px-7 pb-5">
      <div className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
        <AdminDetailMainHeaderLoader />

        <WrapperContainer scrollable className="space-y-2 p-6 3xl:p-10">
          <AdminDetailDescriptionContainerLoader />
        </WrapperContainer>
      </div>

      <div className="flex max-w-md flex-1 flex-col gap-2 overflow-hidden">
        <AdminDetailOptionHeaderLoader />

        <WrapperContainer scrollable className="px-10 py-6">
          <AdminDetailPropertyLoader />
        </WrapperContainer>
      </div>
    </div>
  );
};

export default QuestDetailsLoading;
