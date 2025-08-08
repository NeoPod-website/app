// "use client";

// import {
//   Hash,
//   Users,
//   Settings,
//   ExternalLink,
//   ShieldAlertIcon,
// } from "lucide-react";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Button, Link, addToast } from "@heroui/react";

// import {
//   updateTaskAnswer,
//   selectTaskAnswer,
//   selectIsTaskCompleted,
// } from "@/redux/slice/submissionSlice";

// const QuestTelegramTask = ({ task, questId, telegramUser }) => {
//   const dispatch = useDispatch();

//   const [loading, setLoading] = useState(false);
//   const [groupData, setGroupData] = useState(null);

//   // Get current task state from Redux
//   const currentAnswer = useSelector((state) =>
//     selectTaskAnswer(state, questId, task.id),
//   );
//   const isTaskCompleted = useSelector((state) =>
//     selectIsTaskCompleted(state, questId, task.id),
//   );

//   // Determine if join is verified based on current answer
//   const joinVerified = currentAnswer?.verified || false;

//   // Helper function for channel type text
//   const getChannelTypeText = (type) => {
//     const types = {
//       channel: "Channel",
//       supergroup: "Group",
//       group: "Group",
//     };
//     return types[type] || "Channel";
//   };

//   // Fetch real group information using bot
//   const fetchGroupInfo = async () => {
//     if (!task?.chatId) {
//       // Fallback to task data if no chatId
//       setGroupData({
//         title: task?.groupName || task?.channelName,
//         description: task?.description || "",
//         type: task?.isGroup ? "supergroup" : "channel",
//         memberCount: 0,
//         photo: null,
//         isPrivate: true,
//       });
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/socials/telegram/group-info`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             chatId: task.chatId,
//           }),
//         },
//       );

//       const data = await response.json();

//       if (data.success && data.groupData) {
//         setGroupData(data.groupData);
//       } else {
//         throw new Error(data.message || "Failed to get group info");
//       }
//     } catch (err) {
//       // Fallback to task data
//       setGroupData({
//         title: task?.groupName || task?.channelName,
//         description: task?.description || "",
//         type: task?.isGroup ? "supergroup" : "channel",
//         memberCount: 0,
//         photo: null,
//         isPrivate: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle clicking "Join Channel/Group" button
//   const handleJoinGroup = () => {
//     // If requireVerification is false, mark task as completed when joining
//     if (!task?.requireVerification) {
//       dispatch(
//         updateTaskAnswer({
//           questId,
//           taskId: task.id,
//           answer: {
//             joined: true,
//             verified: false,
//             joinedAt: new Date().toISOString(),
//             groupName: groupData?.title || task?.channelName || task?.groupName,
//             groupType:
//               groupData?.type || (task?.isGroup ? "supergroup" : "channel"),
//           },
//         }),
//       );

//       addToast({
//         title: "Task Completed!",
//         description: `Successfully joined ${groupData?.title || task?.channelName || task?.groupName}`,
//         color: "success",
//       });
//     }
//   };

//   const handleVerifyJoin = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/socials/telegram/verify`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             chatId: task.chatId,
//           }),
//         },
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || "Verification failed.");
//       }

//       // Update Redux with verified status
//       dispatch(
//         updateTaskAnswer({
//           questId,
//           taskId: task.id,
//           answer: {
//             joined: true,
//             verified: true,
//             joinedAt: currentAnswer?.joinedAt || new Date().toISOString(),
//             verifiedAt: new Date().toISOString(),
//             groupName: groupData?.title || task?.channelName || task?.groupName,
//             groupType:
//               groupData?.type || (task?.isGroup ? "supergroup" : "channel"),
//           },
//         }),
//       );

//       addToast({
//         title: "Task Completed!",
//         description: `Successfully verified in ${groupData?.title || task?.channelName || task?.groupName}`,
//         color: "success",
//       });
//     } catch (err) {
//       console.error("Verification failed:", err);
//       const errorMessage =
//         err.message || "Verification failed. Please try again.";

//       addToast({
//         title: "Verification Failed",
//         description: errorMessage,
//         color: "danger",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGroupInfo();
//   }, [task?.chatId]);

