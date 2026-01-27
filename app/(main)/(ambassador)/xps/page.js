import { cookies } from "next/headers";
import React, { Suspense } from "react";

import XpsList from "@/components/layout/ambassadors/xps/XpsList";

export const metadata = {
  title: "XP Activity | NeoPod",
  description:
    "Track your XP rewards and quest progress as an ambassador in the NeoPod community.",
};

const fetchXps = async (limit = 10, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    return { xps: [], pagination: { hasMore: false, lastKey: null } };
  }

  const params = new URLSearchParams({
    limit: limit.toString(),
    xps: "true",
  });

  if (lastKey) params.append("last_key", lastKey);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/submissions?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(`XP Fetch Failed: ${response.status}`);
      return { xps: [], pagination: { hasMore: false, lastKey: null } };
    }

    const data = await response.json();

    return {
      xps: data.data?.submissions || [],
      pagination: {
        hasMore: !!data.data?.next_key,
        lastKey: data.data?.next_key || null,
      },
    };
  } catch (error) {
    console.error("Error loading XPs:", error);
    return { xps: [], pagination: { hasMore: false, lastKey: null } };
  }
};

const XpsPage = async () => {
  const { xps, pagination } = await fetchXps(10);

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-400">Loading activity...</div>
      }
    >
      <XpsList
        initialXps={xps}
        initialLastKey={pagination.lastKey}
        initialHasMore={pagination.hasMore}
      />
    </Suspense>
  );
};

export default XpsPage;
