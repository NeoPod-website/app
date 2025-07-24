import React from "react";

const AdminTableHeader = () => {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl bg-gray-700/30 p-3 text-xs font-medium text-gray-200 md:p-4 md:text-sm">
      <div className="flex gap-2">
        <div className="flex w-12 flex-shrink-0 items-center justify-start md:w-16">
          Rank
        </div>

        <div className="flex w-40 min-w-0 flex-shrink-0 items-center gap-2 sm:w-60 md:w-80 md:gap-4">
          Ambassador
        </div>

        <div className="flex w-20 flex-shrink-0 items-center justify-center md:w-24">
          Role
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex w-16 flex-shrink-0 items-center justify-end md:w-20">
          Points
        </div>

        <div className="flex w-20 flex-shrink-0 items-center justify-center">
          Change
        </div>

        <div className="flex w-8 flex-shrink-0 items-center justify-center md:w-12">
          Actions
        </div>
      </div>
    </div>
  );
};

export default AdminTableHeader;
