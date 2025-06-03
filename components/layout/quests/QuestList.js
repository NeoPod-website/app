import React from "react";

import QuestItem from "./QuestItem";

const NoQuestsAvailable = () => (
  <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
    <div className="space-y-2">
      <p className="text-xl font-bold text-white">No quests available</p>

      <p className="text-base text-gray-200">
        Check back later for new quests in this category
      </p>
    </div>
  </div>
);

const QuestList = ({
  categoryId,
  quests = [],
  compact = false,
  scrollable = false,
}) => {
  if (!Array.isArray(quests) || quests.length === 0) {
    return <NoQuestsAvailable />;
  }

  return (
    <ul
      className={`grid min-w-80 grid-cols-1 gap-8 p-8 ${compact ? "" : "md:grid-cols-2 lg:grid-cols-3"} ${scrollable ? "hide-scroll overflow-auto" : ""}`}
    >
      {quests.map((quest) => (
        <QuestItem
          title={quest.name}
          id={quest.quest_id}
          key={quest.quest_id}
          categoryId={categoryId}
          due_date={quest.due_date}
          tasks={quest.tasks || []}
          cooldown={quest.cooldown}
          points={quest.points || 0}
          recurrence={quest.recurrence}
          rewards={quest.rewards || "No rewards specified"}
        />
      ))}
    </ul>
  );
};

export default QuestList;
