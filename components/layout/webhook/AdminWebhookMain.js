// "use client";

// import React, { useState, useCallback, useMemo } from "react";

// import AdminEditWebhook from "./AdminEditWebhook";
// import AdminCreateWebhook from "./AdminCreateWebhook";
// import WrapperContainer from "@/components/common/WrapperContainer";

// const DEFAULT_WEBHOOK_DATA = {
//   name: "",
//   url: "",
//   events: [],
//   description: "",
//   status: "active",
// };

// // Move sample data outside component to prevent recreation
// const getSamplePayload = (eventType) => {
//   const samples = {
//     "user.banned": {
//       user_id: "user_123",
//       username: "john_doe",
//       reason: "violation of terms",
//       banned_by: "admin_456",
//       ban_duration: "permanent",
//     },
//     "quest.succeeded": {
//       user_id: "user_123",
//       quest_id: "quest_456",
//       quest_title: "Complete Daily Tasks",
//       points_earned: 100,
//       completion_time: new Date().toISOString(),
//     },
//     "quest.failed": {
//       user_id: "user_123",
//       quest_id: "quest_456",
//       quest_title: "Weekly Challenge",
//       failure_reason: "timeout",
//       points_lost: 50,
//     },
//     "sprint.started": {
//       sprint_id: "sprint_789",
//       sprint_name: "Q1 Challenge",
//       start_date: new Date().toISOString(),
//       end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//       participants_count: 45,
//     },
//   };

//   const payload = {
//     event: eventType,
//     timestamp: new Date().toISOString(),
//     webhook_id: "webhook_123",
//     data: samples[eventType] || samples["quest.succeeded"],
//   };

//   return JSON.stringify(payload, null, 2);
// };

// const isValidUrl = (string) => {
//   try {
//     new URL(string);
//     return true;
//   } catch {
//     return false;
//   }
// };

// const AdminWebhookMain = ({ isNew = false, initialWebhookData = {} }) => {
//   const initialData = useMemo(
//     () => ({
//       name: initialWebhookData.name || DEFAULT_WEBHOOK_DATA.name,
//       url: initialWebhookData.url || DEFAULT_WEBHOOK_DATA.url,
//       events: initialWebhookData.events || DEFAULT_WEBHOOK_DATA.events,
//       description:
//         initialWebhookData.description || DEFAULT_WEBHOOK_DATA.description,
//       status: initialWebhookData.status || DEFAULT_WEBHOOK_DATA.status,
//     }),
//     [initialWebhookData],
//   );

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [webhookData, setWebhookData] = useState(initialData);

//   const handleWebhookDataChange = useCallback((field, value) => {
//     setWebhookData((prev) => ({ ...prev, [field]: value }));
//   }, []);

//   // Memoize computed values
//   const isUrlValid = useMemo(
//     () => webhookData.url && isValidUrl(webhookData.url),
//     [webhookData.url],
//   );

//   const hasEvents = webhookData.events.length > 0;
//   const hasDescription = Boolean(webhookData.description);

//   const FormComponent = useMemo(() => {
//     const commonProps = {
//       webhookData,
//       isSubmitting,
//       setIsSubmitting,
//       handleWebhookDataChange,
//     };

//     return isNew ? (
//       <AdminCreateWebhook {...commonProps} />
//     ) : (
//       <AdminEditWebhook
//         {...commonProps}
//         initialWebhookData={initialWebhookData}
//       />
//     );
//   }, [
//     isNew,
//     webhookData,
//     isSubmitting,
//     handleWebhookDataChange,
//     initialWebhookData,
//   ]);

//   return (
//     <section className="flex flex-1 gap-4 overflow-hidden">
//       <WrapperContainer scrollable className="space-y-10 p-6 3xl:p-10">
//         {FormComponent}
//       </WrapperContainer>

// <WrapperContainer scrollable className="p-6">
//   <div className="hide-scroll flex-1 space-y-6 overflow-y-auto">
//     <h3 className="mb-4 text-lg font-semibold text-white">Preview</h3>

//     <div className="space-y-4">
//       <div className="space-y-2">
//         <div className="flex items-center gap-2">
//           <div
//             className={`h-2 w-2 rounded-full ${
//               webhookData.status === "active"
//                 ? "bg-green-400"
//                 : "bg-red-400"
//             }`}
//           />

//           <h4 className="text-base font-semibold capitalize text-white">
//             {webhookData.name || "Unnamed Webhook"}
//           </h4>
//         </div>

//         <div className="ml-4">
//           <p className="break-all font-mono text-sm text-blue-400">
//             {webhookData.url || "https://your-endpoint.com/webhook"}
//           </p>

