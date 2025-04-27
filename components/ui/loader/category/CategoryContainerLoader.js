"use client";

import React from "react";

import CategoryItemLoader from "./CategoryItemLoader";
import QuestListLoader from "../quests/QuestListLoader";

const CategoryContainerLoader = ({ compact = false, scrollable = false }) => {
  return (
    <section
      className={`flex-1 rounded-2.5xl bg-black/50 ${
        scrollable ? "flex flex-col overflow-hidden" : ""
      }`}
    >
      <CategoryItemLoader />
      <QuestListLoader compact={compact} scrollable={scrollable} />
    </section>
  );
};

export default CategoryContainerLoader;
