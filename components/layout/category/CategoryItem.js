import React from "react";
import Image from "next/image";

import CategorySeeMore from "./CategorySeeMore";

const statusColors = {
  live: "bg-green-600 text-white",
  draft: "bg-yellow-500 text-black",
  archived: "bg-gray-500 text-white",
};

const CategoryItem = ({
  id,
  icon,
  podId,
  style,
  title,
  status,
  background,
  description,
  isAdmin = false,
  isQuestPage = false,
  showDescription = false,
}) => {
  const backgroundURL =
    typeof background === "string" && background
      ? background
      : "/dashboard/category/background-2.jpg";

  const iconURL =
    typeof icon === "string" && icon ? icon : "/dashboard/category/icon-1.png";

  const borderColor =
    isAdmin &&
    (status === "live"
      ? "border-green-600"
      : status === "draft"
        ? "border-yellow-500"
        : "border-gray-500");

  return (
    <div
      className={`relative h-40 min-h-40 w-full overflow-hidden rounded-2.5xl border ${
        borderColor || "border-transparent"
      }`}
      style={{
        ...style,
      }}
    >
      <div
        className="absolute inset-0 z-10 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: `url('${backgroundURL}')`,
        }}
      ></div>

      <div className="absolute bottom-5 left-5 z-20 space-y-1">
        <div className="flex items-center gap-1.5 3xl:gap-2.5">
          {icon && (
            <Image
              width={38}
              height={38}
              src={iconURL}
              alt={title + " icon"}
              className="overflow-hidden rounded-lg lg:h-8 lg:w-8 3xl:h-9 3xl:w-9"
            />
          )}

          <h3 className="font-work-sans text-xl font-bold 3xl:text-2xl">
            {title}
          </h3>
        </div>

        {showDescription && (
          <p className="line-clamp-2 whitespace-nowrap text-wrap break-all text-sm text-gray-100 3xl:text-base">
            {description}
          </p>
        )}
      </div>

      {isAdmin && (
        <span
          className={`absolute right-5 top-5 z-10 rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
            statusColors[status] || "bg-gray-700 text-white"
          }`}
        >
          {status || "draft"}
        </span>
      )}

      {isQuestPage && (
        <CategorySeeMore id={id} podId={podId} isAdmin={isAdmin} />
      )}
    </div>
  );
};

export default CategoryItem;
