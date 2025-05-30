"use client";

import React from "react";
import QuestItemLoader from "./QuestItemLoader";

const QuestListLoader = ({
  count = 5,
  compact = false,
  scrollable = false,
}) => {
  return (
    <ul
      className={`grid grid-cols-1 gap-8 p-8 ${compact ? "" : "md:grid-cols-2 lg:grid-cols-3"} ${scrollable ? "hide-scroll overflow-auto" : ""}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <QuestItemLoader key={index} />
      ))}
    </ul>
  );
};

export default QuestListLoader;
