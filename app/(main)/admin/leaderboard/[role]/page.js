import React from "react";
import { notFound } from "next/navigation";

const VALID_ROLES = ["operator", "sentinel", "architect"];

export async function generateMetadata({ params }) {
  const { role } = await params;

  if (!VALID_ROLES.includes(role)) {
    return {
      title: "Not Found | Admin Panel | NeoPod",
      description: "The leaderboard you're looking for does not exist.",
    };
  }

  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

  return {
    title: `${capitalizedRole} Leaderboard | Admin Panel | NeoPod`,
    description: `View top-performing ambassadors in the ${capitalizedRole} role. Track progress, contributions, and rankings for this ambassador role within the NeoPod community.`,
  };
}

const LeaderboardPageByRole = async ({ params }) => {
  const { role } = await params;

  if (!VALID_ROLES.includes(role)) {
    notFound();
  }

  return <div>LeaderboardPage for {role}</div>;
};

export default LeaderboardPageByRole;
