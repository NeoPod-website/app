import PodListLoader from "@/components/ui/loader/pods/PodListLoader";

import FilterPanelLoader from "@/components/ui/loader/filter/FilterPanelLoader";
import FilterHeaderLoader from "@/components/ui/loader/filter/FilterHeaderLoader";

const Loading = () => {
  return (
    <div className="px-7">
      <FilterHeaderLoader />
      <FilterPanelLoader />
      <PodListLoader />
    </div>
  );
};

export default Loading;
