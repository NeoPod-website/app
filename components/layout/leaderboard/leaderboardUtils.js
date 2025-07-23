import Image from "next/image";

export const roleIcons = {
  architect: (
    <Image
      src="/ambassadors/architect.png"
      alt="Architect"
      width={24}
      height={24}
      className="rounded-full"
    />
  ),
  sentinel: (
    <Image
      src="/ambassadors/sentinel.png"
      alt="Sentinel"
      width={24}
      height={24}
      className="rounded-full"
    />
  ),
  operator: (
    <Image
      src="/ambassadors/operator.png"
      alt="Operator"
      width={24}
      height={24}
      className="rounded-full"
    />
  ),
  initiate: (
    <Image
      src="/ambassadors/initiate.png"
      alt="Initiate"
      width={24}
      height={24}
      className="rounded-full"
    />
  ),
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
