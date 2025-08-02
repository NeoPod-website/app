import React from "react";

import QuestTaskContainer from "./QuestTaskContainer";

const QuestTask = ({
  icon,
  text,
  color,
  heading,
  isAdmin,
  children,
  description,
}) => {
  return (
    <QuestTaskContainer icon={icon} text={text} color={color} isAdmin={isAdmin}>
      <div
        style={{ borderColor: color }}
        className="rounded-2xl rounded-tl-none border bg-gradient-dark p-3 pt-1.5 xl:p-5 xl:pt-3"
      >
        <h4 className="font-work-sans text-sm font-bold capitalize xl:text-base">
          {heading}
        </h4>

        <p className="mb-1.5 text-sm text-gray-100 xl:mb-2.5">{description}</p>

        {children}
      </div>
    </QuestTaskContainer>
  );
};

export default QuestTask;
