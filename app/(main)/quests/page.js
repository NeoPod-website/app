import CategoriesList from "@/components/layout/category/CategoriesList";

export const metadata = {
  title: "Quests | NEO POD",
  description:
    "Discover and participate in quests designed to boost your engagement and growth within the Neo Pod community. Earn rewards and unlock achievements.",
};

const QuestsPage = async () => {
  return <CategoriesList />;
};

export default QuestsPage;
