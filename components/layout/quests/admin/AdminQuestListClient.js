"use client";

import { addToast, Button } from "@heroui/react";
import { Reorder } from "framer-motion";
import { SaveIcon, TrashIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

import AdminQuestItem from "./AdminQuestItem";

const AdminQuestListClient = ({ quests, scrollable = false }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [questsData, setQuestsData] = useState(quests);
  const [changedQuests, setChangedQuests] = useState({});
  const [originalPositions, setOriginalPositions] = useState({});

  const [selectedQuests, setSelectedQuests] = useState(new Set());

  useEffect(() => {
    const positions = {};

    questsData.forEach((quest) => {
      positions[quest.id] = quest.position;
    });

    setOriginalPositions(positions);
  }, []);

  const handleQuestChange = (questId, field, value) => {
    if (selectedQuests.size > 0) {
      addToast({
        color: "danger",
        title: "Cannot change quest",
        description:
          "You have selected quests. Please deselect before changing.",
      });

      return;
    }

    setQuestsData((prevQuests) =>
      prevQuests.map((quest) =>
        quest.id === questId ? { ...quest, [field]: value } : quest,
      ),
    );

    setChangedQuests((prev) => ({
      ...prev,
      [questId]: {
        ...prev[questId],
        id: questId,
        [field]: value,
      },
    }));

    setHasChanges(true);
  };

  const handleReorder = (newOrder) => {
    if (selectedQuests.size > 0) {
      addToast({
        color: "danger",
        title: "Cannot reorder quests",
        description:
          "You have selected quests. Please deselect before reordering.",
      });

      return;
    }

    const updatedQuests = newOrder.map((quest, index) => ({
      ...quest,
      position: index + 1,
    }));

    setQuestsData(updatedQuests);

    updatedQuests.forEach((quest) => {
      if (quest.position !== originalPositions[quest.id]) {
        setChangedQuests((prev) => ({
          ...prev,
          [quest.id]: {
            ...prev[quest.id],
            id: quest.id,
            position: quest.position,
          },
        }));
        setHasChanges(true);
      }
    });
  };

  // // Save all changes in batch
  // const saveChanges = () => {
  //   if (!hasChanges) return;

  //   const updates = Object.values(changedQuests);
  //   console.log("Batch updates to send:", updates);

  //   // Here you would dispatch to your API or state management

  //   // Update original positions after saving
  //   const newPositions = {};
  //   questsData.forEach((quest) => {
  //     newPositions[quest.id] = quest.position;
  //   });
  //   setOriginalPositions(newPositions);

  //   // Reset changes tracker
  //   setChangedQuests({});
  //   setHasChanges(false);
  // };

  const discardChanges = () => {
    const resetQuests = [...questsData]
      .sort((a, b) => {
        return originalPositions[a.id] - originalPositions[b.id];
      })
      .map((quest) => ({
        ...quest,
        position: originalPositions[quest.id],
      }));

    setQuestsData(resetQuests);
    setChangedQuests({});
    setHasChanges(false);
  };

  const handleSelectQuest = (questId) => {
    if (hasChanges) {
      addToast({
        color: "danger",
        title: "Cannot select quest",
        description:
          "You have unsaved changes. Please save or discard changes before selecting a quest.",
      });

      return;
    }

    setSelectedQuests((prevSelected) => {
      const updated = new Set(prevSelected);

      if (updated.has(questId)) {
        updated.delete(questId);
      } else {
        updated.add(questId);
      }

      return updated;
    });
  };

  const discardSelected = () => {
    setSelectedQuests(new Set());
  };

  return (
    <div className="relative flex flex-col rounded-b-2.5xl">
      {hasChanges && (
        <div className="sticky top-0 z-10 mx-4 my-2 flex items-center justify-between rounded-2.5xl bg-gray-700 p-4 shadow-md">
          <span className="text-sm text-white">
            You have unsaved changes to {Object.keys(changedQuests).length}{" "}
            quest(s)
          </span>

          <div className="flex gap-2">
            <Button
              size="md"
              radius="full"
              onPress={discardChanges}
              className="neo-button border border-red-500 bg-red-500/20"
            >
              Discard
            </Button>

            <Button
              size="md"
              radius="full"
              endContent={<SaveIcon size={16} />}
              className="neo-button border border-white bg-gradient-primary"
            >
              Save Chnages
            </Button>
          </div>
        </div>
      )}

      {selectedQuests.size > 0 && (
        <div className="sticky top-0 z-10 mx-4 my-2 flex items-center justify-between rounded-2.5xl bg-gray-700 p-4 shadow-md">
          <span className="text-sm text-white">
            You have selected {selectedQuests.size} quest(s)
          </span>

          <div className="flex gap-2">
            <Button
              size="md"
              radius="full"
              onPress={discardSelected}
              className="neo-button border border-red-500 bg-red-500/20"
            >
              Discard
            </Button>

            <Button
              size="md"
              radius="full"
              endContent={<TrashIcon size={16} />}
              className="neo-button border border-white bg-gradient-primary"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={questsData}
        onReorder={handleReorder}
        className={`rounded-b-2.5xl border p-8 ${hasChanges || selectedQuests.size > 0 ? "border-red-500" : "border-transparent"} ${scrollable ? "hide-scroll overflow-auto" : ""}`}
      >
        {questsData.map((quest) => (
          <AdminQuestItem
            quest={quest}
            key={quest.id}
            hasChanges={hasChanges}
            selectedQuests={selectedQuests}
            onQuestChange={handleQuestChange}
            onQuestSelect={handleSelectQuest}
          />
        ))}
      </Reorder.Group>
    </div>
  );
};

export default AdminQuestListClient;
