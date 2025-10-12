// app/dashboard/loading.tsx
import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

const DashboardLoading = () => {
  return (
    <MainPageScroll scrollable={true}>
      <WrapperContainer scrollable={false}>
        <div className="h-48 w-full animate-pulse rounded-t-2xl bg-gradient-to-r from-gray-800 to-gray-700" />

        <ul className="grid min-w-80 grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-6 3xl:gap-8 3xl:p-8">
          {[...Array(9)].map((_, i) => (
            <li
              key={i}
              className="relative flex animate-pulse items-center justify-between gap-4 rounded-2.5xl border-t border-gray-700 bg-gray-800/60 px-4 py-3 3xl:gap-6 3xl:px-5 3xl:py-4"
            >
              <div className="flex-1 space-y-3">
                <div className="h-5 w-32 rounded bg-gray-700" />
                <div className="h-10 w-20 rounded bg-gray-600" />
                <div className="h-4 w-24 rounded bg-gray-700" />
              </div>
            </li>
          ))}
        </ul>
      </WrapperContainer>
    </MainPageScroll>
  );
};

export default DashboardLoading;