//           {webhookData.description && (
//             <p className="mt-2 text-sm text-gray-200">
//               {webhookData.description}
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="border-t border-gray-700 pt-4">
//         <div className="mb-2 flex items-center justify-between">
//           <h5 className="text-sm font-medium text-gray-200">Events</h5>

//           <span className="text-xs text-gray-200">
//             {webhookData.events.length} selected
//           </span>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {hasEvents ? (
//             webhookData.events.map((event) => (
//               <span
//                 key={event}
//                 className="rounded-md border border-purple-600/30 bg-purple-600/20 px-2 py-1 text-xs font-medium text-purple-300"
//               >
//                 {event}
//               </span>
//             ))
//           ) : (
//             <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-gray-400 py-4">
//               <span className="text-sm text-gray-200">
//                 No events selected
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {hasEvents && (
//         <div className="border-t border-gray-700 pt-4">
//           <h5 className="mb-3 text-sm font-medium text-gray-200">
//             Sample Payload
//           </h5>

//           <div className="rounded-lg border-y border-gray-500 bg-gradient-dark/60 p-4">
//             <pre className="whitespace-pre-wrap text-xs text-gray-100">
//               {getSamplePayload(webhookData.events[0])}
//             </pre>
//           </div>

//           <p className="mt-2 text-xs text-gray-300">
//             Structure varies by event type. All payloads include timestamp
//             and HMAC signature headers.
//           </p>
//         </div>
//       )}
//     </div>

//     <div className="rounded-xl border-t border-gray-400 bg-gradient-dark/60 p-6 backdrop-blur-sm">
//       <h3 className="mb-4 text-lg font-semibold text-white">
//         Configuration
//       </h3>

//       <div className="grid grid-cols-2 gap-4 text-sm">
//         <div className="space-y-1">
//           <span className="text-gray-400">Status</span>
//           <div className="flex items-center gap-2">
//             <div
//               className={`h-2 w-2 rounded-full ${
//                 webhookData.status === "active"
//                   ? "bg-green-400"
//                   : "bg-red-400"
//               }`}
//             />
//             <span className="font-medium capitalize text-white">
//               {webhookData.status || "active"}
//             </span>
//           </div>
//         </div>

//         <div className="space-y-1">
//           <span className="text-gray-400">Events</span>
//           <span className="block font-medium text-white">
//             {webhookData.events.length} / 8
//           </span>
//         </div>

//         <div className="space-y-1">
//           <span className="text-gray-400">URL</span>
//           <div className="flex items-center gap-2">
//             <div
//               className={`h-2 w-2 rounded-full ${
//                 isUrlValid ? "bg-green-400" : "bg-red-400"
//               }`}
//             />
//             <span className="font-medium text-white">
//               {isUrlValid ? "Valid" : "Invalid"}
//             </span>
//           </div>
//         </div>

//         <div className="space-y-1">
//           <span className="text-gray-400">Description</span>
//           <span className="block font-medium text-white">
//             {hasDescription ? "Added" : "None"}
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
// </WrapperContainer>
//     </section>
//   );
// };

// export default AdminWebhookMain;

"use client";

import React, { useState, useCallback, useMemo } from "react";

import AdminEditWebhook from "./AdminEditWebhook";
import AdminCreateWebhook from "./AdminCreateWebhook";

import WrapperContainer from "@/components/common/WrapperContainer";

const DEFAULT_WEBHOOK_DATA = {
  url: "",
  name: "",
  events: [],
  description: "",
  status: "active",
};

// Move sample data outside component to prevent recreation
const getSamplePayload = (eventType) => {
  const samples = {
    "user.banned": {
      user_id: "user_123",
      username: "john_doe",
      reason: "violation of terms",
      banned_by: "admin_456",
      ban_duration: "permanent",
    },

    "quest.succeeded": {
      user_id: "user_123",
      quest_id: "quest_456",
      quest_title: "Complete Daily Tasks",
      points_earned: 100,
      completion_time: new Date().toISOString(),
    },

    "quest.failed": {
      user_id: "user_123",
      quest_id: "quest_456",
      quest_title: "Weekly Challenge",
      failure_reason: "timeout",
      points_lost: 50,
    },

    "quest.claimed": {
      user_id: "user_123",
      quest_id: "quest_456",
      claim_id: "claim_789",
      submission_url: "https://example.com/submission",
      claimed_at: new Date().toISOString(),
    },

    "join.community": {
      ambassador_id: "user_123",
      community_id: "pod_456",
      ambassador: {
        id: "user_123",
        username: "Sam",
        email: "sam@example.com",
        display_name: "Sam",
      },
      community: {
        id: "pod_456",
        name: "NeoPod English",
        description: "This is NeoPod english community.",
      },
      joined_at: new Date().toISOString(),
    },

    "sprint.started": {
      sprint_id: "sprint_789",
      sprint_name: "Q1 Challenge",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      participants_count: 45,
    },
  };

  const payload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    data: samples[eventType] || samples["quest.succeeded"],
  };

  return JSON.stringify(payload, null, 2);
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

const AdminWebhookMain = ({ isNew = false, initialWebhookData = {} }) => {
  const initialData = useMemo(
    () => ({
      name: initialWebhookData.name || DEFAULT_WEBHOOK_DATA.name,
      url: initialWebhookData.url || DEFAULT_WEBHOOK_DATA.url,
      events: initialWebhookData.events || DEFAULT_WEBHOOK_DATA.events,
      description:
        initialWebhookData.description || DEFAULT_WEBHOOK_DATA.description,
      status: initialWebhookData.status || DEFAULT_WEBHOOK_DATA.status,
    }),
    [initialWebhookData],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookData, setWebhookData] = useState(initialData);

  const handleWebhookDataChange = useCallback((field, value) => {
    setWebhookData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Memoize computed values
  const isUrlValid = useMemo(
    () => webhookData.url && isValidUrl(webhookData.url),
    [webhookData.url],
  );

  const hasEvents = webhookData.events.length > 0;
  const hasDescription = Boolean(webhookData.description);

  const FormComponent = useMemo(() => {
    const commonProps = {
      webhookData,
      isSubmitting,
      setIsSubmitting,
      handleWebhookDataChange,
    };

    return isNew ? (
      <AdminCreateWebhook {...commonProps} />
    ) : (
      <AdminEditWebhook
        {...commonProps}
        initialWebhookData={initialWebhookData}
      />
    );
  }, [
    isNew,
    webhookData,
    isSubmitting,
    handleWebhookDataChange,
    initialWebhookData,
  ]);

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      <WrapperContainer scrollable className="space-y-10 p-6 3xl:p-10">
        {FormComponent}
      </WrapperContainer>

      <WrapperContainer scrollable className="p-6">
        <div className="hide-scroll flex-1 space-y-6 overflow-y-auto">
          <h3 className="mb-4 text-lg font-semibold text-white">Preview</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    webhookData.status === "active"
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                />

                <h4 className="text-base font-semibold capitalize text-white">
                  {webhookData.name || "Unnamed Webhook"}
                </h4>
              </div>

              <div className="ml-4">
                <p className="break-all font-mono text-sm text-blue-400">
                  {webhookData.url || "https://your-endpoint.com/webhook"}
                </p>

                {webhookData.description && (
                  <p className="mt-2 text-sm text-gray-200">
                    {webhookData.description}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-200">Events</h5>

                <span className="text-xs text-gray-200">
                  {webhookData.events.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {hasEvents ? (
                  webhookData.events.map((event) => (
                    <span
                      key={event}
                      className="rounded-md border border-purple-600/30 bg-purple-600/20 px-2 py-1 text-xs font-medium text-purple-300"
                    >
                      {event}
                    </span>
                  ))
                ) : (
                  <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-gray-400 py-4">
                    <span className="text-sm text-gray-200">
                      No events selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            {hasEvents && (
              <div className="border-t border-gray-700 pt-4">
                <h5 className="mb-3 text-sm font-medium text-gray-200">
                  Sample Payload
                </h5>

                <div className="rounded-lg border-y border-gray-500 bg-gradient-dark/60 p-4">
                  <pre className="whitespace-pre-wrap text-xs text-gray-100">
                    {getSamplePayload(webhookData.events[0])}
                  </pre>
                </div>

                <p className="mt-2 text-xs text-gray-300">
                  Structure varies by event type. All payloads include timestamp
                  and HMAC signature headers.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border-t border-gray-400 bg-gradient-dark/60 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Configuration
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-gray-400">Status</span>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      webhookData.status === "active"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  />

                  <span className="font-medium capitalize text-white">
                    {webhookData.status || "active"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Events</span>

                <span className="block font-medium text-white">
                  {webhookData.events.length} / 6
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">URL</span>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isUrlValid ? "bg-green-400" : "bg-red-400"
                    }`}
                  />

                  <span className="font-medium text-white">
                    {isUrlValid ? "Valid" : "Invalid"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Description</span>

                <span className="block font-medium text-white">
                  {hasDescription ? "Added" : "None"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </WrapperContainer>
    </section>
  );
};

export default AdminWebhookMain;
