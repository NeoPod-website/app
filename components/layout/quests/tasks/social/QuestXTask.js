import React from "react";
import { Button, Link } from "@heroui/react";
import { Settings, ShieldAlertIcon } from "lucide-react";

import XTweetTask from "./x/XTweetTask";
import XReactTask from "./x/XReactTask";
import XFollowTask from "./x/XFollowTask";
import XSpacesTask from "./x/XSpacesTask";

const X_TASK_TYPES = {
  TWEET: "tweet",
  FOLLOW: "follow",
  REACT: "react",
  SPACES: "spaces",
};

const QuestXTask = ({
  task,
  xUser,
  questId,
  taskType,
  editMode = false,
  existingAnswer = null,
}) => {
  const validTaskTypes = Object.values(X_TASK_TYPES);

  // Check if Twitter is connected - xUser is just the username string
  const isTwitterConnected = xUser && xUser.trim() !== "";

  // If Twitter is not connected, show connection warning - match Twitter task style
  if (!isTwitterConnected) {
    return (
      <div className="mb-3 space-y-3">
        <div className="rounded-xl border border-amber-300 bg-amber-900/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
              <ShieldAlertIcon className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-grow">
              <h3 className="text-lg font-bold text-amber-200">
                X Account Not Connected
              </h3>

              <p className="mt-1 text-sm text-amber-300">
                Connect your X (Twitter) account to NeoPod to complete X-based
                quests and verify interactions.
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
                <ShieldAlertIcon className="h-3 w-3" />
                <span>Required for X quest verification</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

          <p className="text-sm text-gray-100">
            Connect X account to participate in X quests and verify your
            interactions.
          </p>
        </div>

        <div className="flex w-full justify-end">
          <Button
            as={Link}
            href="/settings?tab=socials"
            className="border border-white bg-gradient-primary hover:opacity-90"
            endContent={<Settings className="h-4 w-4" />}
          >
            Connect X Account
          </Button>
        </div>
      </div>
    );
  }

  // xUser is already the username string, pass it directly
  const userTwitterHandle = xUser;

  // Route to appropriate component based on task type
  switch (taskType) {
    case X_TASK_TYPES.TWEET:
      return (
        <XTweetTask
          task={task}
          questId={questId}
          userTwitterHandle={userTwitterHandle}
          editMode={editMode}
          existingAnswer={existingAnswer}
        />
      );

    case X_TASK_TYPES.FOLLOW:
      return (
        <XFollowTask
          task={task}
          questId={questId}
          userTwitterHandle={userTwitterHandle}
          editMode={editMode}
          existingAnswer={existingAnswer}
        />
      );

    case X_TASK_TYPES.REACT:
      return (
        <XReactTask
          task={task}
          questId={questId}
          userTwitterHandle={userTwitterHandle}
          editMode={editMode}
          existingAnswer={existingAnswer}
        />
      );

    case X_TASK_TYPES.SPACES:
      return (
        <XSpacesTask
          task={task}
          questId={questId}
          userTwitterHandle={userTwitterHandle}
          editMode={editMode}
          existingAnswer={existingAnswer}
        />
      );

    default:
      return (
        <div className="mb-3 rounded-xl border border-red-700 bg-red-900/20 p-3">
          <p className="text-sm text-red-400">
            Unknown task type: {taskType}.
            <br />
            Valid types are: {validTaskTypes.join(", ")}
          </p>
        </div>
      );
  }
};

export { X_TASK_TYPES };
export default QuestXTask;
