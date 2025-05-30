import React from "react";

const AdminDetailOptionHeaderLoader = () => {
  return (
    <section className="flex gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <div className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gray-700 px-3 py-1">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-600"></div>
        <div className="h-4 w-4 animate-pulse rounded bg-gray-600"></div>
      </div>

      <div className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1">
        <div className="h-4 w-12 animate-pulse rounded bg-gray-600"></div>
        <div className="h-4 w-4 animate-pulse rounded bg-gray-600"></div>
      </div>
    </section>
  );
};

export default AdminDetailOptionHeaderLoader;
