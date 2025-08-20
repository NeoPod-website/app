import React from "react";
import { Suspense } from "react";

import PodProvider from "@/providers/PodProvider";

import MainPageScroll from "@/components/common/MainPageScroll";

import FilterHeader from "@/components/common/filter/FilterHeader";
import FilterPanelLoader from "@/components/ui/loader/filter/FilterPanelLoader";

import WrapperContainer from "@/components/common/WrapperContainer";
import LeaderboardSkeleton from "@/components/ui/loader/leaderboard/LeaderboardSkeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Ambassadors | Admin Panel | NeoPod",
  description:
    "View and manage ambassador profiles, roles, and activity. Empower your community with the right permissions and oversight.",
};

const ManageAmbassadorsPage = async () => {
  return (
    <PodProvider>
      <MainPageScroll scrollable={false}>
        <Suspense>
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
        </Suspense>
      </MainPageScroll>
    </PodProvider>
  );
};

export default ManageAmbassadorsPage;
