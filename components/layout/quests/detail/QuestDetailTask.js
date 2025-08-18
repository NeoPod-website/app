"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import QuestWalletCheck from "../QuestWalletCheck";

import QuestMainTask from "../tasks/QuestMainTask";
import QuestVisitLink from "../tasks/QuestVisitLink";
import QuestSocialTask from "../tasks/QuestSocialTask";
import QuestInviteTask from "../tasks/QuestInviteTask";
import QuestNFTTask from "../tasks/onchain/QuestNFTTask";
import QuestTokenTask from "../tasks/onchain/QuestTokenTask";
import QuestFileUploadTask from "../tasks/QuestFileUploadTask";

import {
  initializeQuestSubmission,
  initializeQuestSubmissionForEdit,
} from "@/redux/slice/submissionSlice";

// ADD optional props with safe defaults - won't break existing usage
const QuestDetailsTask = ({
  user,
  quest,
  editMode = false,
  existingSubmission = null,
}) => {
  const dispatch = useDispatch();

  // Initialize quest submission when component mounts
  useEffect(() => {
    if (quest?.tasks && quest.quest_id) {
      const taskIds = quest.tasks.map((task) => task.id);

      // ADD this conditional logic - existing flow unchanged
      if (editMode && existingSubmission) {
        // NEW - Only runs when explicitly in edit mode
        dispatch(
          initializeQuestSubmissionForEdit({
            questId: quest.quest_id,
            totalTasks: quest.tasks.length,
            taskIds: taskIds,
            existingAnswers: existingSubmission.submission_data || {},
            submissionId: existingSubmission.submission_id,
          }),
        );
      } else {
        // EXISTING - Unchanged, works exactly as before
        dispatch(
          initializeQuestSubmission({
            questId: quest.quest_id,
            totalTasks: quest.tasks.length,
            taskIds: taskIds,
          }),
        );
      }
    }
  }, [quest?.quest_id, quest?.tasks, editMode, existingSubmission, dispatch]);

  const renderTask = (task) => {
    const { name, id } = task;

    const existingAnswer =
      editMode && existingSubmission?.submission_data?.[id];

    switch (name) {
      case "text":
        return (
          <QuestMainTask
            key={id}
            name="text"
            task={task}
            questId={quest.quest_id}
            heading={task.instruction}
            description={task.description}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "url":
        return (
          <QuestMainTask
            key={id}
            name="url"
            task={task}
            questId={quest.quest_id}
            heading={task.instruction}
            description={task.description}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "number":
        return (
          <QuestMainTask
            key={id}
            task={task}
            name="number"
            questId={quest.quest_id}
            heading={task.instruction}
            description={task.description}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "file-upload":
        return (
          <QuestFileUploadTask
            key={id}
            task={task}
            name="file"
            questId={quest.quest_id}
            heading={task.instruction}
            description={task.description}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "link":
        return (
          <QuestVisitLink
            key={id}
            task={task}
            questId={quest.quest_id}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "invite":
        return (
          <QuestInviteTask
            key={id}
            task={task}
            user={user}
            questId={quest.quest_id}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "x":
        const getXTaskType = () => {
          if (task.twitterTaskType === "follow") return "follow";
          if (task.twitterTaskType === "react") return "react";
          if (task.twitterTaskType === "spaces") return "spaces";
          return "tweet";
        };

        return (
          <QuestSocialTask
            key={id}
            name="x"
            task={task}
            xUser={user.twitter}
            type={getXTaskType()}
            questId={quest.quest_id}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "telegram":
        return (
          <QuestSocialTask
            key={id}
            task={task}
            type="join"
            name="telegram"
            questId={quest.quest_id}
            telegramUser={user.telegram}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "discord":
        return (
          <QuestSocialTask
            key={id}
            task={task}
            type="join"
            name="discord"
            questId={quest.quest_id}
            discordUser={user.discord}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "nft":
        return (
          <QuestNFTTask
            key={id}
            task={task}
            questId={quest.quest_id}
            wallet={user.wallet_address}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      case "token":
        return (
          <QuestTokenTask
            key={id}
            task={task}
            questId={quest.quest_id}
            wallet={user.wallet_address}
            editMode={editMode}
            existingAnswer={existingAnswer}
          />
        );

      default:
        return null;
    }
  };

  return (
    <QuestWalletCheck user={user} quest={quest}>
      {quest.tasks?.map(renderTask)}
    </QuestWalletCheck>
  );
};

export default QuestDetailsTask;
