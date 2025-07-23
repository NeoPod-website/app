import shortAddress from "@/utils/shortAddress";

export const roleIcons = {
  architect: "🏗️",
  sentinel: "🛡️",
  operator: "⚡",
  initiate: "🌟",
};

export const getRoleGradient = (role) => {
  switch (role) {
    case "architect":
      return "bg-gradient-rank-architect";
    case "sentinel":
      return "bg-gradient-rank-sentinel";
    case "operator":
      return "bg-gradient-rank-operator";
    case "initiate":
      return "bg-gradient-rank-initiate";
    default:
      return "bg-gray-600";
  }
};

export const formatTimeAgo = (timestamp) => {
  const now = new Date();

  const activityTime = new Date(timestamp);
  const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";

  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return `${Math.floor(diffInDays / 7)}w ago`;
};

export const getContactInfo = (ambassador) => {
  if (ambassador.email && ambassador.wallet_address) {
    return {
      primary: ambassador.email,
      secondary: shortAddress(ambassador.wallet_address),
      hasMultiple: true,
    };
  } else if (ambassador.email) {
    return {
      primary: ambassador.email,
      secondary: null,
      hasMultiple: false,
    };
  } else if (ambassador.wallet_address) {
    return {
      primary: shortAddress(ambassador.wallet_address),
      secondary: null,
      hasMultiple: false,
    };
  }
  return { primary: "No contact info", secondary: null, hasMultiple: false };
};
