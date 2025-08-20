import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";
import FilterHeader from "@/components/common/filter/FilterHeader";
import WrapperContainer from "@/components/common/WrapperContainer";

import FilterPanelLoader from "@/components/ui/loader/filter/FilterPanelLoader";
import LeaderboardSkeleton from "@/components/ui/loader/leaderboard/LeaderboardSkeleton";

const CategoryLoading = () => {
  return (
    <MainPageScroll scrollable={false}>
      <FilterHeader
        showFilter={false}
        linkLabel="Loading..."
        headerLabel="Ambassadors"
        linkHref="/admin/manage/ambassadors"
      />
      <FilterPanelLoader />

      <WrapperContainer scrollable={true} className="p-6 3xl:p-10">
        <LeaderboardSkeleton />
      </WrapperContainer>
    </MainPageScroll>
  );
};

export default CategoryLoading;
