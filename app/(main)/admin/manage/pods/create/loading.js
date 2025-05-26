import TwoContainerLoader from "@/components/ui/loader/TwoContainerLoader";
import FilterHeaderLoader from "@/components/ui/loader/filter/FilterHeaderLoader";

const Loading = () => {
  return (
    <div className="h-full space-y-5 px-7">
      <FilterHeaderLoader />
      <TwoContainerLoader />
    </div>
  );
};

export default Loading;
