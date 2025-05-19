import Link from "next/link";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";
import MainPageScroll from "@/components/common/MainPageScroll";

const ManagePageWrapper = ({
  list,
  href,
  icon,
  children,
  linkLabel,
  scrollable = true,
}) => {
  return (
    <MainPageScroll scrollable={scrollable}>
      <div className="mb-3 flex items-center justify-between gap-4 rounded-xl border-t border-gray-400 bg-black/60 px-8 py-2.5 backdrop-blur-sm">
        <NeoBreadcrumbs list={list} />

        <Link
          href={href}
          className="flex items-center gap-1 rounded-full border border-black bg-white px-3 py-1.5 text-sm font-medium capitalize text-black transition-colors hover:bg-gray-50"
        >
          {linkLabel} {icon}
        </Link>
      </div>

      {children}
    </MainPageScroll>
  );
};

export default ManagePageWrapper;
