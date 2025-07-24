import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";

const AdminLeaderboardLayout = ({ children }) => {
  return <MainPageScroll scrollable={false}>{children}</MainPageScroll>;
};

export default AdminLeaderboardLayout;
