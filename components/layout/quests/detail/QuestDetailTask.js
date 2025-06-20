"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import QuestMainTask from "../tasks/QuestMainTask";
import QuestVisitLink from "../tasks/QuestVisitLink";
import QuestSocialTask from "../tasks/QuestSocialTask";
import QuestInviteTask from "../tasks/QuestInviteTask";
import QuestNFTTask from "../tasks/onchain/QuestNFTTask";
import QuestTokenTask from "../tasks/onchain/QuestTokenTask";
import QuestFileUploadTask from "../tasks/QuestFileUploadTask";

import { initializeQuestSubmission } from "@/redux/slice/submissionSlice";

const QuestDetailsTask = ({ quest, user }) => {
  const dispatch = useDispatch();
  console.log(quest);

  // Initialize quest submission when component mounts
  useEffect(() => {
    if (quest?.tasks && quest.quest_id) {
      const taskIds = quest.tasks.map((task) => task.id);

      dispatch(
        initializeQuestSubmission({
          questId: quest.quest_id,
          totalTasks: quest.tasks.length,
          taskIds: taskIds,
        }),
      );
    }
  }, [quest?.quest_id, quest?.tasks, dispatch]);

  const renderTask = (task) => {
    const { name, id } = task;

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
          />
        );

      case "link":
        return <QuestVisitLink key={id} task={task} questId={quest.quest_id} />;

      case "invite":
        return (
          <QuestInviteTask
            key={id}
            task={task}
            user={user}
            questId={quest.quest_id}
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
          />
        );

      case "nft":
        return (
          <QuestNFTTask
            key={id}
            task={task}
            questId={quest.quest_id}
            wallet={user.wallet_address}
          />
        );

      case "token":
        return (
          <QuestTokenTask
            key={id}
            task={task}
            questId={quest.quest_id}
            wallet={user.wallet_address}
          />
        );

      default:
        return null;
    }
  };

  return quest.tasks?.map(renderTask);
};

export default QuestDetailsTask;
