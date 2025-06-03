import React from "react";

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

const QuestXTask = ({ task, taskType }) => {
  const validTaskTypes = Object.values(X_TASK_TYPES);

  if (!validTaskTypes.includes(taskType)) {
    console.warn(
      `Invalid task type: ${taskType}. Valid types are: ${validTaskTypes.join(", ")}`,
    );
  }

  // console.log("QuestXTask - taskType:", taskType);
  // console.log("QuestXTask - task:", task);

  // Route to appropriate component based on task type
  switch (taskType) {
    case X_TASK_TYPES.TWEET:
      return <XTweetTask task={task} />;

    case X_TASK_TYPES.FOLLOW:
      return <XFollowTask task={task} />;

    case X_TASK_TYPES.REACT:
      return <XReactTask task={task} />;

    case X_TASK_TYPES.SPACES:
      return <XSpacesTask task={task} />;

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
