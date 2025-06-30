// Fixed frontend data fetching with better error handling and fallbacks

/**
 * Fetch user submissions for specific quests only
 * Uses your new POST /api/submissions/filter-for-quests endpoint
 */
export async function fetchUserQuestSubmissions(questIds, token) {
  try {
    // Early return for empty quest IDs
    if (!questIds || !Array.isArray(questIds) || questIds.length === 0) {
      console.log("No quest IDs provided, returning empty submissions");
      return {};
    }

    // Validate token
    if (!token) {
      console.error("No authentication token provided");
      return {};
    }

    console.log(
      `Fetching submissions for ${questIds.length} quests:`,
      questIds,
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/submissions/filter-for-quests`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ questIds }),
      },
    );

    // Check if response is ok
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);

      // Try to get error message from response
      try {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        console.error(
          "Failed to fetch quest submissions:",
          errorData.message || "Unknown error",
        );
      } catch (parseError) {
        console.error("Could not parse error response");
      }

      return {}; // Return empty object instead of throwing
    }

    const data = await response.json();
    console.log("Received response data:", data);

    // Validate response structure
    if (!data || data.status !== "success") {
      console.error("Invalid response structure:", data);
      return {};
    }

    // Extract submissions with fallback
    const submissions = data.data?.submissions || {};
    console.log("Extracted submissions:", submissions);

    return submissions;
  } catch (error) {
    console.error("Error fetching quest submissions:", error);

    // Always return empty object to prevent breaking the app
    return {};
  }
}

/**
 * Get completed quest IDs from grouped submissions
 * Only consider approved submissions as completed
 */
export function getCompletedQuestIds(questSubmissionsByQuestId) {
  try {
    // Handle empty or invalid input
    if (
      !questSubmissionsByQuestId ||
      typeof questSubmissionsByQuestId !== "object"
    ) {
      console.log("No submission data provided for completed quests check");
      return [];
    }

    const completedQuests = [];

    Object.entries(questSubmissionsByQuestId).forEach(
      ([questId, submissions]) => {
        // Validate submissions array
        if (!Array.isArray(submissions)) {
          console.warn(
            `Invalid submissions data for quest ${questId}:`,
            submissions,
          );
          return;
        }

        const hasApprovedSubmission = submissions.some(
          (sub) => sub && sub.review_status === "approved",
        );

        if (hasApprovedSubmission) {
          completedQuests.push(questId);
        }
      },
    );

    console.log(
      `Found ${completedQuests.length} completed quests:`,
      completedQuests,
    );
    return completedQuests;
  } catch (error) {
    console.error("Error processing completed quest IDs:", error);
    return [];
  }
}

/**
 * Main data fetching function for quest availability
 * Simplified since quest limits are now tracked in quest.total_submissions
 */
export async function fetchQuestAvailabilityData(quests, token) {
  try {
    // Validate input
    if (!Array.isArray(quests) || quests.length === 0) {
      console.log("No quests provided for availability data fetch");
      return {
        questSubmissionsByQuestId: {},
      };
    }

    if (!token) {
      console.error("No token provided for quest availability data fetch");
      return {
        questSubmissionsByQuestId: {},
      };
    }

    console.log(`Fetching availability data for ${quests.length} quests`);

    // Extract quest IDs with validation
    const questIds = quests
      .filter((q) => q && q.quest_id) // Filter out invalid quests
      .map((q) => q.quest_id);

    if (questIds.length === 0) {
      console.warn("No valid quest IDs found in quests array");
      return {
        questSubmissionsByQuestId: {},
      };
    }

    console.log("Valid quest IDs:", questIds);

    // Fetch user submissions with fallback
    const questSubmissionsByQuestId = await fetchUserQuestSubmissions(
      questIds,
      token,
    );

    console.log("Final availability data:", { questSubmissionsByQuestId });

    return {
      questSubmissionsByQuestId: questSubmissionsByQuestId || {},
    };
  } catch (error) {
    console.error("Error fetching quest availability data:", error);

    // Always return valid structure
    return {
      questSubmissionsByQuestId: {},
    };
  }
}
