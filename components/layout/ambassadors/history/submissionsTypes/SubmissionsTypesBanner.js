import {
  StarIcon,
  CrownIcon,
  TrophyIcon,
  BookOpenIcon,
  SparklesIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

const BANNER_CONFIGS = {
  accepted: {
    icon: TrophyIcon,
    title: "Great Work!",
    bgClass:
      "border-green-500/30 bg-gradient-to-r from-green-500/10 via-emerald-500/10",
    titleColor: "text-green-300",
    textColor: "text-green-200",
    bulletColor: "bg-green-400",
    iconColor: "text-green-400",
    buttons: [
      {
        text: "Continue Excellence",
        href: "/quests",
        className:
          "rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700",
      },

      {
        text: "View Highlighted Work",
        href: "/submissions/highlighted",
        className:
          "rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-500/10",
      },
    ],
    tips: [
      "Your accepted submissions demonstrate excellent quality and understanding",
      "Keep up the outstanding work to maintain your high success rate",
      "Consider helping other ambassadors by sharing your successful approaches",
      "Your quality submissions contribute to the growth of the NEO ecosystem",
    ],
  },

  highlighted: {
    icon: CrownIcon,
    title: "Excellence Recognized",
    subtitle: "Your outstanding contributions to the NEO community",
    bgClass:
      "border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10",
    titleColor: "text-yellow-300",
    textColor: "text-yellow-100",
    subtitleColor: "text-yellow-200",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
    decorIcon: SparklesIcon,
    buttons: [
      {
        text: "Continue Excellence",
        href: "/quests",
        className:
          "rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700",
      },

      {
        text: "View All Work",
        href: "/history",
        className:
          "rounded-lg border border-yellow-500 px-4 py-2 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-500/10",
      },
    ],
    tips: [
      {
        icon: TrophyIcon,
        text: "These submissions represent the highest quality work in our community",
      },

      {
        icon: StarIcon,
        text: "Highlighted work may be featured in official NEO communications and showcases",
      },

      {
        icon: SparklesIcon,
        text: "Your exceptional contributions help elevate the entire NEO ecosystem",
      },

      {
        icon: CrownIcon,
        text: "You're among the top contributors setting the standard for excellence",
      },
    ],
  },

  rejected: {
    icon: BookOpenIcon,
    title: "Improvement Tips",
    bgClass: "border-yellow-500/30 bg-yellow-500/5",
    titleColor: "text-yellow-300",
    textColor: "text-yellow-200",
    bulletColor: "bg-yellow-400",
    iconColor: "text-yellow-400",
    buttons: [
      {
        text: "View Approved Examples",
        href: "/submissions/approved",
        className:
          "rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700",
      },

      {
        text: "Try New Quest",
        href: "/quests",
        className:
          "rounded-lg border border-yellow-500 px-4 py-2 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-500/10",
      },
    ],
    tips: [
      "Review the feedback carefully and address each point mentioned by the reviewer",
      "Check the quest requirements again to ensure you haven't missed any details",
      "Look at approved submissions for inspiration and best practices",
      "Don't hesitate to ask for clarification if the feedback is unclear",
    ],
  },
};

const SubmissionsTypesBanner = ({ type }) => {
  const config = BANNER_CONFIGS[type];

  if (!config) return null;

  const Icon = config.icon;
  const DecorIcon = config.decorIcon;

  return (
    <div
      className={`relative hidden rounded-2xl border p-6 sm:block ${config.bgClass}`}
    >
      {DecorIcon && (
        <div className="pointer-events-none absolute inset-0 flex items-start justify-end p-4 opacity-10">
          <DecorIcon size={60} className="text-yellow-400" />
        </div>
      )}

      <div className="relative">
        {type === "highlighted" && (
          <div className="mb-4 flex items-center gap-3">
            <div className={`rounded-full p-3 ${config.iconBg}`}>
              <Icon size={24} className={config.iconColor} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${config.titleColor}`}>
                {config.title}
              </h3>
              <p className={config.subtitleColor}>{config.subtitle}</p>
            </div>
          </div>
        )}

        {type !== "highlighted" && (
          <div className="mb-4 flex items-center gap-2">
            <Icon size={20} className={config.iconColor} />
            <h3 className={`text-lg font-bold ${config.titleColor}`}>
              {config.title}
            </h3>
          </div>
        )}

        <div className={`space-y-3 text-sm ${config.textColor}`}>
          {config.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              {tip.icon ? (
                <tip.icon
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-yellow-400"
                />
              ) : (
                <div
                  className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${config.bulletColor}`}
                />
              )}
              <p>{tip.text || tip}</p>
            </div>
          ))}
        </div>

        <div
          className={
            type === "highlighted" ? "mt-6 flex gap-3" : "mt-4 flex gap-3"
          }
        >
          {config.buttons.map((button, index) => (
            <Link key={index} href={button.href} className={button.className}>
              {button.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsTypesBanner;
