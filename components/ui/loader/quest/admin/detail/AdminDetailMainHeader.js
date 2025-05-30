import React from "react";

const AdminDetailMainHeaderLoader = () => {
  return (
    <section className="flex items-center justify-between gap-2.5 overflow-hidden rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-gray-600"></div>
        <span className="text-gray-400">/</span>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-600"></div>
        <span className="text-gray-400">/</span>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-600"></div>
        <span className="text-gray-400">/</span>
        <div className="h-4 w-24 animate-pulse rounded bg-gray-600"></div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex w-fit items-center justify-center rounded border border-gray-400 bg-gradient-dark px-3 py-1">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-600"></div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-600"></div>
          <div className="h-4 w-4 animate-pulse rounded bg-gray-600"></div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1">
          <div className="h-4 w-10 animate-pulse rounded bg-gray-600"></div>
          <div className="h-4 w-4 animate-pulse rounded bg-gray-600"></div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded border border-white bg-gradient-primary px-3 py-1">
          <div className="h-4 w-16 animate-pulse rounded bg-white/30"></div>
          <div className="h-4 w-4 animate-pulse rounded bg-white/30"></div>
        </div>
      </div>
    </section>
  );
};

export default AdminDetailMainHeaderLoader;
