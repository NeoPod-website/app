import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import LoadMoreSubmissions from "@/components/layout/submissions/LoadMoreSubmissions";

export const metadata = {
  title: "My Submissions | NeoPod",
  description:
    "View and manage your pending quest submissions awaiting review.",
};

const fetchMySubmissions = async (limit = 9, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    return { submissions: [], pagination: { hasMore: false, lastKey: null } };
  }

  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("last_key", lastKey);
  }

  // Call the API which now returns ENRICHED data
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/pending?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      return { submissions: [], pagination: { hasMore: false, lastKey: null } };
    }
    throw new Error(`Failed to fetch submissions: ${response.status}`);
  }

  const data = await response.json();

  return {
    // Data is already enriched by backend helper
    submissions: data.data?.submissions || [],
    pagination: {
      hasMore: !!data.data?.next_key,
      lastKey: data.data?.next_key || null,
    },
  };
};

const SubmissionsPage = async () => {
  const submissionsData = await fetchMySubmissions(10);

  return (
    <Suspense>
      <LoadMoreSubmissions
        initialSubmissions={submissionsData.submissions}
        initialLastKey={submissionsData.pagination.lastKey}
        initialHasMore={submissionsData.pagination.hasMore}
      />
    </Suspense>
  );
};

export default SubmissionsPage;
