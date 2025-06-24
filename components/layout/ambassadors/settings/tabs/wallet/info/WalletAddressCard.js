"use client";

import React from "react";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { Card, Chip, Input, CardBody } from "@heroui/react";

import CopyToClipboard from "@/components/ui/CopyToClipboard";

const WalletAddressCard = ({ address, isUsingAmbassadorAddress }) => {
  return (
    <Card className="border border-gray-700/50 bg-gradient-dark backdrop-blur-xl">
      <CardBody className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Wallet Address</h3>

          {isUsingAmbassadorAddress && (
            <Chip
              variant="flat"
              size="sm"
              className="border border-gray-400 bg-gray-500/50"
            >
              Server Managed
            </Chip>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Input
            readOnly
            variant="bordered"
            value={address || "0x00000000000000000000000000000000000000"}
            classNames={{
              input: "text-white font-mono text-sm",
              inputWrapper: "bg-gray-800/50 border-gray-600",
            }}
            endContent={
              <div className="flex items-center gap-3">
                <CopyToClipboard text={address || ""} size={16} />

                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://xexplorer.neo.org/address/${address}`}
                >
                  <ExternalLinkIcon size={16} className="text-gray-200" />
                </Link>
              </div>
            }
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default WalletAddressCard;
