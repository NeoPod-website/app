import React from "react";

import QuestMainTask from "../tasks/QuestMainTask";
import QuestVisitLink from "../tasks/QuestVisitLink";
import QuestSocialTask from "../tasks/QuestSocialTask";
import QuestNFTTask from "../tasks/onchain/QuestNFTTask";
import QuestTokenTask from "../tasks/onchain/QuestTokenTask";
import QuestFileUploadTask from "../tasks/QuestFileUploadTask";

const QuestDetailsTask = ({ quest }) => {
  console.log("quest", quest.tasks);

  const renderTask = (task) => {
    const { name, id } = task;

    switch (name) {
      case "text":
        return (
          <QuestMainTask
            key={id}
            name="text"
            task={task}
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
            heading={task.instruction}
            description={task.description}
          />
        );

      case "link":
        return <QuestVisitLink key={id} task={task} url={task.url} />;

      case "x":
        // Determine X/Twitter task type
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
            type={getXTaskType()}
          />
        );

      case "telegram":
        return (
          <QuestSocialTask key={id} task={task} type="join" name="telegram" />
        );

      case "discord":
        return (
          <QuestSocialTask key={id} task={task} type="join" name="discord" />
        );

      case "nft":
        return <QuestNFTTask key={id} task={task} />;

      case "token":
        return <QuestTokenTask key={id} task={task} />;

      default:
        return null;
    }
  };

  return quest.tasks?.map(renderTask);
};

export default QuestDetailsTask;