//   // If Telegram is not connected, show connection message
//   if (!telegramUser) {
//     return (
//       <div className="mb-3 space-y-3">
//         <div className="rounded-xl border border-amber-300 bg-amber-900/20 p-4">
//           <div className="flex items-start gap-3">
//             <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
//               <ShieldAlertIcon className="h-6 w-6 text-white" />
//             </div>

//             <div className="min-w-0 flex-grow">
//               <h3 className="text-lg font-bold text-amber-200">
//                 Telegram Not Connected
//               </h3>
//               <p className="mt-1 text-sm text-amber-300">
//                 Connect your Telegram account to NeoPod to verify membership in
//                 Telegram channels and groups.
//               </p>

//               <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
//                 <ShieldAlertIcon className="h-3 w-3" />
//                 <span>Required for Telegram quest verification</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
//           <ShieldAlertIcon className="h-4 w-4 text-gray-100" />
//           <p className="text-sm text-gray-100">
//             Connect Telegram to participate in channel and group quests.
//           </p>
//         </div>

//         <div className="flex w-full justify-end">
//           <Button
//             as={Link}
//             href="/settings?tab=socials"
//             className="border border-white bg-gradient-primary hover:opacity-90"
//             endContent={<Settings className="h-4 w-4" />}
//           >
//             Connect Telegram
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="mb-3 space-y-3">
//         {(groupData || task?.channelName || task?.groupName) && (
//           <div className="rounded-xl border border-gray-600 bg-gray-700 p-4">
//             <div className="flex items-start gap-3">
//               <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
//                 {groupData?.photo ? (
//                   <Image
//                     width={48}
//                     height={48}
//                     src={groupData.photo}
//                     alt="Group Photo"
//                     className="h-12 w-12 rounded-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-lg font-bold text-white">
//                     {(groupData?.title ||
//                       task?.channelName ||
//                       task?.groupName ||
//                       "T")[0].toUpperCase()}
//                   </span>
//                 )}
//               </div>

//               <div className="min-w-0 flex-grow">
//                 <h3 className="truncate text-lg font-bold text-white">
//                   {groupData?.title ||
//                     task?.channelName ||
//                     task?.groupName ||
//                     "Telegram Channel"}
//                 </h3>

//                 <p className="text-sm text-gray-300">
//                   {groupData?.isPrivate ? "Private " : ""}
//                   Telegram{" "}
//                   {getChannelTypeText(
//                     groupData?.type ||
//                       (task?.isGroup ? "supergroup" : "channel"),
//                   )}
//                 </p>

//                 {groupData?.description && (
//                   <p className="mt-1 line-clamp-2 text-sm text-gray-300">
//                     {groupData.description}
//                   </p>
//                 )}

//                 {task?.description && !groupData?.description && (
//                   <p className="mt-1 line-clamp-2 text-sm text-gray-300">
//                     {task.description}
//                   </p>
//                 )}

//                 <div className="mt-2 flex items-center gap-4 text-xs text-gray-200">
//                   {groupData?.memberCount > 0 && (
//                     <div className="flex items-center gap-1">
//                       <Users className="h-3 w-3" />

//                       <span>
//                         {groupData.memberCount.toLocaleString()} members
//                       </span>
//                     </div>
//                   )}

//                   {groupData?.isPrivate ? (
//                     <div className="flex items-center gap-1">
//                       <ShieldAlertIcon className="h-3 w-3" />

//                       <span>Private Group</span>
//                     </div>
//                   ) : (
//                     groupData?.username && (
//                       <div className="flex items-center gap-1">
//                         <Hash className="h-3 w-3" />
//                         <span>@{groupData.username}</span>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
//           <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

//           <p className="text-sm text-gray-100">
//             {isTaskCompleted
//               ? `✅ Completed ${groupData?.title || task?.channelName || task?.groupName}`
//               : `Join ${groupData?.title || task?.channelName || task?.groupName || "our Telegram channel"} to complete this quest.`}
//           </p>
//         </div>

//         {task?.requireVerification &&
//           !joinVerified &&
//           currentAnswer?.joined && (
//             <div className="rounded-xl border border-yellow-300 bg-yellow-900/20 px-3 py-2">
//               <div className="flex items-center gap-2">
//                 <ShieldAlertIcon className="h-4 w-4 text-yellow-400" />

//                 <p className="text-sm text-yellow-300">
//                   After joining, verify your membership to complete this quest.
//                 </p>
//               </div>
//             </div>
//           )}
//       </div>

