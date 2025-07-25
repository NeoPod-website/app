import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";

export const metadata = {
  title: "History | NeoPod",
  description:
    "View your quest history, including highlighted, accepted, and rejected quests. Track your overall performance with insights into total submissions, accepted tasks, and rejected quests.",
};

const HistoryLayout = async ({ highlighted, history, taskAmount }) => {
  return (
    <div className="flex h-full flex-1 gap-4 overflow-hidden">
      <WrapperContainer
        scrollable
        className="flex-[2] space-y-6 p-3 md:p-4 lg:p-6 3xl:p-10"
      >
        <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
          History
        </h2>

        <section className="flex flex-1 flex-col space-y-4 overflow-hidden">
          {taskAmount}
          {history}
        </section>
      </WrapperContainer>

      {highlighted}
    </div>
  );
};

export default HistoryLayout;
