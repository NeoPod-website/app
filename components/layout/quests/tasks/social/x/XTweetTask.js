"use client";

import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { ShieldAlertIcon } from "lucide-react";

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

const XTweetTask = ({ task }) => {
  const [tweetUrl, setTweetUrl] = useState("");

  const handleVerifyTweet = () => {
    console.log("Verifying tweet:", tweetUrl);
    console.log("Task data:", task);
  };

  return (
    <>
      <div className="mb-3 space-y-3">
        <Input
          size="lg"
          type="url"
          value={tweetUrl}
          variant="bordered"
          className="bg-dark"
          onChange={(e) => setTweetUrl(e.target.value)}
          placeholder={task?.placeholder || "https://x.com/your_tweet_url"}
          classNames={{
            inputWrapper:
              "border-gray-300 focus-within:!border-gray-300 rounded-xl focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black px-4 py-2.5",
          }}
        />

        {task?.includeText && (
          <div className="rounded-xl border border-gray-300 px-3 py-2">
            <div className="flex items-center gap-2">
              <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

              <p className="text-sm text-gray-100">
                Include the following words, hashtags, or mentions in your tweet
                to complete the quest:
              </p>
            </div>

            {renderIncludeChips(task.includeText)}
          </div>
        )}
      </div>

      <div className="flex w-full justify-end">
        <Button
          onPress={handleVerifyTweet}
          disabled={!tweetUrl.trim()}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Verify Tweet
        </Button>
      </div>
    </>
  );
};

export default XTweetTask;
