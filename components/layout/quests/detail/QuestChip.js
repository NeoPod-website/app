import React from "react";

const QuestChip = ({ icon, text }) => {
  if (!icon || !text) return null;

  return (
    <div className="flex w-fit items-center gap-0.5 rounded-full bg-gray-600 px-1.5 py-0.5">
      {icon}
      <p className="text-xs font-medium text-gray-200">{text}</p>
    </div>
  );
};

const QuestDetailsChip = ({ icon, text }) => {
  if (!icon || !text) return null;

  return (
    <div className="flex w-fit items-center gap-1 rounded-full border-t border-gray-400 bg-gradient-dark px-2.5 py-1">
      {icon}
      <p className="text-xs font-medium text-gray-100">{text}</p>
    </div>
  );
};

export { QuestChip, QuestDetailsChip };