//       <div className="flex w-full justify-end gap-2">
//         <Button
//           as={Link}
//           target="_blank"
//           href={task?.channelLink}
//           rel="noopener noreferrer"
//           className="bg-gray-700 hover:bg-gray-600"
//           isDisabled={!task?.channelLink}
//           endContent={<ExternalLink className="h-4 w-4" />}
//           onPress={handleJoinGroup}
//         >
//           Join{" "}
//           {getChannelTypeText(
//             groupData?.type || (task?.isGroup ? "supergroup" : "channel"),
//           )}
//         </Button>

//         {task?.requireVerification && !joinVerified && (
//           <Button
//             isLoading={loading}
//             onPress={handleVerifyJoin}
//             isDisabled={!task?.channelLink || loading}
//             className="border border-white bg-gradient-primary hover:opacity-90"
//           >
//             {loading ? "Verifying..." : "Verify Membership"}
//           </Button>
//         )}

//         {isTaskCompleted && (
//           <Button className="bg-green-600 hover:bg-green-700" isDisabled={true}>
//             ✅ Completed
//           </Button>
//         )}
//       </div>
//     </>
//   );
// };

// export default QuestTelegramTask;

"use client";

import {
  Hash,
  Users,
  Settings,
  ExternalLink,
  ShieldAlertIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Link, addToast } from "@heroui/react";

import {
  updateTaskAnswer,
  selectTaskAnswer,
  selectIsTaskCompleted,
} from "@/redux/slice/submissionSlice";

