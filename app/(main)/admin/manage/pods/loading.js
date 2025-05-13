import PodContainerWrapper from "@/components/layout/pods/PodContainerWrapper";

const breadcrumbsList = [
  {
    title: "Admin PODS",
    href: "/admin/manage/pods",
  },

  {
    title: "Loading",
    href: "/admin/manage/pods",
  },
];

export default function Loading() {
  const skeletonItems = Array.from({ length: 6 });

  return (
    <PodContainerWrapper list={breadcrumbsList}>
      <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2 lg:grid-cols-3">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="w-full rounded-2.5xl border border-gray-700 bg-black/50"
          >
            <div className="animate-pulse h-24 w-full rounded-t-2.5xl bg-gray-700"></div>

            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div className="animate-pulse h-6 w-32 rounded bg-gray-700"></div>

                <div className="flex items-center gap-2">
                  <div className="animate-pulse h-5 w-16 rounded-full bg-gray-700"></div>
                  <div className="animate-pulse h-5 w-8 rounded-full bg-gray-700"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="animate-pulse h-4 w-full rounded bg-gray-700"></div>
                <div className="animate-pulse h-4 w-3/4 rounded bg-gray-700"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="animate-pulse h-4 w-24 rounded bg-gray-700"></div>
                <div className="animate-pulse h-4 w-24 rounded bg-gray-700"></div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <div className="animate-pulse h-8 w-20 rounded-full bg-gray-700"></div>
                <div className="animate-pulse h-8 w-20 rounded-full bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PodContainerWrapper>
  );
}
