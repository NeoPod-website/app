"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { EllipsisVerticalIcon, GlobeIcon } from "lucide-react";

import shortAddress from "@/utils/shortAddress";

import CopyToClipboard from "@/components/ui/CopyToClipboard";

const SidebarProfile = ({
  children,
  name = "Ambassador 1",
  address = "0xD203EC25bD177bd90d0E8E29acd74B4A2c840Aa9",
  location = "CA",
}) => {
  return (
    <div className="flex items-center justify-start gap-3 overflow-hidden px-3 py-2">
      <div className="relative h-12 min-w-12">
        <Image
          src="/dashboard/profile/default-profile.png"
          width={48}
          height={48}
          alt="Profile Photo"
          className="rounded-md"
        />

        {children}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-medium capitalize text-white">
            {name}
          </h3>

          <Button className="h-5 w-5 min-w-0 bg-transparent p-0 hover:bg-gray-700">
            <EllipsisVerticalIcon size={16} />
          </Button>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-100">
            <p>{shortAddress(address)}</p> <CopyToClipboard text={address} />
          </div>

          <div className="flex items-center gap-1">
            <GlobeIcon size={16} />
            <p className="text-sm text-gray-100">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;
