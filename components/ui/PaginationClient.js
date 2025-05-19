"use client";

import Link from "next/link";
import { Pagination, PaginationItemType } from "@heroui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function PaginationClient({ total, currentPage }) {
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <Link
          key={key}
          href={`?page=${currentPage + 1}`}
          className={className + " h-8 w-8 min-w-8 bg-default-200/50"}
        >
          <ChevronRightIcon />
        </Link>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <Link
          key={key}
          href={`?page=${currentPage - 1}`}
          className={className + " h-8 w-8 min-w-8 bg-default-200/50"}
        >
          <ChevronLeftIcon />
        </Link>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <span key={key} className={className}>
          ...
        </span>
      );
    }

    return (
      <Link
        key={key}
        ref={ref}
        href={`?page=${value}`}
        className={`${className} ${isActive ? "bg-gradient-to-br from-indigo-500 to-pink-500 font-bold text-white" : ""}`}
      >
        {value}
      </Link>
    );
  };

  return (
    <div className="flex justify-center pt-8">
      <Pagination
        total={total}
        initialPage={currentPage}
        renderItem={renderItem}
        disableCursorAnimation
        showControls
        radius="full"
        variant="light"
        className="gap-2"
      />
    </div>
  );
}
