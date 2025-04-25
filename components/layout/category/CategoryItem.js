import React from "react";
import Image from "next/image";

const CategoryItem = ({ title, icon, background }) => {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-2.5xl p-5">
      <div
        className="absolute inset-0 z-10 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: background
            ? `url('${background}')`
            : "url('/dashboard/category/background-2.jpg')",
        }}
      ></div>

      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2.5 font-work-sans text-2xl font-bold">
        <Image src={icon} alt={title + " icon"} width={38} height={38} />

        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default CategoryItem;
