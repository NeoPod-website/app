import Link from "next/link";
import { SendHorizontalIcon } from "lucide-react";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import MainPageScroll from "@/components/common/MainPageScroll";

const PodContainerWrapper = ({ children, list, scrollable = true }) => {
  return (
    <MainPageScroll scrollable={scrollable}>
      <div className="flex items-start justify-between">
        <NeoBreadcrumbs list={list} />

        <Link
          href="/admin/manage/pods/create"
          className="flex w-fit items-center gap-2 rounded-full border border-gray-100 bg-gradient-primary px-8 py-2.5 hover:border-gray-600"
        >
          Create POD <SendHorizontalIcon className="ml-2" />
        </Link>
      </div>

      {children}
    </MainPageScroll>
  );
};

export default PodContainerWrapper;
