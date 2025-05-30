import React from "react";

import AdminQuestItemLoader from "./AdminQuestItemLoader";

const AdminQuestListLoader = ({ count = 5 }) => {
  return (
    <div className="relative w-full">
      <div className="sticky top-0 z-10 mx-4 my-2 flex items-center justify-between rounded-lg border border-gray-400 bg-gray-700 p-4 shadow-md">
        <div className="h-5 w-80 animate-pulse rounded bg-gray-600"></div>

        <div className="ml-8 flex w-fit items-center gap-2 rounded-lg border border-white bg-gradient-primary px-6 py-2.5">
          <div className="h-5 w-24 animate-pulse rounded bg-white/30"></div>
          <div className="h-4 w-4 animate-pulse rounded bg-white/30"></div>
        </div>
      </div>

      <div className="rounded-b-2.5xl p-8">
        {Array.from({ length: count }, (_, index) => (
          <AdminQuestItemLoader key={index} />
        ))}
      </div>
    </div>
  );
};

export default AdminQuestListLoader;
