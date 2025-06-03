"use client";

import React from "react";

import CategoryItemLoader from "./CategoryItemLoader";
import QuestListLoader from "../quest/QuestListLoader";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

const CategoryContainerLoader = ({
  length = 2,
  compact = false,
  scrollable = false,
}) => {
  return (
    <MainPageScroll scrollable={scrollable}>
      {Array.from({ length }).map((_, index) => (
        <WrapperContainer scrollable={scrollable} key={index}>
          <CategoryItemLoader />
          <QuestListLoader compact={compact} scrollable={scrollable} />
        </WrapperContainer>
      ))}
    </MainPageScroll>
  );
};

export default CategoryContainerLoader;
