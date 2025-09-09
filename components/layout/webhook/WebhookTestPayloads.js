"use client";

import { useState } from "react";
import { Copy, Check, ChevronRight, ChevronDown } from "lucide-react";

const TIMESTAMP = new Date().toISOString();

const getSamplePayload = (event) => {
  const baseUser = {
    id: "amb_neo_101",
    username: "neo_builder",
    email: "builder@neo.org",
    role_type: "ambassador",
    discord: { id: "93021", username: "neo_builder#2025" },
    telegram: { id: "88291", username: "neopod_dev" },
    twitter: { id: "72910", username: "@neo_builder" },
    wallet_address: "0x11c5fE402fd39698d1144AD027A2fF2471d723af",
    current_month_points: 320,
    total_points: 4520,
    total_quests_completed: 58,
  };

  const baseQuest = {
    id: "quest_neopod_204",
    name: "Share about Neo X on Twitter",
    rewards: [{ type: "points", amount: 250 }],
    points: 250,
    total_submissions: 134,
    created_by: "admin_core_001",
    tasks: ["Share URL", "Verify post"],
  };

  const baseSubmission = {
    id: "sub_neo_567",
    submission_data: {
      proof:
        "https://xexplorer.neo.org/address/0x11c5fE402fd39698d1144AD027A2fF2471d723af",
    },
    submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  };

  const reviewerData = {
    id: "admin_core_001",
    username: "neo_admin",
    email: "admin@neo.org",
    role_type: "admin",
    assigned_pods: ["english", "arabic"],
  };

  const payloads = {
    "quest.succeeded": {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_english_01",
      user: baseUser,
      quest: baseQuest,
      submission: {
        ...baseSubmission,
        review_status: "approved",
        review_comment: "Post verified on X ✅",
        reviewed_at: TIMESTAMP,
        approved_at: TIMESTAMP,
      },
      reviewerData,
      oldStatus: "pending",
      newStatus: "approved",
      timestamp: TIMESTAMP,
    },
    "quest.failed": {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_english_01",
      user: baseUser,
      quest: baseQuest,
      submission: {
        ...baseSubmission,
        review_status: "rejected",
        review_comment: "Post not found on X ❌",
        reviewed_at: TIMESTAMP,
      },
      reviewerData,
      oldStatus: "pending",
      newStatus: "rejected",
      reason: "Invalid or missing proof of deployment",
      timestamp: TIMESTAMP,
    },
    "quest.claimed": {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_english_01",
      user: baseUser,
      quest: baseQuest,
      submission: {
        ...baseSubmission,
        review_status: "pending",
        claim_status: "claimed",
        claimed_at: TIMESTAMP,
      },
      timestamp: TIMESTAMP,
    },
    "quest.claim_status_updated": {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_english_01",
      user: baseUser,
      quest: baseQuest,
      submission: {
        ...baseSubmission,
        claim_status: "approved",
        claim_updated_at: TIMESTAMP,
      },
      oldClaimStatus: "pending",
      newClaimStatus: "approved",
      reviewerData,
      timestamp: TIMESTAMP,
    },
    "join.community": {
      ambassador_id: "amb_neo_101",
      pod_id: "pod_english_01",
      user: {
        id: "amb_neo_555",
        username: "neo_newbie",
        email: "newbie@neopod.io",
        wallet_address: "0x4B12D34c56Ef7890ABcdEf9012345678Fabcdef90",
        role_type: "initiate",
        invited_by: "amb_neo_101",
      },
      joined_at: TIMESTAMP,
    },
    "sprint.started": {
      sprint_id: "sprint_neo_aug_2025",
      name: "Neo Global Sprint - August 2025",
      started_at: TIMESTAMP,
    },
    "sprint.ended": {
      sprint_id: "sprint_neo_aug_2025",
      name: "Neo Global Sprint - August 2025",
      ended_at: TIMESTAMP,
    },
    "user.banned": {
      ambassador_id: "amb_neo_101",
      pod_id: "pod_english_01",
      pod: {
        id: "pod_english_01",
        name: "English Ambassadors",
        description: "Ambassadors who promote the English language.",
      },
      ban_details: {
        reason: "Repeated submission of fraudulent proofs",
        banned_by: "admin_core_001",
        banned_at: TIMESTAMP,
      },
      admin: reviewerData,
    },
  };

  return JSON.stringify(payloads[event] || {}, null, 2);
};

const PayloadCard = ({ event }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const payload = getSamplePayload(event);

  const handleCopy = () => {
    navigator.clipboard.writeText(getSamplePayload(event));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-dark/50 rounded-lg border border-gray-500">
      <div
        className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-700/40"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-gray-200" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-200" />
          )}

          <span className="select-none text-sm font-medium text-purple-300">
            {event}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="rounded p-1 transition"
          aria-label="Copy payload"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-gray-200" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="thin-scrollbar max-h-72 overflow-x-auto overflow-y-scroll border-t border-gray-600 bg-black/40 p-3">
          <pre className="text-wrap text-xs text-gray-100">{payload}</pre>
        </div>
      )}
    </div>
  );
};

const WebhookTestPayloads = ({ events }) => {
  if (!events?.length) return null;

  return (
    <div className="space-y-3 border-t border-gray-700 pt-4">
      <h5 className="mb-2 text-sm font-medium text-gray-200">
        Sample Payloads
      </h5>

      <div className="space-y-2">
        {events.map((event) => (
          <PayloadCard key={event} event={event} />
        ))}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Structure varies by event type. All payloads include{" "}
        <span className="font-semibold">timestamp</span> and HMAC signature
        headers.
      </p>
    </div>
  );
};

export default WebhookTestPayloads;
