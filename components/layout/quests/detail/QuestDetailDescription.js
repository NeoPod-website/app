import React from "react";

const QuestDetailDescription = ({ description }) => {
  return (
    <div className="space-y-5">
      <h3 className="text-2xl font-bold">Description</h3>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default QuestDetailDescription;
