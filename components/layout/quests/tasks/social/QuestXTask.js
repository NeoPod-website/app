"use client";

import React, { useState } from "react";
import { Button, Input, Avatar } from "@heroui/react";
import {
  ShieldAlertIcon,
  MessageCircle,
  Repeat,
  Heart,
  Calendar,
  Users,
} from "lucide-react";

// Task Types
const X_TASK_TYPES = {
  TWEET: "tweet",
  FOLLOW: "follow",
  REACT: "react",
  SPACES: "spaces",
};

// Function to render chips for include text
const renderIncludeChips = (includeText) => {
  if (!includeText) return null;

  const items = includeText.split(",").map((item) => item.trim());

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-gray-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

// Twitter account card for follow task
const XAccountCard = ({ account }) => {
  return (
    <div className="mb-3 rounded-xl border border-neutral-700 bg-neutral-800 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={account.profileImage}
            alt={account.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-100">{account.name}</p>
            <p className="text-sm text-gray-400">@{account.handle}</p>
          </div>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Follow
        </Button>
      </div>
    </div>
  );
};

// Twitter card for reaction task
const XTweetCard = ({ tweet }) => {
  return (
    <div className="mb-3 rounded-xl border border-neutral-700 bg-neutral-800 p-3">
      <div className="flex items-start gap-3">
        <Avatar
          src={tweet.profileImage}
          alt={tweet.name}
          className="h-8 w-8 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-100">{tweet.name}</p>
            <p className="text-sm text-gray-400">@{tweet.handle}</p>
            <span className="text-xs text-gray-400">• {tweet.time}</span>
          </div>
          <p className="my-2 text-gray-200">{tweet.content}</p>

          <div className="mt-3 flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-1 hover:text-blue-400">
              <MessageCircle size={16} />
              <span className="text-xs">{tweet.replies}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-400">
              <Repeat size={16} />
              <span className="text-xs">{tweet.retweets}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-red-400">
              <Heart size={16} />
              <span className="text-xs">{tweet.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Twitter Spaces card
// const XSpacesCard = ({ space }) => {
//   return (
//     <div className="mb-3 rounded-xl border border-neutral-700 bg-neutral-800 p-3">
//       <div className="flex items-start gap-3">
//         <div className="flex-1">
//           <div className="mb-2 flex items-center gap-2">
//             <div className="h-3 w-3 rounded-full bg-red-500"></div>
//             <p className="text-sm font-medium text-red-400">LIVE</p>
//           </div>

//           <h3 className="text-lg font-semibold text-gray-100">{space.title}</h3>

//           <div className="mt-2 flex items-center gap-3">
//             <div className="flex items-center gap-1 text-gray-400">
//               <Calendar size={14} />
//               <span className="text-xs">{space.date}</span>
//             </div>
//             <div className="flex items-center gap-1 text-gray-400">
//               <Users size={14} />
//               <span className="text-xs">{space.listeners} listening</span>
//             </div>
//           </div>

//           <div className="mt-3 flex -space-x-2">
//             {space.hosts.map((host, index) => (
//               <Avatar
//                 key={index}
//                 src={host.image}
//                 alt={host.name}
//                 className="h-6 w-6 rounded-full border border-neutral-800"
//               />
//             ))}
//             <div className="ml-2 flex items-center">
//               <p className="text-xs text-gray-400">
//                 Hosted by {space.hosts[0].name}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const XSpacesCard = ({ space }) => {
  // Helper function to determine the status badge
  const renderStatusBadge = () => {
    if (!space) return null;

    // Check if the space is live
    if (space.isLive) {
      return (
        <span className="w-fit rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
          LIVE
        </span>
      );
    }

    // Check if the space is scheduled
    const spaceDate = space.date ? new Date(space.date) : null;
    const now = new Date();

    if (spaceDate && spaceDate > now) {
      return (
        <span className="w-fit rounded-full bg-sky-500 px-2 py-1 text-xs font-bold text-white">
          SCHEDULED
        </span>
      );
    }

    // Default to showing nothing or a completed status
    return (
      <span className="w-fit rounded-full bg-gray-500 px-2 py-1 text-xs font-bold text-white">
        ENDED
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  };

  // Safe access to avoid errors with undefined values
  if (!space) {
    return (
      <div className="rounded-lg border bg-gray-50 p-4">
        No space data available
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            {renderStatusBadge()}
            <h3 className="mt-2 text-lg font-bold">
              {space.title || "Untitled Space"}
            </h3>
          </div>
          <div className="text-sm text-gray-300">{formatDate(space.date)}</div>
        </div>

        <div className="text-sm text-gray-300">
          {space.listeners ? `${space.listeners} listening` : "0 listening"}
        </div>

        <div className="mt-2 flex items-center">
          <div className="mr-2 flex -space-x-2">
            {Array.isArray(space.hosts) &&
              space.hosts.map((host, index) => (
                <div
                  key={index}
                  className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-200"
                >
                  {host.avatar ? (
                    <img
                      src={host.avatar}
                      alt={host.name || `Host ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                        e.target.alt = "Avatar placeholder";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600">
                      {(host.name?.charAt(0) || "?").toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div className="text-sm">
            Hosted by{" "}
            {Array.isArray(space.hosts) && space.hosts.length > 0
              ? space.hosts[0].name || "Anonymous"
              : "Unknown host"}
            {Array.isArray(space.hosts) && space.hosts.length > 1
              ? ` + ${space.hosts.length - 1} more`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestXTask = ({
  taskType = X_TASK_TYPES.REACT,
  includeText = "#Hashtags,Hello,@mention,#crypto",
  account = null,
  tweet = null,
  space = null,
}) => {
  const [tweetUrl, setTweetUrl] = useState("");

  // Sample data for preview (you would replace these with actual props)
  const sampleAccount = account || {
    name: "Neo Blockchain",
    handle: "Neo_Blockchain",
    profileImage:
      "https://pbs.twimg.com/profile_images/1622129808884662272/hCOfsm1H_400x400.jpg",
  };

  const sampleTweet = tweet || {
    name: "Neo Blockchain",
    handle: "Neo_Blockchain",
    time: "2h",
    profileImage:
      "https://pbs.twimg.com/profile_images/1622129808884662272/hCOfsm1H_400x400.jpg",
    content:
      "Join us for the launch of Neo N3 - the most powerful and feature-complete blockchain platform for the Smart Economy. #Neo #Blockchain #SmartEconomy",
    replies: 42,
    retweets: 128,
    likes: 357,
  };

  const sampleSpace = space || {
    title: "Neo Tech Talk: The Future of Web3 Infrastructure",
    date: "2025-04-30T20:00:00Z", // ISO format so new Date(date) works correctly
    isLive: true, // <== will show LIVE badge
    listeners: 482,
    hosts: [
      {
        name: "Neo Official",
        avatar:
          "https://pbs.twimg.com/profile_images/1622129808884662272/hCOfsm1H_400x400.jpg",
      },
      {
        name: "Da Hongfei",
        avatar:
          "https://pbs.twimg.com/profile_images/958500267661746176/KiaXhxb-_400x400.jpg",
      },
    ],
  };

  // const sampleSpace = space || {
  //   title: "Upcoming AMA with N3 Developers",
  //   date: "2025-05-02T18:00:00Z",
  //   isLive: false, // not live
  //   listeners: 0,
  //   hosts: [
  //     {
  //       name: "Neo Dev Team",
  //       avatar:
  //         "https://pbs.twimg.com/profile_images/1456298123453675521/abc1234_normal.jpg",
  //     },
  //   ],
  // };

  // const sampleSpace = space || {
  //   title: "Past: Blockchain Security Insights",
  //   date: "2025-04-20T15:00:00Z",
  //   isLive: false,
  //   listeners: 1320,
  //   hosts: [
  //     {
  //       name: "Neo Security",
  //       avatar: "",
  //     },
  //     {
  //       name: "Jane Doe",
  //       avatar: "",
  //     },
  //   ],
  // };

  // Render the appropriate task based on type
  const renderTaskContent = () => {
    switch (taskType) {
      case X_TASK_TYPES.TWEET:
        return (
          <div className="mb-3 space-y-3">
            <Input
              type="url"
              size="lg"
              variant="bordered"
              placeholder="https://x.com/Neo_Blockchain"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              className="bg-dark"
              classNames={{
                inputWrapper:
                  "border-gray-300 focus-within:!border-gray-300 rounded-xl focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black px-4 py-2.5",
              }}
            />

            <div className="rounded-xl border border-gray-300 px-3 py-2">
              <div className="flex items-center gap-2">
                <ShieldAlertIcon className="h-4 w-4 text-gray-100" />
                <p className="text-sm text-gray-100">
                  Include the following words, hashtags, or mentions in your
                  tweet to complete the quest:
                </p>
              </div>
              {renderIncludeChips(includeText)}
            </div>
          </div>
        );

      case X_TASK_TYPES.FOLLOW:
        return <XAccountCard account={sampleAccount} />;

      case X_TASK_TYPES.REACT:
        return (
          <div className="mb-3 space-y-3">
            <Input
              type="url"
              size="lg"
              variant="bordered"
              placeholder="https://x.com/Neo_Blockchain/status/1234567890"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              className="bg-dark"
              classNames={{
                inputWrapper:
                  "border-gray-300 focus-within:!border-gray-300 rounded-xl focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black px-4 py-2.5",
              }}
            />

            <XTweetCard tweet={sampleTweet} />

            <div className="rounded-xl border border-gray-300 px-3 py-2">
              <div className="flex items-center gap-2">
                <ShieldAlertIcon className="h-4 w-4 text-gray-100" />
                <p className="text-sm text-gray-100">
                  Like, Reply, and Retweet this post to complete the quest.
                </p>
              </div>
            </div>
          </div>
        );

      case X_TASK_TYPES.SPACES:
        return (
          <div className="mb-3 space-y-3">
            <XSpacesCard space={sampleSpace} />

            <div className="rounded-xl border border-gray-300 px-3 py-2">
              <div className="flex items-center gap-2">
                <ShieldAlertIcon className="h-4 w-4 text-gray-100" />
                <p className="text-sm text-gray-100">
                  Join and attend this Twitter Space to complete the quest.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Get button text based on task type
  const getButtonText = () => {
    switch (taskType) {
      case X_TASK_TYPES.TWEET:
        return "Tweet Now";
      case X_TASK_TYPES.FOLLOW:
        return "Verify Follow";
      case X_TASK_TYPES.REACT:
        return "Verify Interaction";
      case X_TASK_TYPES.SPACES:
        return "Join Space";
      default:
        return "Complete";
    }
  };

  return (
    <>
      {renderTaskContent()}

      <div className="flex w-full justify-end">
        <Button>{getButtonText()}</Button>
      </div>
    </>
  );
};

export default QuestXTask;
