"use client";

import { useState } from "react";
import { Copy, Check, ChevronRight, ChevronDown } from "lucide-react";

const TIMESTAMP = new Date().toISOString();

const getSamplePayload = (event) => {
  const baseUser = {
    id: "amb_neo_101",
    username: "neo_builder",
    email: "builder@neo.org",
    role_type: "operator",
    discord: { id: "93021", username: "neo_builder#2025" },
    telegram: { id: "88291", username: "neopod_dev" },
    twitter: { id: "72910", username: "@neo_builder" },
    wallet_address: "0x11c5fE402fd39698d1144AD027A2fF2471d723af",
    pod_id: "pod_english_01",
    current_month_points: 1250,
    total_points: 8750,
    total_quests_completed: 32,
    current_month_quests: 8,
    location: "San Francisco, CA",
    profile_photo: "https://avatar.example.com/neo_builder.jpg",
    is_verified: true,
    status: "active",
    joining_date: "2024-06-15T10:30:00.000Z",
    invite_code: "NEO_BUILD_2024",
    invite_count: 5,
    valid_invite_count: 3,
  };

  const baseQuest = {
    id: "quest_neo_x_twitter_share",
    name: "Share Neo X Integration Tutorial",
    rewards: [
      { type: "points", amount: 500 },
      { type: "token", amount: "25", tokenType: "native" },
    ],
    points: 500,
    total_submissions: 87,
    created_by: "admin_core_001",
    tasks: [
      { id: "task_1", name: "Create Twitter thread" },
      { id: "task_2", name: "Include Neo X hashtags" },
    ],
  };

  const baseSubmission = {
    id: "sub_neo_567",
    review_comment: null,
    review_status: "pending",
    reviewed_at: null,
    submission_data: {
      task_1: "https://twitter.com/neo_builder/status/1234567890",
      task_2: "#NeoX #SmartContract #Tutorial",
    },
    submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  };

  const reviewerData = {
    id: "admin_core_001",
    username: "neo_admin",
    email: "admin@neo.org",
    role_type: "Super Admin",
    assigned_pods: ["english", "spanish", "chinese"],
  };

  const payloads = {
    "quest.succeeded": {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_neo_x_twitter_share",
      user: baseUser,
      quest: baseQuest,
      submission: {
        ...baseSubmission,
        review_status: "approved",
        review_comment:
          "Excellent Twitter thread! Great engagement and proper hashtag usage.",
        reviewed_at: TIMESTAMP,
        approved_at: TIMESTAMP,
      },
      reviewerData,
      points_earned: 500,
      completed_at: TIMESTAMP,
    },

    "quest.failed": {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_neo_x_twitter_share",
      user: baseUser,
      quest: baseQuest,
      submission: {
        ...baseSubmission,
        review_status: "rejected",
        review_comment:
          "Twitter link is broken and hashtags are missing. Please resubmit with valid proof.",
        reviewed_at: TIMESTAMP,
      },
      reviewerData,
      failure_reason:
        "Invalid proof: broken Twitter link and missing required hashtags",
      reviewed_by: reviewerData,
      failed_at: TIMESTAMP,
    },

    "quest.claimed": {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_neo_x_twitter_share",
      user: baseUser,
      quest: baseQuest,
      submission: {
        ...baseSubmission,
        review_status: "pending",
      },
      claimed_at: TIMESTAMP,
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

    "user.role.changed": {
      ambassador_id: "amb_neo_101",
      pod_id: "pod_english_01",
      ambassador: {
        ...baseUser,
        total_rewards_claimed: 2500.75,
        total_tokens_earned: 850.25,
        last_claimed_points_threshold: 5000,
      },
      pod: {
        id: "pod_english_01",
        name: "English Global Ambassadors",
        description:
          "Community ambassadors promoting Neo ecosystem in English-speaking regions",
      },
      role_change: {
        from: "initiate",
        to: "operator",
        reason: "self_promotion_request",
        changed_at: TIMESTAMP,
      },
      promotion_details: {
        nft_minting: {
          success: true,
          job_ids: ["nft_job_abc123", "nft_job_def456"],
          error: null,
        },
        discord_role_updated: true,
        eligibility_requirements_met: true,
        stats_snapshot: {
          previous_month_stats: {
            role_specific: { rank: 3, points: 1250 },
          },
          eligibility_requirements: {
            min_points: 1000,
            min_rank: 5,
            min_quests: 5,
          },
          current_status: {
            points: 1250,
            rank: 3,
            quests: 8,
          },
        },
      },
      admin: null,
      changed_at: TIMESTAMP,
    },

    "join.community": {
      ambassador_id: "amb_neo_555",
      pod_id: "pod_english_01",
      user: {
        id: "amb_neo_555",
        username: "neo_newbie",
        email: "newbie@neopod.io",
        role_type: "initiate",
        invited_by: "amb_neo_101",
      },
      pod: {
        id: "pod_english_01",
        name: "English Global Ambassadors",
        description:
          "Community ambassadors promoting Neo ecosystem in English-speaking regions",
      },
      joined_at: TIMESTAMP,
    },

    "sprint.started": {
      sprint_id: "sprint_neo_q4_2025",
      sprint: {
        id: "sprint_neo_q4_2025",
        title: "Neo X Integration Challenge - Q4 2025",
        description: "Build and deploy smart contracts on Neo X testnet",
        start_date: TIMESTAMP,
        end_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      },
      community: {
        id: "pod_english_01",
        name: "English Global Ambassadors",
      },
      started_at: TIMESTAMP,
    },

    "sprint.ended": {
      sprint_id: "sprint_neo_q4_2025",
      sprint: {
        id: "sprint_neo_q4_2025",
        title: "Neo X Integration Challenge - Q4 2025",
        start_date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        end_date: TIMESTAMP,
      },
      community: {
        id: "pod_english_01",
        name: "English Global Ambassadors",
      },
      statistics: {
        total_participants: 127,
      },
      ended_at: TIMESTAMP,
    },

    "user.banned": {
      ambassador_id: "amb_neo_999",
      pod_id: "pod_english_01",
      ambassador: {
        id: "amb_neo_999",
        username: "bad_actor",
        email: "fraud@example.com",
        previous_status: "active",
        previous_role: "initiate",
        role_type: "initiate",
        total_points: 450,
        banned_at: TIMESTAMP,
        submissions_rejected_count: 3,
      },
      pod: {
        id: "pod_english_01",
        name: "English Global Ambassadors",
        description:
          "Community ambassadors promoting Neo ecosystem in English-speaking regions",
      },
      ban_details: {
        reason:
          "Repeated submission of fraudulent proofs and violation of community guidelines",
        banned_by: "neo_admin",
        banned_at: TIMESTAMP,
      },
      admin: {
        id: "neo_admin",
        username: "neo_admin",
        email: "admin@neo.org",
        role_type: "Super Admin",
      },
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
        All payloads include HMAC SHA-256 signature in{" "}
        <span className="rounded bg-gray-800 px-1 font-mono text-purple-300">
          X-Webhook-Signature
        </span>{" "}
        header and event metadata.
      </p>
    </div>
  );
};

export default WebhookTestPayloads;
