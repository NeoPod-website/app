import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import HistoryNumberCard from "@/components/layout/ambassadors/history/HistoryNumberCard";
import HistoryItemCardLoader from "@/components/ui/loader/history/HistoryItemCardLoader";

export const metadata = {
  title: "History | NeoPod",
  description:
    "View your quest history, including highlighted, accepted, and rejected quests. Track your overall performance with insights into total submissions, accepted tasks, and rejected quests.",
};

const HistoryLoader = async () => {
  return (
    <div className="flex h-full flex-1 gap-4 overflow-hidden">
      <WrapperContainer scrollable className="flex-[2] space-y-6 p-6 3xl:p-10">
        <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
          History
        </h2>

        <section className="flex flex-1 flex-col space-y-4 overflow-hidden">
          <div className="hidden gap-4 lg:flex">
            <HistoryNumberCard
              count={0}
              isLoading={true}
              color="text-green-500"
              title="Total Approved Task"
              href="/submissions/approved"
            />

            <HistoryNumberCard
              count={0}
              isLoading={true}
              color="text-red-500"
              title="Total Rejected Task"
              href="/submissions/rejected"
            />

            <HistoryNumberCard
              count={0}
              isLoading={true}
              color="text-yellow-500"
              title="Total Highlighted Task"
              href="/submissions/highlighted"
            />
          </div>

          <div className="flex flex-1 flex-col space-y-3 overflow-y-auto scrollbar-hide 3xl:space-y-4">
            {[...Array(8)].map((_, index) => (
              <HistoryItemCardLoader key={index} />
            ))}

            <div className="flex justify-center py-4">
              <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-600" />
            </div>
          </div>
        </section>
      </WrapperContainer>

      <WrapperContainer
        scrollable
        className="max-w-md flex-1 space-y-6 p-6 px-4 3xl:p-10"
      >
        <h2 className="font-work-sans text-3xl font-bold 3xl:text-4xl">
          Highlighted
        </h2>

        <div className="hide-scroll space-y-4 overflow-y-auto">
          {[...Array(8)].map((_, index) => (
            <HistoryItemCardLoader key={index} />
          ))}

          <div className="flex justify-center py-4">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-600" />
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
};

export default HistoryLoader;
