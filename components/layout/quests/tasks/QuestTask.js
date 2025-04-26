import React from "react";

const QuestTask = ({ icon, text, color, heading, description, children }) => {
  return (
    <section className="relative">
      <div
        style={{ backgroundColor: color }}
        className="flex w-fit items-center gap-1 rounded-t-lg px-3 py-1 text-xs uppercase"
      >
        {icon} {text}
      </div>

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
    </section>
  );
};

export default QuestTask;
