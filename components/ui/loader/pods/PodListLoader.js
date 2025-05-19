import PodCardLoader from "@/components/ui/loader/pods/PodCardLoader";

const PodListLoader = () => {
  const skeletonItems = Array.from({ length: 9 });

  return (
    <div className="mt-3 grid grid-cols-1 gap-8 pt-4 md:grid-cols-2 lg:grid-cols-3">
      {skeletonItems.map((_, index) => (
        <PodCardLoader key={index} />
      ))}
    </div>
  );
};

export default PodListLoader;
