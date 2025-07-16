import React from "react";
import Link from "next/link";

import socialLogos from "@/data/socialLogos";

const SidebarSocial = () => {
  return (
    <ul className="flex items-center justify-between px-4 2xl:px-10 3xl:px-8">
      {socialLogos.map((logo) => (
        <li key={logo.name}>
          <Link
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-gradient-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black 3xl:h-10 3xl:w-10"
            aria-label={`Visit our ${logo.name} page`}
            title={logo.name}
          >
            <logo.Icon
              className="h-5 w-5 text-white transition-colors duration-300 3xl:h-6 3xl:w-6"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarSocial;
