import {
  addHighlightedSubmission,
  removeHighlightedSubmission,
  updateHighlightedSubmissions,
  setHighlightedSubmissionsData,
} from "@/redux/slice/questSlice";

export class HighlightActionManager {
  constructor(
    dispatch,
    currentQuest,
    questHighlights,
    highlightedSubmissionsData,
  ) {
    this.dispatch = dispatch;
    this.currentQuest = currentQuest;
    this.questHighlights = questHighlights;
    this.highlightedSubmissionsData = highlightedSubmissionsData;
  }

  async updateQuestHighlights(newHighlightedIds) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quests/${this.currentQuest.quest_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            highlighted_submissions: newHighlightedIds,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to update quest highlights:", error);
      throw new Error(
        `Failed to sync highlights with server: ${error.message}`,
      );
    }
  }

  async addHighlight(submissionId, optimistic = true) {
    // Validation
    if (this.questHighlights.includes(submissionId)) {
      throw new Error("Submission is already highlighted");
    }

    if (this.questHighlights.length >= 3) {
      throw new Error("Maximum of 3 highlights allowed per quest");
    }

    const newHighlightedIds = [...this.questHighlights, submissionId];

    try {
      if (optimistic) {
        // Optimistic update
        this.dispatch(addHighlightedSubmission(submissionId));
      }

      // Sync with API
      await this.updateQuestHighlights(newHighlightedIds);

      if (!optimistic) {
        // Non-optimistic update
        this.dispatch(updateHighlightedSubmissions(newHighlightedIds));
      }

      return { success: true, newHighlightedIds };
    } catch (error) {
      if (optimistic) {
        // Rollback optimistic update
        this.dispatch(removeHighlightedSubmission(submissionId));
      }
      throw error;
    }
  }

  async removeHighlight(submissionId, optimistic = true) {
    // Validation
    if (!this.questHighlights.includes(submissionId)) {
      throw new Error("Submission is not currently highlighted");
    }

    const newHighlightedIds = this.questHighlights.filter(
      (id) => id !== submissionId,
    );

    try {
      if (optimistic) {
        // Optimistic update
        this.dispatch(removeHighlightedSubmission(submissionId));
      }

      // Sync with API
      await this.updateQuestHighlights(newHighlightedIds);

      if (!optimistic) {
        // Non-optimistic update
        this.dispatch(updateHighlightedSubmissions(newHighlightedIds));

        // Also update cache
        const updatedCacheData = this.highlightedSubmissionsData.filter(
          (sub) => sub.submission_id !== submissionId,
        );
        this.dispatch(setHighlightedSubmissionsData(updatedCacheData));
      }

      return { success: true, newHighlightedIds };
    } catch (error) {
      if (optimistic) {
        // Rollback optimistic update
        this.dispatch(addHighlightedSubmission(submissionId));
      }
      throw error;
    }
  }

  async syncHighlights() {
    // Fetch fresh data from API and update Redux
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quests/${this.currentQuest.quest_id}`,
        { credentials: "include" },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch quest: ${response.status}`);
      }

      const questData = await response.json();
      const freshHighlights =
        questData.data?.quest?.highlighted_submissions ||
        questData.quest?.highlighted_submissions ||
        questData.highlighted_submissions ||
        [];

      // Update Redux with fresh data
      this.dispatch(updateHighlightedSubmissions(freshHighlights));

      // Clear cache to force refetch
      this.dispatch(setHighlightedSubmissionsData([]));

      return freshHighlights;
    } catch (error) {
      console.error("Failed to sync highlights:", error);
      throw error;
    }
  }
}

// Hook for using highlight actions
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";

export const useHighlightActions = () => {
  const dispatch = useDispatch();
  const currentQuest = useSelector((state) => state.quest?.currentQuest);
  const questHighlights = useSelector(
    (state) => state.quest?.currentQuest?.highlighted_submissions || [],
  );
  const highlightedSubmissionsData = useSelector(
    (state) => state.quest?.highlightedSubmissionsData || [],
  );

  const highlightManager = useMemo(() => {
    return new HighlightActionManager(
      dispatch,
      currentQuest,
      questHighlights,
      highlightedSubmissionsData,
    );
  }, [dispatch, currentQuest, questHighlights, highlightedSubmissionsData]);

  return highlightManager;
};

// Error recovery utilities
export const createHighlightErrorHandler = (addToast) => {
  return (error, context = "highlight operation") => {
    console.error(`Error in ${context}:`, error);

    let title = "Operation Failed";
    let description = "Please try again.";

    if (error.message.includes("Maximum of 3 highlights")) {
      title = "Highlight Limit Reached";
      description = "You can only highlight up to 3 submissions per quest.";
    } else if (error.message.includes("already highlighted")) {
      title = "Already Highlighted";
      description = "This submission is already highlighted.";
    } else if (error.message.includes("not currently highlighted")) {
      title = "Not Highlighted";
      description = "This submission is not currently highlighted.";
    } else if (error.message.includes("Failed to sync")) {
      title = "Sync Failed";
      description =
        "Could not sync with server. Your changes may not be saved.";
    }

    addToast({
      title,
      description,
      color: "danger",
    });
  };
};
