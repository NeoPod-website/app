import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import CategoryContainer from "@/components/layout/category/CategoryContainer";

export const metadata = {
  title: "Quest Details | NEO POD",
  description:
    "Dive deep into this quest’s challenges, complete tasks, and submit your progress to earn rewards and achievements in the Neo Pod community.",
};

const category = {
  id: 1,
  title: "Hot Campaigns",
  icon: "/dashboard/category/icon-1.png",
  background: "/dashboard/category/background-2.jpg",
};

const breadcrumbsList = [
  {
    title: "Quests",
    href: "/quests",
  },
  {
    title: category.title,
    href: `/quests/${category.id}`,
  },
];

const CategoryPage = async () => {
  return (
    <>
      <NeoBreadcrumbs list={breadcrumbsList} />
      <CategoryContainer scrollable={true} category={category} />
    </>
  );
};

export default CategoryPage;
