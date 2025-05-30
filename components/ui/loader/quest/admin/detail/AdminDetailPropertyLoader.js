import React from "react";

const PropertyFieldLoader = ({ width = "w-32" }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-12">
        <div className="flex w-32 items-center gap-3 text-gray-100">
          <div className="h-5 w-5 animate-pulse rounded bg-gray-600"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-600"></div>
        </div>

        <div
          className={`h-8 ${width} animate-pulse rounded border border-gray-400 bg-gray-700`}
        ></div>
      </div>
    </div>
  );
};

const AdminDetailPropertyLoader = () => {
  return (
    <section className="hide-scroll space-y-8 overflow-auto">
      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Category</h3>
        <PropertyFieldLoader width="w-40" />
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Properties</h3>

        <div className="space-y-6">
          <PropertyFieldLoader />
          <PropertyFieldLoader />
          <PropertyFieldLoader />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Additional Properties</h3>

        <div className="space-y-4">
          <PropertyFieldLoader />
          <PropertyFieldLoader />
          <PropertyFieldLoader />
          <PropertyFieldLoader />
        </div>
      </section>
    </section>
  );
};

export default AdminDetailPropertyLoader;
