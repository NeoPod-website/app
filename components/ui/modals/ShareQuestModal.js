"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Copy, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useMemo, useCallback } from "react";

import MainModal from "./MainModal";

import { toggleShareQuestModal } from "@/redux/slice/modalsSlice";

import XIcon from "../socialIcons/XIcon";
import RedditIcon from "../socialIcons/RedditIcon";
import DiscordIcon from "../socialIcons/DiscordIcon";
import TelegramIcon from "../socialIcons/TelegramIcon";
import WhatsAppIcon from "../socialIcons/WhatsAppIcon";
import LinkedInIcon from "../socialIcons/LinkedInIcon";

const SOCIAL_PLATFORMS = [
  {
    name: "Twitter",
    icon: <XIcon className="h-8 w-8 text-white" />,
    generateUrl: (text, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: <TelegramIcon className="h-8 w-8 text-white" />,
    generateUrl: (text, url) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "WhatsApp",
    icon: <WhatsAppIcon className="h-8 w-8 text-white" />,
    generateUrl: (text, url) =>
      `https://wa.me/?text=${encodeURIComponent(text + url)}`,
  },
  {
    name: "Discord",
    icon: <DiscordIcon className="h-8 w-8 text-white" />,
    isSpecial: true,
  },
  {
    name: "LinkedIn",
    icon: <LinkedInIcon className="h-8 w-8 text-white" />,
    generateUrl: (_, url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    icon: <RedditIcon className="h-8 w-8 text-white" />,
    generateUrl: (_, url, title) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
];

const ShareQuestModal = () => {
  const dispatch = useDispatch();
  const { questId } = useParams();

  const [copied, setCopied] = useState(false);

  const quest = useSelector((state) => state.modals.selectedQuest);
  const isOpen = useSelector((state) => state.modals.isShareQuestModalOpen);

  const { questUrl, shareText } = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/quests/${questId}`;

    // Enhanced share text for NeoPod Ambassador Program
    const text =
      `🚀 Join the NeoPod Ambassador Program!\n\n` +
      `Quest: "${quest?.name || "Amazing Quest"}"\n` +
      `💎 Rewards: ${quest?.points || 0} NeoPod points\n` +
      `Complete quests, earn rewards, and become part of the NEO blockchain ecosystem! 🌐\n\n` +
      `#NEO #NEOPOD #Blockchain #Ambassador #Web3\n\n`;

    return { questUrl: url, shareText: text };
  }, [questId, quest?.name, quest?.points]);

  const handleClose = useCallback(() => {
    dispatch(toggleShareQuestModal());
  }, [dispatch]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(questUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [questUrl]);

  const handleDiscordShare = useCallback(async () => {
    // Enhanced Discord message with better formatting
    const discordText =
      `🚀 **NeoPod Ambassador Program** 🚀\n\n` +
      `**Quest:** ${quest?.name || "Amazing Quest"}\n` +
      `💎 **Rewards:** ${quest?.points || 0} NeoPod points\n` +
      `Complete quests, earn rewards, and become part of the NEO blockchain ecosystem! 🌐\n\n` +
      `Join here: ${questUrl}\n\n` +
      `#NEO #NEOPOD #Blockchain #Ambassador #Web3`;

    try {
      await navigator.clipboard.writeText(discordText);
      alert("NeoPod quest details copied! You can now paste it in Discord.");
    } catch {
      alert("Failed to copy. Please copy the link manually.");
    }
  }, [quest?.name, quest?.points, quest?.due_date, questUrl]);

  const handleSocialClick = useCallback(
    (platform) => {
      if (platform.isSpecial) {
        handleDiscordShare();
      }
    },
    [handleDiscordShare],
  );

  const renderSocialIcon = useCallback(
    (platform) => {
      const content = (
        <div className="group flex cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-800/50 p-4 transition-colors hover:bg-gray-700/50">
          <div className="mb-2 flex h-12 w-12 items-center justify-center">
            {platform.icon}
          </div>

          <span className="text-sm font-medium text-gray-300">
            {platform.name}
          </span>
        </div>
      );

      if (platform.isSpecial) {
        return (
          <div key={platform.name} onClick={() => handleSocialClick(platform)}>
            {content}
          </div>
        );
      }

      return (
        <Link
          key={platform.name}
          href={platform.generateUrl(shareText, questUrl, quest?.name)}
          target="_blank"
          className="block"
        >
          {content}
        </Link>
      );
    },
    [shareText, questUrl, quest?.name, handleSocialClick],
  );

  if (!quest) return null;

  return (
    <MainModal
      size="md"
      isOpen={isOpen}
      title="Share Quest"
      description="Share this quest with your friends and community across different platforms."
      handleOnClose={handleClose}
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full">
              <Image
                width={20}
                height={20}
                src="/neo-logo.svg"
                alt="NEO Logo"
              />
            </div>

            <span className="text-sm font-medium text-green-400">
              NEO Blockchain Ambassador
            </span>
          </div>

          <h4 className="text-lg font-semibold text-white">{quest.name}</h4>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-100">
            <span className="flex items-center gap-1">
              💎 {quest.points} points
            </span>

            <span className="flex items-center gap-1">
              ⏰ Due:{" "}
              {quest.due_date
                ? new Date(quest.due_date).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <p className="mx-auto max-w-sm text-xs text-gray-200">
            Complete quests, earn NeoPod points, and become part of the NEO
            blockchain ecosystem
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {SOCIAL_PLATFORMS.map(renderSocialIcon)}
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-700"></div>
          <span className="text-sm text-gray-400">Or share with link</span>
          <div className="h-px flex-1 bg-gray-700"></div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-3">
            <span className="flex-1 truncate text-sm text-gray-100">
              {questUrl}
            </span>

            <Button
              size="sm"
              variant="light"
              className="min-w-0 px-3"
              startContent={
                copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="text-gray-400" />
                )
              }
              onPress={handleCopyLink}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default ShareQuestModal;
