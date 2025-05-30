import TwoContainerLoader from "@/components/ui/loader/TwoContainerLoader";
import FilterHeaderLoader from "@/components/ui/loader/filter/FilterHeaderLoader";

const Loading = () => {
  return (
    <div className="flex flex-1 flex-col space-y-5 px-7 pb-5">
      <FilterHeaderLoader />
      <TwoContainerLoader />
    </div>
  );
};

export default Loading;
