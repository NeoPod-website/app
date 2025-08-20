import React from "react";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import MainPageScroll from "@/components/common/MainPageScroll";

import AmbassadorWithFilter from "@/components/layout/ambassadors/manage/AmbassadorWithFilter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Ambassadors | Admin Panel | NeoPod",
  description:
    "View and manage ambassador profiles, roles, and activity. Empower your community with the right permissions and oversight.",
};

async function fetchAmbassadors(podId, limit) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  let url = `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/pod/${podId}/filter?limit=${limit}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }

    throw new Error(`Failed to fetch ambassadors: ${response.statusText}`);
  }

  return data;
}

const ManageAmbassadorsPage = async ({ params }) => {
  const { podId } = await params;
  const { user } = await getCachedSession();

  const ambassadorsData = await fetchAmbassadors(podId, 10);

  return (
    <MainPageScroll scrollable={false}>
      <Suspense>
        <AmbassadorWithFilter
          user={user}
          podId={podId}
          initialAmbassadors={ambassadorsData.data || []}
          initialPagination={ambassadorsData.pagination || {}}
        />
      </Suspense>
    </MainPageScroll>
  );
};

export default ManageAmbassadorsPage;
