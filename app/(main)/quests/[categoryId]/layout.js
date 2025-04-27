import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";

const QuestPageLayout = ({ children }) => {
  return <MainPageScroll scrollable={false}>{children}</MainPageScroll>;
};

export default QuestPageLayout;
