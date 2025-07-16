"use client";

import React, { useState, useMemo } from "react";

import QuestItem from "./QuestItem";
import { processQuestsAvailability } from "@/utils/questAvailabilityFilter";

const NoQuestsAvailable = ({ showAll, onToggleShowAll }) => (
  <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
    <div className="space-y-1 3xl:space-y-2">
      <p className="text-lg font-bold text-white 3xl:text-xl">
        {showAll ? "No quests in this category" : "No available quests"}
      </p>

      <p className="text-base text-gray-200">
        {showAll
          ? "Check back later for new quests in this category"
          : "All quests are either completed, in cooldown, or don't meet requirements"}
      </p>
    </div>

    {!showAll && (
      <button
        type="button"
        onClick={onToggleShowAll}
        className="rounded-lg border border-gray-400 bg-gray-800/50 px-3 py-1.5 text-sm text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50 3xl:px-4 3xl:py-2"
      >
        Show all quests
      </button>
    )}
  </div>
);

const QuestList = ({
  user,
  categoryId,
  quests = [],
  compact = false,
  scrollable = false,
  completedQuests = [],
  showUnavailable = false,
  questSubmissionsByQuestId = {},
}) => {
  const [showAll, setShowAll] = useState(false);

  // Process quest availability using utility function
  const { availableQuests, unavailableQuests, questStatuses } = useMemo(() => {
    if (!Array.isArray(quests) || quests.length === 0) {
      return { availableQuests: [], unavailableQuests: [], questStatuses: {} };
    }

    return processQuestsAvailability(
      quests,
      questSubmissionsByQuestId,
      user,
      completedQuests,
    );
  }, [quests, questSubmissionsByQuestId, user, completedQuests]);

  // Determine which quests to display
  const displayQuests = showAll ? quests : availableQuests;

  // If no quests at all
  if (!Array.isArray(quests) || quests.length === 0) {
    return <NoQuestsAvailable showAll={true} />;
  }

  // If no available quests but there are quests in the category
  if (availableQuests.length === 0 && !showAll) {
    return (
      <NoQuestsAvailable
        showAll={false}
        onToggleShowAll={() => {
          setShowAll(true);
        }}
      />
    );
  }

  return (
    <>
      {availableQuests.length > 0 && unavailableQuests.length > 0 && (
        <div className="flex items-center justify-between px-5 pt-4 lg:px-6 3xl:px-8">
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-200 3xl:text-sm">
              {availableQuests.length} available, {unavailableQuests.length}{" "}
              unavailable
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="rounded-lg border border-gray-400 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
          >
            {showAll ? "Show available only" : "Show all quests"}
          </button>
        </div>
      )}

      <ul
        className={`grid min-w-80 grid-cols-1 gap-4 p-5 ${
          compact
            ? ""
            : "md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-6 3xl:gap-8 3xl:p-8"
        } ${scrollable ? "hide-scroll overflow-auto" : ""}`}
      >
        {displayQuests.map((quest) => {
          const status = questStatuses[quest.quest_id];

          return (
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
              // Quest limit information
              claimLimit={quest.limit}
              currentClaims={quest.total_submissions || 0}
              // Pass availability status to QuestItem
              isAvailable={status?.available}
              unavailableReason={status?.reason}
              hasCompletedBefore={status?.hasCompletedBefore}
              nextAvailableDate={status?.nextAvailableDate}
              lastSubmissionDate={status?.lastSubmissionDate}
            />
          );
        })}
      </ul>

      {showUnavailable && unavailableQuests.length > 0 && (
        <div className="mx-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          <h4 className="mb-2 text-sm font-medium text-yellow-400">
            Unavailable Quests ({unavailableQuests.length})
          </h4>

          <div className="space-y-1">
            {unavailableQuests.map((quest) => (
              <div key={quest.quest_id} className="text-xs text-yellow-300">
                <span className="font-medium">{quest.name}</span>:{" "}
                {questStatuses[quest.quest_id]?.reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestList;
