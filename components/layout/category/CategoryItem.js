import React from "react";
import Image from "next/image";

import CategorySeeMore from "./CategorySeeMore";

const CategoryItem = ({
  id,
  icon,
  podId,
  title,
  description,
  background,
  showDescription = false,
}) => {
  const backgroundURL =
    typeof background === "string"
      ? background
      : background instanceof File
        ? URL.createObjectURL(background)
        : "/dashboard/category/background-2.jpg";

  const iconURL =
    typeof icon === "string"
      ? icon
      : icon instanceof File
        ? URL.createObjectURL(icon)
        : "/dashboard/category/icon-1.png";

  return (
    <div className="relative h-40 min-h-40 w-full overflow-hidden rounded-2.5xl p-5">
      <div
        className="absolute inset-0 z-10 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: `url('${backgroundURL}')`,
        }}
      ></div>

      <div className="absolute bottom-5 left-5 z-20">
        <div className="flex items-center gap-2.5">
          <Image
            src={iconURL}
            alt={title + " icon"}
            width={38}
            height={38}
            className="overflow-hidden rounded-lg"
          />

          <h3 className="font-work-sans text-2xl font-bold">{title}</h3>
        </div>

        {showDescription && (
          <p className="line-clamp-2 whitespace-nowrap text-wrap break-all text-gray-100">
            {description}
          </p>
        )}
      </div>

      <CategorySeeMore id={id} podId={podId} />
    </div>
  );
};

export default CategoryItem;
