"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Heart, Repeat, MessageCircle, ShieldAlertIcon } from "lucide-react";

import XTweetCard from "./XTweetCard";

const XReactTask = ({ task }) => {
  const handleVerifyInteraction = () => {
    // TODO: Implement interaction verification logic
    console.log("Verifying interaction for:", task?.tweetUrl);
    console.log("Task data:", task);
  };

  return (
    <>
      <div className="mb-3 space-y-3">
        {task?.tweetUrl && <XTweetCard tweetUrl={task.tweetUrl} task={task} />}

        <div className="rounded-xl border border-gray-300 px-3 py-2">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

            <p className="text-sm text-gray-100">
              Complete the following actions to finish this quest:
            </p>
          </div>

          <div className="mt-2 space-y-1">
            {task?.requireReply && (
              <div className="flex items-center gap-2 text-sm text-gray-200">
                <MessageCircle size={14} className="text-blue-400" />

                <span>Reply to the tweet</span>
              </div>
            )}

            {task?.requireRetweet && (
              <div className="flex items-center gap-2 text-sm text-gray-200">
                <Repeat size={14} className="text-green-400" />

                <span>Retweet the post</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-200">
              <Heart size={14} className="text-red-400" />

              <span>Like the tweet</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-yellow-300 bg-yellow-900/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="h-4 w-4 text-yellow-400" />

            <p className="text-sm text-yellow-300">
              Click the tweet above to visit it on X (Twitter), complete the
              required actions, then return here to verify.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end gap-2">
        {task?.tweetUrl && (
          <Link href={task.tweetUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-gray-700">Visit Tweet</Button>
          </Link>
        )}

        <Button
          className="border border-white bg-gradient-primary"
          onPress={handleVerifyInteraction}
          disabled={!task?.tweetUrl}
        >
          Verify Interaction
        </Button>
      </div>
    </>
  );
};

export default XReactTask;
