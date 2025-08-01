import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import PodsList from "@/components/layout/pods/PodList";
import MainPageScroll from "@/components/common/MainPageScroll";
import DeleteConfirmationModal from "@/components/ui/modals/DeleteConfirmationModal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage PODS | Admin Panel | NeoPod",
  description:
    "Create, edit, and organize PODS for ambassadors. Shape the journey and engagement through meaningful tasks and challenges.",
};

async function fetchPods(startKey = null, limit = 9) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/pods?limit=${limit}`;

    if (startKey) {
      url += `&startKey=${encodeURIComponent(startKey)}`;
    }

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

      throw new Error(`Failed to fetch pods: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching pods:", error);

    throw error;
  }
}

const ManagePODSPage = async () => {
  const podsData = await fetchPods();
  const { user } = await getCachedSession();

  const pods = podsData.data.pods || [];
  const hasMore = podsData.data.pagination.hasMore;
  const lastEvaluatedKey = podsData.data.pagination.lastEvaluatedKey;

  return (
    <>
      <DeleteConfirmationModal />

      <MainPageScroll scrollable={false}>
        <Suspense>
          <PodsList
            user={user}
            hasMore={hasMore}
            initialPods={pods}
            lastEvaluatedKey={lastEvaluatedKey}
          />
        </Suspense>
      </MainPageScroll>
    </>
  );
};

export default ManagePODSPage;
