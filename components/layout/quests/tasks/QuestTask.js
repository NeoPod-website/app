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
        className="rounded-2xl rounded-tl-none border bg-gradient-dark p-5 pt-3"
      >
        <h4 className="font-work-sans text-base font-bold capitalize">
          {heading}
        </h4>

        <p className="mb-2.5 text-sm text-gray-100">{description}</p>

        {children}
      </div>
    </QuestTaskContainer>
  );
};

export default QuestTask;
