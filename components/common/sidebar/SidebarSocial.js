import React from "react";
import Link from "next/link";

import socialLogos from "@/data/socialLogos";

const SidebarSocial = () => {
  return (
    <ul className="flex items-center justify-between px-8">
      {socialLogos.map((logo) => (
        <li key={logo.name}>
          <Link
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-gradient-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:h-12 md:w-12"
            aria-label={`Visit our ${logo.name} page`}
            title={logo.name}
          >
            <logo.Icon
              className="h-6 w-6 text-white transition-colors duration-300"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarSocial;
