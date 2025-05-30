"use client";

import { Reorder } from "framer-motion";
import { addToast, Button } from "@heroui/react";
import { SaveIcon, TrashIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

import AdminQuestItem from "./AdminQuestItem";

import CreateNewQuest from "@/components/ui/buttons/quest/admin/CreateNewQuest";

const AdminQuestListClient = ({ quests, category, scrollable = false }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [questsData, setQuestsData] = useState(quests);
  const [changedQuests, setChangedQuests] = useState({});
  const [originalPositions, setOriginalPositions] = useState({});

  const [selectedQuests, setSelectedQuests] = useState(new Set());

  useEffect(() => {
    const positions = {};

    questsData.forEach((quest) => {
      positions[quest.quest_id] = quest.display_order;
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
        quest.quest_id === questId ? { ...quest, [field]: value } : quest,
      ),
    );

    setChangedQuests((prev) => ({
      ...prev,
      [questId]: {
        ...prev[questId],
        quest_id: questId,
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
      display_order: index + 1,
    }));

    setQuestsData(updatedQuests);

    updatedQuests.forEach((quest) => {
      if (quest.display_order !== originalPositions[quest.quest_id]) {
        setChangedQuests((prev) => ({
          ...prev,
          [quest.quest_id]: {
            ...prev[quest.quest_id],
            quest_id: quest.quest_id,
            display_order: quest.display_order,
          },
        }));
        setHasChanges(true);
      }
    });
  };

  const handleSaveChange = async () => {
    if (!hasChanges) return;

    const updates = Object.values(changedQuests);

    try {
      // Make PATCH request to update quests in backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quests/batch`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quests: updates }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Batch update successful:", result);

      // Update original positions after successful save
      const newPositions = {};

      questsData.forEach((quest) => {
        newPositions[quest.quest_id] = quest.display_order;
      });
      setOriginalPositions(newPositions);

      // Reset changes tracker
      setChangedQuests({});
      setHasChanges(false);

      // Show success toast
      addToast({
        color: "success",
        title: "Changes saved",
        description: `Successfully updated ${updates.length} quest(s)`,
      });
    } catch (error) {
      console.error("Error saving changes:", error);

      // Show error toast
      addToast({
        color: "danger",
        title: "Save failed",
        description: "Failed to save changes. Please try again.",
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedQuests.size === 0) return;

    const questIds = Array.from(selectedQuests);

    try {
      // Make DELETE request to delete selected quests
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quests/batch`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quest_ids: questIds }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Batch delete successful:", result);

      // Remove deleted quests from local state
      setQuestsData((prevQuests) =>
        prevQuests.filter((quest) => !selectedQuests.has(quest.quest_id)),
      );

      // Clear selected quests
      setSelectedQuests(new Set());

      // Remove any pending changes for deleted quests
      setChangedQuests((prev) => {
        const updated = { ...prev };
        questIds.forEach((questId) => {
          delete updated[questId];
        });
        return updated;
      });

      // Update original positions for remaining quests
      const remainingQuests = questsData.filter(
        (quest) => !selectedQuests.has(quest.quest_id),
      );

      const newPositions = {};

      remainingQuests.forEach((quest) => {
        newPositions[quest.quest_id] = quest.display_order;
      });

      setOriginalPositions(newPositions);

      // Check if there are still changes after deletion
      if (Object.keys(changedQuests).length === 0) {
        setHasChanges(false);
      }

      // Show success toast
      addToast({
        color: "success",
        title: "Quests deleted",
        description: `Successfully deleted ${questIds.length} quest(s)`,
      });
    } catch (error) {
      // Show error toast
      addToast({
        color: "danger",
        title: "Delete failed",
        description: "Failed to delete selected quests. Please try again.",
      });
    }
  };

  const discardChanges = () => {
    const resetQuests = [...questsData]
      .sort((a, b) => {
        return originalPositions[a.id] - originalPositions[b.id];
      })
      .map((quest) => ({
        ...quest,
        display_order: originalPositions[quest.quest_id],
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
      {!hasChanges && selectedQuests.size === 0 && (
        <div className="sticky top-0 z-10 mx-4 my-2 flex items-center justify-between rounded-lg border border-gray-400 bg-gray-700 p-4 shadow-md">
          <p className="text-sm text-white">
            Ready to expand the{" "}
            <span className="font-semibold">{category.name}</span> category? Add
            a new quest.
          </p>

          <CreateNewQuest category={category} />
        </div>
      )}

      {hasChanges && (
        <div className="sticky top-0 z-10 mx-4 my-2 flex items-center justify-between rounded-lg border border-gray-400 bg-gray-700 p-4 shadow-md">
          <p className="text-sm text-white">
            You have unsaved changes to {Object.keys(changedQuests).length}{" "}
            quest(s)
          </p>

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
              onPress={handleSaveChange}
              endContent={<SaveIcon size={16} />}
              className="neo-button border border-white bg-gradient-primary"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {selectedQuests.size > 0 && (
        <div className="sticky top-0 z-10 mx-4 my-2 flex items-center justify-between rounded-lg border border-gray-400 bg-gray-700 p-4 shadow-md">
          <p className="text-sm text-white">
            You have selected {selectedQuests.size} quest(s)
          </p>

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
              onPress={handleDeleteSelected}
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
            category={category}
            key={quest.quest_id}
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
