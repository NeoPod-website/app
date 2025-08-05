"use client";

import {
  Hash,
  Users,
  Crown,
  Settings,
  ExternalLink,
  ShieldAlertIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Link, Spinner, addToast } from "@heroui/react";

import {
  updateTaskAnswer,
  selectTaskAnswer,
  selectIsTaskCompleted,
} from "@/redux/slice/submissionSlice";

const QuestDiscordTask = ({ task, questId, discordUser }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [serverData, setServerData] = useState(null);

  // Get current task state from Redux
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );
  const isTaskCompleted = useSelector((state) =>
    selectIsTaskCompleted(state, questId, task.id),
  );

  // Determine if join is verified based on current answer
  const joinVerified = currentAnswer?.verified || false;

  // Extract invite code from Discord invite URL
  const extractInviteCode = (inviteLink) => {
    if (!inviteLink) return null;

    const patterns = [
      /discord\.gg\/([a-zA-Z0-9]+)/,
      /discord\.com\/invite\/([a-zA-Z0-9]+)/,
      /discordapp\.com\/invite\/([a-zA-Z0-9]+)/,
    ];

    for (const pattern of patterns) {
      const match = inviteLink.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  // Fetch Discord server information using invite code
  const fetchServerInfo = async (inviteCode) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch server information");
      }

      const data = await response.json();

      setServerData({
        name: data.guild?.name || "Unknown Server",
        description: data.guild?.description || "",
        channelName: data.channel?.name || "general",
        memberCount: data.approximate_member_count || 0,
        inviterName: data.inviter?.username || "Unknown",
        onlineCount: data.approximate_presence_count || 0,
        verificationLevel: data.guild?.verification_level || 0,
        icon: data.guild?.icon
          ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=128`
          : null,
      });
    } catch (err) {
      // Fallback to task data if API fails
      if (task?.serverName) {
        setServerData({
          name: task.serverName,
          description: task?.description || "",
          icon: null,
          memberCount: 0,
          onlineCount: 0,
          channelName: "general",
          inviterName: "Unknown",
          verificationLevel: 0,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch server info when component mounts or invite link changes
  useEffect(() => {
    const inviteCode = extractInviteCode(task?.inviteLink);

    if (inviteCode) {
      fetchServerInfo(inviteCode);
    } else if (task?.serverName) {
      setServerData({
        name: task.serverName,
        description: task?.description || "",
        icon: null,
        memberCount: 0,
        onlineCount: 0,
        channelName: "general",
        inviterName: "Unknown",
        verificationLevel: 0,
      });
    }
  }, [task?.inviteLink, task?.serverName]);

  // Handle clicking "Join Server" button
  const handleJoinServer = () => {
    // If requireVerification is false, mark task as completed when joining
    if (!task?.requireVerification) {
      dispatch(
        updateTaskAnswer({
          questId,
          taskId: task.id,
          answer: {
            joined: true,
            verified: false,
            joinedAt: new Date().toISOString(),
            serverName: serverData?.name || task?.serverName,
          },
        }),
      );
    }
  };

  const handleVerifyJoin = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/socials/discord/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Verification failed.");
      }

      // Update Redux with verified status
      dispatch(
        updateTaskAnswer({
          questId,
          taskId: task.id,
          answer: {
            joined: true,
            verified: true,
            joinedAt: currentAnswer?.joinedAt || new Date().toISOString(),
            verifiedAt: new Date().toISOString(),
            serverName: serverData?.name || task?.serverName,
          },
        }),
      );
    } catch (err) {
      const errorMessage =
        err.message || "Verification failed. Please try again.";

      addToast({
        title: "Verification Failed",
        description: errorMessage,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationLevelText = (level) => {
    const levels = {
      0: "None",
      1: "Low",
      2: "Medium",
      3: "High",
      4: "Very High",
    };
    return levels[level] || "Unknown";
  };

  // If Discord is not connected, show connection message
  if (!discordUser) {
    return (
      <div className="mb-3 space-y-3">
        <div className="rounded-xl border border-amber-300 bg-amber-900/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
              <ShieldAlertIcon className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-grow">
              <h3 className="text-lg font-bold text-amber-200">
                Discord Not Connected
              </h3>

              <p className="mt-1 text-sm text-amber-300">
                Connect your Discord account to NeoPod to verify membership in
                Discord servers and complete quests.
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
                <ShieldAlertIcon className="h-3 w-3" />
                <span>Required for Discord quest verification</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

          <p className="text-sm text-gray-100">
            Connect Discord to participate in server quests.
          </p>
        </div>

        <div className="flex w-full justify-end">
          <Button
            as={Link}
            href="/settings?tab=socials"
            className="border border-white bg-gradient-primary hover:opacity-90"
            endContent={<Settings className="h-4 w-4" />}
          >
            Connect Discord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 space-y-3">
        {(loading || serverData || task?.serverName) && (
          <div className="rounded-xl border border-gray-600 bg-gray-700 p-4">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Spinner size="sm" color="primary" />

                <span className="ml-2 text-sm text-gray-300">
                  Loading server info...
                </span>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                    {serverData?.icon ? (
                      <Image
                        width={48}
                        height={48}
                        alt="Server Icon"
                        src={serverData.icon}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {(serverData?.name ||
                          task?.serverName ||
                          "D")[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-grow">
                    <h3 className="truncate text-lg font-bold text-white">
                      {serverData?.name || task?.serverName || "Discord Server"}
                    </h3>

                    {serverData?.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-300">
                        {serverData.description}
                      </p>
                    )}

                    {task?.description && !serverData?.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-300">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-200">
                      {serverData?.memberCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />

                          <span>
                            {serverData.memberCount.toLocaleString()} members
                          </span>
                        </div>
                      )}

                      {serverData?.onlineCount > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-400"></div>

                          <span>
                            {serverData.onlineCount.toLocaleString()} online
                          </span>
                        </div>
                      )}

                      {serverData?.channelName && (
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />

                          <span>{serverData.channelName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {(serverData?.inviterName ||
                  serverData?.verificationLevel > 0) && (
                  <div className="mt-3 border-t border-gray-700 pt-3">
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      {serverData?.inviterName &&
                        serverData.inviterName !== "Unknown" && (
                          <div className="flex items-center gap-1">
                            <Crown className="h-3 w-3" />

                            <span>Invited by {serverData.inviterName}</span>
                          </div>
                        )}

                      {serverData?.verificationLevel > 0 && (
                        <div className="flex items-center gap-1">
                          <ShieldAlertIcon className="h-3 w-3" />

                          <span>
                            Security:{" "}
                            {getVerificationLevelText(
                              serverData.verificationLevel,
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

          <p className="text-sm text-gray-100">
            {isTaskCompleted
              ? `✅ Completed ${serverData?.name || task?.serverName}`
              : `Join ${serverData?.name || task?.serverName || "our Discord server"} to complete this quest.`}
          </p>
        </div>

        {task?.requireVerification &&
          !joinVerified &&
          currentAnswer?.joined && (
            <div className="rounded-xl border border-yellow-300 bg-yellow-900/20 px-3 py-2">
              <div className="flex items-center gap-2">
                <ShieldAlertIcon className="h-4 w-4 text-yellow-400" />

                <p className="text-sm text-yellow-300">
                  After joining, verify your membership to complete this quest.
                </p>
              </div>
            </div>
          )}
      </div>

      <div className="flex w-full justify-end gap-2">
        <Button
          as={Link}
          target="_blank"
          href={task?.inviteLink}
          rel="noopener noreferrer"
          className="bg-gray-700 hover:bg-gray-600"
          isDisabled={!task?.inviteLink}
          endContent={<ExternalLink className="h-4 w-4" />}
          onPress={handleJoinServer}
        >
          Join Server
        </Button>

        {task?.requireVerification && !joinVerified && (
          <Button
            isLoading={loading}
            onPress={handleVerifyJoin}
            isDisabled={!task?.inviteLink || loading}
            className="border border-white bg-gradient-primary hover:opacity-90"
          >
            {loading ? "Verifying..." : "Verify Membership"}
          </Button>
        )}

        {isTaskCompleted && (
          <Button className="bg-green-600 hover:bg-green-700" isDisabled={true}>
            ✅ Completed
          </Button>
        )}
      </div>
    </>
  );
};

export default QuestDiscordTask;