const QuestTelegramTask = ({ task, questId, telegramUser }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [groupData, setGroupData] = useState(null);

  // Get current task state from Redux
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );
  const isTaskCompleted = useSelector((state) =>
    selectIsTaskCompleted(state, questId, task.id),
  );

  // Determine if join is verified based on current answer
  const joinVerified = currentAnswer?.verified || false;
  const hasJoined = currentAnswer?.joined || false;

  // Helper function for channel type text
  const getChannelTypeText = (type) => {
    const types = {
      channel: "Channel",
      supergroup: "Group",
      group: "Group",
    };
    return types[type] || "Channel";
  };

  // Fetch real group information using bot
  const fetchGroupInfo = async () => {
    if (!task?.chatId) {
      // Fallback to task data if no chatId
      setGroupData({
        title: task?.groupName || task?.channelName,
        description: task?.description || "",
        type: task?.isGroup ? "supergroup" : "channel",
        memberCount: 0,
        photo: null,
        isPrivate: true,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/socials/telegram/group-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            chatId: task.chatId,
          }),
        },
      );

      const data = await response.json();

      if (data.success && data.groupData) {
        setGroupData(data.groupData);
      } else {
        throw new Error(data.message || "Failed to get group info");
      }
    } catch (err) {
      // Fallback to task data
      setGroupData({
        title: task?.groupName || task?.channelName,
        description: task?.description || "",
        type: task?.isGroup ? "supergroup" : "channel",
        memberCount: 0,
        photo: null,
        isPrivate: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking "Join Channel/Group" button
  const handleJoinGroup = () => {
    // Mark as joined
    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: {
          joined: true,
          verified: false,
          joinedAt: new Date().toISOString(),
          groupName: groupData?.title || task?.channelName || task?.groupName,
          groupType:
            groupData?.type || (task?.isGroup ? "supergroup" : "channel"),
        },
      }),
    );
  };

  const handleVerifyJoin = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/socials/telegram/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            chatId: task.chatId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Verification failed.");
      }

      // Update Redux with verified status - this should trigger task completion in parent
      dispatch(
        updateTaskAnswer({
          questId,
          taskId: task.id,
          answer: {
            joined: true,
            verified: true,
            joinedAt: currentAnswer?.joinedAt || new Date().toISOString(),
            verifiedAt: new Date().toISOString(),
            groupName: groupData?.title || task?.channelName || task?.groupName,
            groupType:
              groupData?.type || (task?.isGroup ? "supergroup" : "channel"),
          },
        }),
      );

      addToast({
        title: "Verification Successful",
        description: `Successfully verified membership in ${groupData?.title || task?.channelName || task?.groupName}`,
        color: "success",
      });
    } catch (err) {
      console.error("Verification failed:", err);
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

  useEffect(() => {
    fetchGroupInfo();
  }, [task?.chatId]);

  // If Telegram is not connected, show connection message
  if (!telegramUser) {
    return (
      <div className="mb-3 space-y-3">
        <div className="rounded-xl border border-amber-300 bg-amber-900/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
              <ShieldAlertIcon className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-grow">
              <h3 className="text-lg font-bold text-amber-200">
                Telegram Not Connected
              </h3>
              <p className="mt-1 text-sm text-amber-300">
                Connect your Telegram account to NeoPod to verify membership in
                Telegram channels and groups.
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
                <ShieldAlertIcon className="h-3 w-3" />
                <span>Required for Telegram quest verification</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <ShieldAlertIcon className="h-4 w-4 text-gray-100" />
          <p className="text-sm text-gray-100">
            Connect Telegram to participate in channel and group quests.
          </p>
        </div>

        <div className="flex w-full justify-end">
          <Button
            as={Link}
            href="/settings?tab=socials"
            className="border border-white bg-gradient-primary hover:opacity-90"
            endContent={<Settings className="h-4 w-4" />}
          >
            Connect Telegram
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 space-y-3">
        {(groupData || task?.channelName || task?.groupName) && (
          <div className="rounded-xl border border-gray-600 bg-gray-700 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                {groupData?.photo ? (
                  <Image
                    width={48}
                    height={48}
                    src={groupData.photo}
                    alt="Group Photo"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {(groupData?.title ||
                      task?.channelName ||
                      task?.groupName ||
                      "T")[0].toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-grow">
                <h3 className="truncate text-lg font-bold text-white">
                  {groupData?.title ||
                    task?.channelName ||
                    task?.groupName ||
                    "Telegram Channel"}
                </h3>

                <p className="text-sm text-gray-300">
                  {groupData?.isPrivate ? "Private " : ""}
                  Telegram{" "}
                  {getChannelTypeText(
                    groupData?.type ||
                      (task?.isGroup ? "supergroup" : "channel"),
                  )}
                </p>

                {groupData?.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-300">
                    {groupData.description}
                  </p>
                )}

                {task?.description && !groupData?.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-300">
                    {task.description}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-4 text-xs text-gray-200">
                  {groupData?.memberCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />

                      <span>
                        {groupData.memberCount.toLocaleString()} members
                      </span>
                    </div>
                  )}

                  {groupData?.isPrivate ? (
                    <div className="flex items-center gap-1">
                      <ShieldAlertIcon className="h-3 w-3" />

                      <span>Private Group</span>
                    </div>
                  ) : (
                    groupData?.username && (
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        <span>@{groupData.username}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

          <p className="text-sm text-gray-100">
            {isTaskCompleted
              ? `✅ Completed ${groupData?.title || task?.channelName || task?.groupName}`
              : `Join ${groupData?.title || task?.channelName || task?.groupName || "our Telegram channel"} and verify membership to complete this quest.`}
          </p>
        </div>

        {/* Show pending verification message when user has joined but not verified */}
        {hasJoined && !joinVerified && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-900/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <ShieldAlertIcon className="h-4 w-4 text-yellow-400" />

              <p className="text-sm text-yellow-300">
                Great! Now verify your membership to complete this quest.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full justify-end gap-2">
        {/* Always show Join button if not completed */}
        {!isTaskCompleted && (
          <Button
            as={Link}
            target="_blank"
            href={task?.channelLink}
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600"
            isDisabled={!task?.channelLink}
            endContent={<ExternalLink className="h-4 w-4" />}
            onPress={handleJoinGroup}
          >
            Join{" "}
            {getChannelTypeText(
              groupData?.type || (task?.isGroup ? "supergroup" : "channel"),
            )}
          </Button>
        )}

        {/* Show Verify Membership button when user has joined but not verified */}
        {hasJoined && !joinVerified && (
          <Button
            isLoading={loading}
            onPress={handleVerifyJoin}
            isDisabled={!task?.channelLink || loading}
            className="border border-white bg-gradient-primary hover:opacity-90"
          >
            {loading ? "Verifying..." : "Verify Membership"}
          </Button>
        )}

        {/* Show completed status */}
        {isTaskCompleted && (
          <Button className="bg-green-600 hover:bg-green-700" isDisabled={true}>
            ✅ Completed
          </Button>
        )}
      </div>
    </>
  );
};

export default QuestTelegramTask;
